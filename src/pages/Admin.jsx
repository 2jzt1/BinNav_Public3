import { useState, useEffect } from 'react'
import { Lock, Image } from 'lucide-react'
import { useAdminConfig } from '../hooks/useAdminConfig'

import MessageBar from '../components/admin/MessageBar'
import UserHeader from '../components/admin/UserHeader'
import TabNavigation from '../components/admin/TabNavigation'
import WebsiteManager from '../components/admin/WebsiteManager'
import CategoryManager from '../components/admin/CategoryManager'
import LogoUploader from '../components/admin/LogoUploader'
import PendingWebsiteManager from '../components/admin/PendingWebsiteManager'
import FriendLinksManager from '../components/admin/FriendLinksManager'

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState('websites')
  const [loginMessage, setLoginMessage] = useState({ type: '', content: '' })

  // 系统设置相关状态
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'BinNav',
    siteLogo: '/logo.png',
    siteDescription: '精选网站导航'
  })

  // 图标管理器状态
  const [showLogoManager, setShowLogoManager] = useState(false)

  // 使用自定义hook管理配置
  const {
    config,
    isUpdating,
    message,
    showMessage,
    saveConfig,
    updateWebsiteData,
    updateCategories
  } = useAdminConfig()



  // 检查认证状态
  useEffect(() => {
    const savedAuth = localStorage.getItem('admin_authenticated')
    if (savedAuth === 'true') {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoginLoading(true)
    
    // 显示加载状态
    setLoginMessage({ type: 'info', content: '正在验证密码...' })
    
    try {
      // 首先尝试调用EdgeOne Functions验证密码
      const response = await fetch('/api/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: password
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setIsAuthenticated(true)
        localStorage.setItem('admin_authenticated', 'true')
        setLoginMessage({ type: 'success', content: '登录成功！' })
      } else {
        // 如果服务器验证失败，尝试本地验证（备用方案）
        if (tryLocalPasswordVerification(password)) {
          setIsAuthenticated(true)
          localStorage.setItem('admin_authenticated', 'true')
          setLoginMessage({ type: 'success', content: '登录成功！（本地验证）' })
        } else {
          setLoginMessage({ type: 'error', content: result.message || '密码错误！' })
        }
      }
    } catch (error) {
      console.error('服务器验证失败，尝试本地验证:', error)
      
      // 网络错误时尝试本地验证
      if (tryLocalPasswordVerification(password)) {
        setIsAuthenticated(true)
        localStorage.setItem('admin_authenticated', 'true')
        setLoginMessage({ type: 'success', content: '登录成功！（离线验证）' })
      } else {
        setLoginMessage({ type: 'error', content: '登录验证失败，请检查密码或网络连接' })
      }
    } finally {
      setIsLoginLoading(false)
    }
  }

  // 本地密码验证备用方案
  const tryLocalPasswordVerification = (inputPassword) => {
    // 这里可以设置本地备用密码，建议使用环境变量
    const localPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'
    
    // 简单的密码验证
    return inputPassword === localPassword
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated')
    setIsAuthenticated(false)
    setPassword('')
    showMessage('success', '已成功退出登录')
  }

  // 获取分类名称
  const getCategoryName = (categoryId) => {
    // 先在一级分类中查找
    const topLevelCategory = config.categories.find(cat => cat.id === categoryId)
    if (topLevelCategory) {
      return topLevelCategory.name
    }
    
    // 再在二级分类中查找
    for (const category of config.categories) {
      if (category.subcategories) {
        const subcategory = category.subcategories.find(sub => sub.id === categoryId)
        if (subcategory) {
          return `${category.name} > ${subcategory.name}`
        }
      }
    }
    
    return '未分类'
  }

  // 保存系统设置
  const handleSaveSettings = () => {
    // 在实际实现中，这里会生成包含系统设置的配置文件
    showMessage('success', '系统设置已更新')
  }

  // 登录页面UI
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">检查登录状态中...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">管理后台</h1>
            <p className="text-gray-600">请输入管理密码以继续</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                管理密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="请输入管理密码"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoginLoading}
              className={`w-full font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                isLoginLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
              } text-white`}
            >
              {isLoginLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  验证中...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  登录管理后台
                </>
              )}
            </button>
          </form>
          
          {loginMessage.content && (
            <div className={`mt-4 p-3 rounded-lg text-sm ${
              loginMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
              loginMessage.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
              'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              {loginMessage.content}
            </div>
          )}
          
          <p className="text-sm text-gray-500 text-center mt-4">
            登录后您可以管理网站内容并通过EdgeOne Functions自动部署更新
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <UserHeader 
          isUpdating={isUpdating}
          onSave={saveConfig}
          onLogout={handleLogout}
        />

      {/* 消息提示 */}
        <MessageBar message={message} />

        {/* 标签页导航 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <TabNavigation 
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* 标签页内容 */}
          <div className="p-6">
        {activeTab === 'websites' && (
              <WebsiteManager
                config={config}
                onUpdateWebsiteData={updateWebsiteData}
                showMessage={showMessage}
                getCategoryName={getCategoryName}
              />
        )}

        {activeTab === 'pending' && (
              <PendingWebsiteManager
                showMessage={showMessage}
              />
        )}

        {activeTab === 'categories' && (
              <CategoryManager
                config={config}
                onUpdateCategories={updateCategories}
                showMessage={showMessage}
              />
        )}

        {activeTab === 'friends' && (
              <FriendLinksManager
                showMessage={showMessage}
              />
        )}

        {activeTab === 'settings' && (
                <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">系统设置</h3>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-base font-medium text-gray-900 mb-4">站点基本信息</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">站点名称</label>
                  <input
                    type="text"
                    value={siteSettings.siteName}
                    onChange={(e) => setSiteSettings({...siteSettings, siteName: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="BinNav"
                  />
                </div>
                
                <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">站点Logo</label>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50">
                          <img 
                            src={siteSettings.siteLogo} 
                            alt="站点Logo"
                            className="w-10 h-10 rounded border border-gray-200 bg-white p-1"
                            onError={(e) => { e.target.src = '/assets/logo.png' }}
                          />
                          <span className="text-sm text-gray-600 flex-1 truncate">
                            {siteSettings.siteLogo.split('/').pop() || '未选择Logo'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowLogoManager(true)}
                          className="flex items-center space-x-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm transition-colors"
                        >
                          <Image size={16} />
                          <span>更换</span>
                        </button>
                      </div>
                </div>
                
                <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">站点描述</label>
                  <textarea
                    value={siteSettings.siteDescription}
                    onChange={(e) => setSiteSettings({...siteSettings, siteDescription: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows="3"
                    placeholder="精选网站导航"
                  />
                </div>
              </div>
              
                  <div className="mt-6">
                    <p className="text-sm text-gray-500">
                      💡 提示：修改后点击右上角的"保存设置"按钮统一保存所有配置
                    </p>
                  </div>
                </div>
                
                {/* 版本信息 */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
                  <h4 className="text-base font-medium text-gray-900 mb-4">版本信息</h4>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">v1.0.0</span>
                      <span className="mx-2 text-gray-400">|</span>
                      <a 
                        href="https://github.com/navigator-dev/binnav" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        BinNav 导航网站
                      </a>
                      <span className="mx-2 text-gray-400">|</span>
                      <span>BinNav Team</span>
                    </p>
              </div>
            </div>
          </div>
        )}
        </div>
        </div>
      </div>

      {/* Logo上传器 */}
      {showLogoManager && (
        <LogoUploader
          currentLogo={siteSettings.siteLogo}
          onLogoUpdate={(logoPath) => {
            setSiteSettings({...siteSettings, siteLogo: logoPath})
          }}
          onClose={() => setShowLogoManager(false)}
          showMessage={showMessage}
        />
      )}
    </div>
  )
}

export default Admin
