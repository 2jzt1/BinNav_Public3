/**
 * EdgeOne Functions - 站点提交
 * 路由: /api/submit-website
 * 用途: 接收用户提交的站点，保存到待审核列表并发送邮件通知
 */

// 处理OPTIONS请求（CORS预检）
export async function onRequestOptions({ request }) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  });
}

// 处理POST请求
export async function onRequestPost({ request, env }) {
  const { GITHUB_TOKEN, GITHUB_REPO } = env;
  const RESEND_API_KEY = env.RESEND_API_KEY;
  const ADMIN_EMAIL = env.ADMIN_EMAIL;

  // 检查GitHub配置
  if (!GITHUB_TOKEN) {
    return new Response(JSON.stringify({
      success: false,
      error: 'GITHUB_TOKEN未配置',
      message: '请在EdgeOne项目中配置GITHUB_TOKEN环境变量'
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  if (!GITHUB_REPO) {
    return new Response(JSON.stringify({
      success: false,
      error: 'GITHUB_REPO未配置',
      message: '请在EdgeOne项目中配置GITHUB_REPO环境变量'
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  try {
    // 解析请求数据
    const submissionData = await request.json();
    const { name, url, description, category, tags, contactEmail, submitterName } = submissionData;

    // 验证必填字段
    if (!name || !url || !description || !category || !contactEmail) {
      return new Response(JSON.stringify({
        success: false,
        message: '请填写所有必填字段'
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // 自动补全URL协议并验证格式
    let processedUrl = url.trim();
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      processedUrl = 'https://' + processedUrl;
    }
    
    try {
      new URL(processedUrl);
    } catch {
      return new Response(JSON.stringify({
        success: false,
        message: '请输入有效的网站链接'
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      return new Response(JSON.stringify({
        success: false,
        message: '请输入有效的邮箱地址'
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // 生成提交ID和时间戳
    const submissionId = Date.now().toString();
    const currentTime = new Date().toISOString();

    // 构建待审核站点数据
    const pendingWebsite = {
      id: submissionId,
      name: name.trim(),
      url: processedUrl,
      description: description.trim(),
      category: category.trim(),
      tags: tags ? tags.trim() : '',
      contactEmail: contactEmail.trim(),
      submitterName: submitterName ? submitterName.trim() : '',
      status: 'pending',
      submittedAt: currentTime
    };

    // 获取现有的待审核文件
    let pendingWebsites = [];
    let fileSha = null;

    try {
      const fileResponse = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/public/pending-websites.json`, {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'BinNav-EdgeOne-Functions'
        }
      });

      if (fileResponse.ok) {
        const fileData = await fileResponse.json();
        fileSha = fileData.sha;
        // 清理base64字符串，移除换行符和空格
        const cleanBase64 = fileData.content.replace(/\s/g, '');
        const content = decodeURIComponent(escape(atob(cleanBase64)));
        pendingWebsites = JSON.parse(content);
      }
    } catch (error) {
      console.log('获取现有待审核列表失败，使用空列表:', error);
    }

    // 检查是否重复提交
    const existingSubmission = pendingWebsites.find(site => 
      site.url.toLowerCase() === processedUrl.toLowerCase() ||
      (site.name.toLowerCase() === name.toLowerCase().trim() && site.contactEmail === contactEmail.trim())
    );

    if (existingSubmission) {
      return new Response(JSON.stringify({
        success: false,
        message: '该网站或邮箱已经提交过，请等待审核结果'
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // 添加新提交到列表
    pendingWebsites.push(pendingWebsite);

    // 保存更新后的待审核列表
    const jsonString = JSON.stringify(pendingWebsites, null, 2);
    const updatedContent = btoa(unescape(encodeURIComponent(jsonString)));
    
    const commitResponse = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/public/pending-websites.json`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'BinNav-EdgeOne-Functions'
      },
      body: JSON.stringify({
        message: `新站点提交: ${name}`,
        content: updatedContent,
        sha: fileSha
      })
    });

    if (!commitResponse.ok) {
      const errorText = await commitResponse.text();
      throw new Error(`GitHub更新失败: ${commitResponse.status} ${commitResponse.statusText} - ${errorText}`);
    }

    // 发送邮件通知
    if (RESEND_API_KEY) {
      console.log('=== 邮件通知系统启动 ===');
      console.log('RESEND_API_KEY存在:', !!RESEND_API_KEY);
      console.log('RESEND_API_KEY长度:', RESEND_API_KEY ? RESEND_API_KEY.length : 0);
      
      // 详细的环境变量检查
      console.log('=== 环境变量检查 ===');
      console.log('env对象:', Object.keys(env));
      console.log('ADMIN_EMAIL原始值:', env.ADMIN_EMAIL);
      console.log('ADMIN_EMAIL类型:', typeof env.ADMIN_EMAIL);
      console.log('ADMIN_EMAIL存在:', !!ADMIN_EMAIL);
      console.log('ADMIN_EMAIL值:', ADMIN_EMAIL);
      console.log('ADMIN_EMAIL长度:', ADMIN_EMAIL ? ADMIN_EMAIL.length : 0);
      
      // 1. 发送给管理员的通知邮件
      if (ADMIN_EMAIL) {
        console.log('✅ 开始发送管理员通知邮件');
        console.log('📧 收件人:', ADMIN_EMAIL);
        try {
          const adminEmailPayload = {
            from: 'onboarding@resend.dev',
            to: [ADMIN_EMAIL],
            subject: `[BinNav] 新站点提交 - ${name}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                  <h1 style="margin: 0; font-size: 24px;">📝 新站点提交通知</h1>
                </div>
                
                <div style="padding: 30px; background-color: #f9fafb; border-radius: 0 0 8px 8px;">
                  <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
                    有新的网站提交待您审核，请及时处理。
                  </p>
                  
                  <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <h3 style="margin-top: 0; color: #2563eb;">网站信息</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #6b7280; width: 100px;">网站名称:</td>
                        <td style="padding: 8px 0;">${name}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">网站链接:</td>
                        <td style="padding: 8px 0;"><a href="${processedUrl}" target="_blank" style="color: #2563eb;">${processedUrl}</a></td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">描述:</td>
                        <td style="padding: 8px 0;">${description}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">分类:</td>
                        <td style="padding: 8px 0;">${category}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">标签:</td>
                        <td style="padding: 8px 0;">${tags || '无'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">联系邮箱:</td>
                        <td style="padding: 8px 0;">${contactEmail}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">提交者:</td>
                        <td style="padding: 8px 0;">${submitterName || '未提供'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">提交时间:</td>
                        <td style="padding: 8px 0;">${new Date(currentTime).toLocaleString('zh-CN')}</td>
                      </tr>
                    </table>
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${request.headers.get('origin') || 'https://binnav.top'}/admin" 
                       style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                      前往管理后台审核
                    </a>
                  </div>
                </div>
                
                <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
                  此邮件由 BinNav 系统自动发送，请勿回复。
                </div>
              </div>
            `
          };
          
          console.log('管理员邮件载荷:', JSON.stringify(adminEmailPayload, null, 2));
          
          const adminEmailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(adminEmailPayload)
          });
          
          const adminResponseText = await adminEmailResponse.text();
          
          if (adminEmailResponse.ok) {
            console.log('管理员通知邮件发送成功，响应:', adminResponseText);
          } else {
            console.error('管理员通知邮件发送失败，状态:', adminEmailResponse.status);
            console.error('管理员通知邮件发送失败，响应:', adminResponseText);
          }
        } catch (adminEmailError) {
          console.error('❌ 管理员邮件发送异常:', adminEmailError);
          console.error('❌ 异常详情:', {
            name: adminEmailError.name,
            message: adminEmailError.message,
            stack: adminEmailError.stack
          });
        }
      } else {
        console.log('❌ ADMIN_EMAIL未配置，跳过管理员通知邮件');
        console.log('❌ 请在EdgeOne控制台中配置 ADMIN_EMAIL 环境变量');
        console.log('❌ 当前环境变量列表:', Object.keys(env));
      }
      
      // 2. 发送给提交者的确认邮件
      console.log('✅ 开始发送提交者确认邮件');
      console.log('📧 收件人:', contactEmail);
      try {
        const submitterEmailPayload = {
          from: 'onboarding@resend.dev',
          to: [contactEmail],
          subject: `[BinNav] 站点提交确认 - ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0; font-size: 24px;">✅ 站点提交成功</h1>
              </div>
              
              <div style="padding: 30px; background-color: #f9fafb; border-radius: 0 0 8px 8px;">
                <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
                  ${submitterName ? `尊敬的 ${submitterName}，` : ''}感谢您向 BinNav 提交网站！您的提交已成功接收。
                </p>
                
                <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                  <h3 style="margin-top: 0; color: #10b981;">提交信息</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; font-weight: bold; color: #6b7280; width: 100px;">网站名称:</td>
                      <td style="padding: 8px 0;">${name}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">网站链接:</td>
                      <td style="padding: 8px 0;"><a href="${processedUrl}" target="_blank" style="color: #2563eb;">${processedUrl}</a></td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">分类:</td>
                      <td style="padding: 8px 0;">${category}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">提交时间:</td>
                      <td style="padding: 8px 0;">${new Date(currentTime).toLocaleString('zh-CN')}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">提交ID:</td>
                      <td style="padding: 8px 0;">#${submissionId}</td>
                    </tr>
                  </table>
                </div>
                
                <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;">
                  <h4 style="margin-top: 0; color: #065f46;">📋 审核流程</h4>
                  <ul style="margin: 10px 0; padding-left: 20px; color: #065f46;">
                    <li>我们将在 1-3 个工作日内审核您的提交</li>
                    <li>审核通过后，您的网站将出现在 BinNav 导航中</li>
                    <li>审核结果将通过邮件通知您</li>
                  </ul>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${request.headers.get('origin') || 'https://binnav.top'}" 
                     style="display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                    访问 BinNav
                  </a>
                </div>
              </div>
              
              <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
                此邮件由 BinNav 系统自动发送，请勿回复。
              </div>
            </div>
          `
        };
        
        console.log('提交者邮件载荷:', JSON.stringify(submitterEmailPayload, null, 2));
        
        const submitterEmailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitterEmailPayload)
        });
        
        const submitterResponseText = await submitterEmailResponse.text();
        
        if (submitterEmailResponse.ok) {
          console.log('提交者确认邮件发送成功，响应:', submitterResponseText);
        } else {
          console.error('提交者确认邮件发送失败，状态:', submitterEmailResponse.status);
          console.error('提交者确认邮件发送失败，响应:', submitterResponseText);
        }
              } catch (submitterEmailError) {
          console.error('❌ 提交者邮件发送异常:', submitterEmailError);
          console.error('❌ 异常详情:', {
            name: submitterEmailError.name,
            message: submitterEmailError.message,
            stack: submitterEmailError.stack
          });
        }
    } else {
      console.log('邮件配置检查:');
      console.log('- RESEND_API_KEY存在:', !!RESEND_API_KEY);
      console.log('- RESEND_API_KEY长度:', RESEND_API_KEY ? RESEND_API_KEY.length : 0);
      console.log('- ADMIN_EMAIL存在:', !!ADMIN_EMAIL);
      console.log('- ADMIN_EMAIL值:', ADMIN_EMAIL || 'undefined');
      console.log('跳过邮件发送');
    }

    return new Response(JSON.stringify({
      success: true,
      message: '站点提交成功！我们将在1-3个工作日内审核您的提交。',
      submissionId: submissionId
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('站点提交失败:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: '提交失败: ' + error.message,
      error: {
        name: error.name,
        message: error.message
      }
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
} 