import { useState, useEffect } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { getRiskData } from './ApiClient'

const RiskMap = () => {
  const [riskData, setRiskData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRiskData()
        setRiskData(response.zones)
      } catch (error) {
        console.error('Error fetching risk data:', error)
        // Fallback mock data
        setRiskData([
          { zone: 'Andheri', risk: 85, aqi: 180, rainProb: 70 },
          { zone: 'Bandra', risk: 45, aqi: 120, rainProb: 30 },
          { zone: 'Dadar', risk: 92, aqi: 250, rainProb: 90 },
          { zone: 'Worli', risk: 28, aqi: 95, rainProb: 15 },
          { zone: 'Navi Mumbai', risk: 65, aqi: 155, rainProb: 55 }
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-8"><div className="text-center">Loading risk map...</div></div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white p-8 rounded-2xl shadow-xl mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">🗺️ Hyperlocal Risk Heatmap</h1>
        <p className="text-gray-600 mb-8">Live data - Plan optimal routes and avoid high-risk zones</p>
        
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={riskData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="zone" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="risk" fill="#EF4444" name="Risk Score" />
            <Bar dataKey="aqi" fill="#F59E0B" name="AQI" />
            <Bar dataKey="rainProb" fill="#3B82F6" name="Rain %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {riskData.length > 0 && (
          <>
            <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-8 rounded-2xl shadow-2xl text-center">
              <div className="text-4xl font-bold mb-2">{Math.max(...riskData.map(d => d.risk))}</div>
              <div className="text-lg opacity-90">{riskData.find(d => d.risk === Math.max(...riskData.map(d => d.risk)))?.zone} - AVOID</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-8 rounded-2xl shadow-2xl text-center">
              <div className="text-4xl font-bold mb-2">65-85</div>
              <div className="text-lg opacity-90">Caution Zones</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-8 rounded-2xl shadow-2xl text-center">
              <div className="text-4xl font-bold mb-2">{'< 45'}</div>
              <div className="text-lg opacity-90">Safe Routes</div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default RiskMap


