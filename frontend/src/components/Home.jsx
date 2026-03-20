import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const { user, logout, isAdmin } = useAuth()

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center">
      <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
        Welcome to GigShield AI
      </h1>
      <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        Weather insurance for gig workers. Auto payouts when rain >30mm in your city.
      </p>
      
      {!user ? (
        <div className="space-y-4">
          <Link to="/login" className="block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-12 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all mx-auto w-fit">
            Login with Phone
          </Link>
          <Link to="/signup" className="block bg-white border-2 border-indigo-200 text-indigo-600 px-12 py-4 rounded-xl font-semibold text-lg hover:bg-indigo-50 transition-all mx-auto w-fit">
            Sign Up Free
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md mx-auto">
            <p className="text-lg text-gray-700">Welcome <strong>{user.name}</strong></p>
            <p className="text-sm text-gray-500">{user.phone} • {user.city} • {user.platform}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <Link to="/buy-policy" className="bg-gradient-to-r from-emerald-600 to-green-600 text-white py-4 px-8 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all">
              Buy Policy
            </Link>
            <Link to="/dashboard" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-8 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all">
              Dashboard
            </Link>
            {isAdmin && (
              <Link to="/admin" className="md:col-span-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white py-4 px-8 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all">
                Admin Panel
              </Link>
            )}
            <button onClick={logout} className="bg-red-600 text-white py-4 px-8 rounded-xl font-bold shadow-xl hover:shadow-2xl hover:bg-red-700 transition-all md:col-span-2">
              Logout
            </button>
          </div>
        </div>
      )}
      
      <div className="grid md:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-4xl mb-4">🌧️</div>
          <h3 className="text-xl font-bold mb-3">Auto Weather Claims</h3>
          <p>Rain >30mm triggers 20% coverage payout automatically.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-4xl mb-4">📱</div>
          <h3 className="text-xl font-bold mb-3">Phone Login</h3>
          <p>No passwords. OTP free - just your phone number.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-xl font-bold mb-3">Instant Coverage</h3>
          <p>Buy and activate policy in seconds.</p>
        </div>
      </div>
    </div>
  )
}

export default Home

