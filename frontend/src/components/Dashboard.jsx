import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { getClaims, predictIncome } from './ApiClient'

const Dashboard = () => {
  const [claims, setClaims] = useState([])
  const [earningsData, setEarningsData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const claimsResp = await getClaims('demo_user')
        const mappedClaims = claimsResp.map(c => ({
          ...c,
          id: c._id || 'claim' + Math.random().toString(36).substr(2, 9)
        }))
        setClaims(mappedClaims)

        const predResp = await predictIncome([220, 8, 0.7])
        const expected = predResp.expected_daily_income

        const earningsData = [
          { day: 'Mon', expected, actual: expected * 0.8 },
          { day: 'Tue', expected, actual: expected * 0.93 },
          { day: 'Wed', expected, actual: expected * 0.6 }, // Disruption
          { day: 'Thu', expected, actual: expected * 0.92 },
          { day: 'Fri', expected, actual: expected * 0.97 }
        ]
        setEarningsData(earningsData)
      } catch (error) {
        console.error('Dashboard data fetch error:', error)
        // Fallback
        setEarningsData([
          { day: 'Mon', expected: 250, actual: 200 },
          { day: 'Tue', expected: 280, actual: 260 },
          { day: 'Wed', expected: 300, actual: 180 },
          { day: 'Thu', expected: 270, actual: 250 },
          { day: 'Fri', expected: 320, actual: 310 }
        ])
        setClaims([
          { id: 'claim1', disruption: 'Heavy Rain', payout: 120, status: 'paid' },
          { id: 'claim2', disruption: 'AQI Spike', payout: 80, status: 'pending' }
        ])
      }
    }
    fetchData()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Earnings vs Expected</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={earningsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="expected" stroke="#3B82F6" name="Expected" />
              <Line type="monotone" dataKey="actual" stroke="#EF4444" name="Actual" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-green-100 p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6">Recent Claims</h2>
          <div className="space-y-4">
            {claims.map(claim => (
              <div key={claim.id} className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm">
                <div>
                  <p className="font-medium text-gray-900">{claim.disruption}</p>
                  <p className={`text-sm ${claim.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {claim.status.toUpperCase()}
                  </p>
                </div>
                <span className="text-2xl font-bold text-emerald-600">₹{claim.payout}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Risk Score</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
            <div className="text-3xl font-bold text-blue-600">0.72</div>
            <div className="text-sm text-gray-600 mt-1">Current Risk</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl">
            <div className="text-3xl font-bold text-orange-600">12%</div>
            <div className="text-sm text-gray-600 mt-1">Disruption Prob.</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
            <div className="text-3xl font-bold text-green-600">₹1,250</div>
            <div className="text-sm text-gray-600 mt-1">Weekly Coverage</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

