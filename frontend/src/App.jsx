import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Home from './components/Home'
import Dashboard from './components/Dashboard'
import Policy from './components/Policy'
import RiskMap from './components/RiskMap'
import Login from './components/Login'
import Signup from './components/Signup'
import BuyPolicy from './components/BuyPolicy'
import AdminPanel from './components/AdminPanel'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebar from './components/Sidebar'

function App() {
  const location = useLocation()
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      {/* Sidebar - Account Details (logged in only) */}
      {user && (
        <Sidebar />
      )}
      
      {/* Main Content */}
      <div className={user ? 'flex-1 ml-0 lg:ml-64 transition-all' : 'w-full'}>
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-indigo-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-all">
                🛡️ SurakshaX
              </Link>
              <nav className="flex space-x-1 bg-indigo-50/50 px-4 py-2 rounded-2xl backdrop-blur-md">
                <Link to="/dashboard" className={`px-4 py-2 rounded-xl font-semibold transition-all ${location.pathname === '/dashboard' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-700 hover:bg-indigo-100'}`}>
                  📊 Dashboard
                </Link>
                <Link to="/buy-policy" className={`px-4 py-2 rounded-xl font-semibold transition-all ${location.pathname === '/buy-policy' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-700 hover:bg-indigo-100'}`}>
                  🛡️ Buy Policy
                </Link>
                <Link to="/policy" className={`px-4 py-2 rounded-xl font-semibold transition-all ${location.pathname === '/policy' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-700 hover:bg-indigo-100'}`}>
                  📋 Policies
                </Link>
                <Link to="/riskmap" className={`px-4 py-2 rounded-xl font-semibold transition-all ${location.pathname === '/riskmap' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-700 hover:bg-indigo-100'}`}>
                  🗺️ Risk Map
                </Link>
                <Link to="/admin" className={`px-4 py-2 rounded-xl font-semibold transition-all ${location.pathname === '/admin' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-700 hover:bg-indigo-100'}`}>
                  👨‍💼 Admin
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Routes */}
        <main className="pt-4 pb-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/buy-policy" element={
              <ProtectedRoute>
                <BuyPolicy />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute adminOnly>
                <AdminPanel />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/policy" element={
              <ProtectedRoute>
                <Policy />
              </ProtectedRoute>
            } />
            <Route path="/riskmap" element={
              <ProtectedRoute>
                <RiskMap />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App

