import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const Sidebar = () => {
      const { user } = useAuth()

  if (!user) return null

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 h-screen p-6 sticky top-0 left-0 overflow-auto">
      <div className="mb-8">
        <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          {user.name}
        </div>
        <div className="text-sm text-gray-500 mb-1">{user.phone}</div>
        <div className="text-sm text-gray-500 mb-4">{user.city} • {user.platform}</div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div className="bg-emerald-500 h-2 rounded-full w-3/4"></div>
        </div>
        <div className="text-xs text-gray-500">
          Coverage: <span className="font-bold text-emerald-600">Active</span> | Premium: ₹299/wk
        </div>
      </div>

      <nav className="space-y-2">
        <Link to="/dashboard" className="flex items-center p-3 rounded-xl hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 font-medium">
          <span className="w-5 mr-3">📊</span> Dashboard
        </Link>
        <Link to="/buy-policy" className="flex items-center p-3 rounded-xl hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 font-medium">
          <span className="w-5 mr-3">🛡️</span> Buy Policy
        </Link>
        <Link to="/policy" className="flex items-center p-3 rounded-xl hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 font-medium">
          <span className="w-5 mr-3">📋</span> My Policies
        </Link>
        <Link to="/riskmap" className="flex items-center p-3 rounded-xl hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 font-medium">
          <span className="w-5 mr-3">🗺️</span> Risk Map
        </Link>
        <Link to="/trigger-claim" className="flex items-center p-3 rounded-xl hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 font-medium">
          <span className="w-5 mr-3">🚨</span> File Claim
        </Link>
      </nav>

      <div className="absolute bottom-6 w-full">
        <button 
          onClick={() => {
            localStorage.clear()
            window.location.reload()
          }}
          className="w-full flex items-center p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all"
        >
          <span className="w-5 mr-3">🚪</span> Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar

