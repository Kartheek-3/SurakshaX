import { useState, useEffect } from 'react'
import { getAuthHeaders } from './ApiClient' // Remove if not used, use local

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({})
  const [users, setUsers] = useState([])
  const [claims, setClaims] = useState([])
  const [weather, setWeather] = useState([])

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes, claimsRes, weatherRes] = await Promise.all([
        fetch('/admin/stats', { headers: getAuthHeaders() }).then(r => r.json()),
        fetch('/admin/users', { headers: getAuthHeaders() }).then(r => r.json()),
        fetch('/admin/claims', { headers: getAuthHeaders() }).then(r => r.json()),
        fetch('/admin/weather', { headers: getAuthHeaders() }).then(r => r.json())
      ])
      setStats(statsRes)
      setUsers(usersRes)
      setClaims(claimsRes)
      setWeather(weatherRes)
    } catch (err) {
      console.error('Admin data fetch error', err)
    }
  }

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return token ? { 'Authorization': `Bearer ${token}` } : {}
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-8 rounded-2xl shadow-2xl">
                <div className="text-4xl font-bold">{stats.total_workers || 0}</div>
                <div className="text-lg opacity-90 mt-2">Total Workers</div>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white p-8 rounded-2xl shadow-2xl">
                <div className="text-4xl font-bold">{stats.active_policies || 0}</div>
                <div className="text-lg opacity-90 mt-2">Active Policies</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-8 rounded-2xl shadow-2xl">
                <div className="text-4xl font-bold">{stats.total_claims || 0}</div>
                <div className="text-lg opacity-90 mt-2">Total Claims</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 rounded-2xl shadow-2xl">
                <div className="text-4xl font-bold">₹{(stats.total_paid || 0).toLocaleString()}</div>
                <div className="text-lg opacity-90 mt-2">Paid Out</div>
              </div>
            </div>
          </div>
        )
      case 'workers':
        return (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-2xl shadow-xl">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Phone</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">City</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Platform</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, i) => (
                    <tr key={i} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4">{user.name}</td>
                      <td className="px-6 py-4">{user.phone}</td>
                      <td className="px-6 py-4">{user.city}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                          {user.platform}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      case 'claims':
        return (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl shadow-xl">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">User</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Disruption</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">Payout</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Date</th>
                </tr>
              </thead>
              <tbody>
                {claims.slice(0, 20).map((claim, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{claim.user_id}</td>
                    <td className="px-6 py-4">{claim.disruption}</td>
                    <td className="px-6 py-4 text-right font-bold text-green-600">₹{claim.payout}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        claim.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(claim.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      case 'weather':
        return (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl shadow-xl">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">City</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">Rainfall (mm)</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">Temp (°C)</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Time</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Trigger</th>
                </tr>
              </thead>
              <tbody>
                {weather.map((event, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold">{event.city}</td>
                    <td className={`px-6 py-4 text-right font-bold ${event.rainfall > 30 ? 'text-red-600' : 'text-gray-700'}`}>
                      {event.rainfall}
                    </td>
                    <td className="px-6 py-4 text-right">{event.temperature}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(event.event_time).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        event.rainfall > 30 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {event.rainfall > 30 ? 'AUTO CLAIM' : 'Safe'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Admin Command Center</h1>
      
      <div className="flex bg-white p-1 rounded-2xl shadow-lg mb-8 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap ${activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-700 hover:bg-indigo-100'}`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('workers')}
          className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap ${activeTab === 'workers' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-700 hover:bg-indigo-100'}`}
        >
          Workers
        </button>
        <button 
          onClick={() => setActiveTab('claims')}
          className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap ${activeTab === 'claims' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-700 hover:bg-indigo-100'}`}
        >
          Claims
        </button>
        <button 
          onClick={() => setActiveTab('weather')}
          className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap ${activeTab === 'weather' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-700 hover:bg-indigo-100'}`}
        >
          Weather
        </button>
      </div>

      {renderTabContent()}
      
      <button onClick={fetchAdminData} className="mt-8 bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700">
        Refresh Data
      </button>
    </div>
  )
}

export default AdminPanel

