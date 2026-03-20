import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { buyPolicy, predictIncome } from './ApiClient.js'

const BuyPolicy = () => {
  const { user, logout } = useAuth()
  const [formData, setFormData] = useState({
    exposure_hours: 40,
    risk_score: 0.5
  })
  const [loading, setLoading] = useState(false)
  const [premium, setPremium] = useState(0)
  const [predictedIncome, setPredictedIncome] = useState(0)

  useEffect(() => {
    const calcPremium = 299 + (formData.risk_score * formData.exposure_hours * 5)
    setPremium(Math.round(calcPremium))
  }, [formData])

  const handleBuy = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await buyPolicy({
        type: 'weekly',
        weekly_premium: premium,
        coverage_amount: predictedIncome * 7,  // 1 week coverage
        exposure_hours: formData.exposure_hours,
        risk_score: formData.risk_score
      })
      alert(`Policy bought! ID: ${response.policy_id}. Premium: ₹${premium}/week`)
    } catch (err) {
      alert('Purchase failed: ' + err.message)
    }
    setLoading(false)
  }

  const handlePredict = async () => {
    try {
      const response = await predictIncome([200, formData.exposure_hours, formData.risk_score])
      setPredictedIncome(Math.round(response.predicted_daily))
    } catch (err) {
      setPredictedIncome(1200) // demo
    }
  }

  if (!user) return <div className="p-8 text-center">Please login to buy policy</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white p-8 rounded-2xl shadow-xl mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">🛡️ Buy Weekly Policy</h1>
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold text-emerald-600 mb-4">Your Profile</h3>
            <p><strong>Worker:</strong> {user.name}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>City:</strong> {user.city}</p>
            <p><strong>Platform:</strong> {user.platform}</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-indigo-600 mb-4">Predicted Income</h3>
            <div className="text-3xl font-bold text-gray-900">₹{predictedIncome}/day</div>
            <button onClick={handlePredict} className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700">
              Recalculate AI Prediction
            </button>
          </div>
        </div>

        <form onSubmit={handleBuy} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Weekly Exposure Hours</label>
            <input
              type="number"
              min="0" max="84"
              value={formData.exposure_hours}
              onChange={(e) => setFormData({...formData, exposure_hours: parseFloat(e.target.value)})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl"
              placeholder="40"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Risk Score (0-1)</label>
            <input
              type="number"
              min="0" max="1" step="0.01"
              value={formData.risk_score}
              onChange={(e) => setFormData({...formData, risk_score: parseFloat(e.target.value)})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl"
              placeholder="0.5"
            />
          </div>
          <div className="p-6 bg-emerald-50 border-2 border-emerald-200 rounded-2xl text-center">
            <h3 className="text-2xl font-bold text-emerald-800 mb-2">₹{premium}/week</h3>
            <p className="text-emerald-700">Coverage up to ₹{Math.round(predictedIncome * 7 * 1.5)}</p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-4 px-8 rounded-2xl font-bold text-xl shadow-2xl hover:from-emerald-700 hover:to-green-700 transition-all disabled:opacity-50"
          >
            {loading ? 'Buying...' : 'Buy Now - Instant Activation'}
          </button>
        </form>
      </div>

      <div className="text-sm text-gray-500 text-center">
        <button onClick={logout} className="text-indigo-600 hover:text-indigo-500 font-medium">
          Logout
        </button>
      </div>
    </div>
  )
}

export default BuyPolicy

