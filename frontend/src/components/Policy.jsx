import { triggerClaim } from './ApiClient'

const Policy = () => {
  const policies = [
    {
      id: 'pol001',
      coverage: '₹15,000',
      premium: '₹299',
      status: 'active',
      expiry: '2024-12-31'
    }
  ]

  const handleClaim = async () => {
    try {
      const claimData = {
        user_id: 'demo_user',
        disruption_type: 'Heavy Rain',
        actual_income: 100,
        avg_earnings: 220,
        avg_hours: 8,
        risk_score: 0.7
      }
      const result = await triggerClaim(claimData)
      alert(`Claim triggered! Payout: ₹${Math.round(result.payout)} (Expected: ₹${Math.round(result.expected_income || 0)} ) via Digital Twin`)
    } catch (error) {
      alert('Error: Ensure backend is running on port 5000 (python backend/app.py)')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Policies</h1>
      <div className="space-y-6">
        {policies.map(policy => (
          <div key={policy.id} className="bg-white p-8 rounded-2xl shadow-xl border-2 border-indigo-100">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-indigo-600">Digital Twin Policy</h2>
                <p className="text-4xl font-bold text-gray-900 mt-2">₹{policy.coverage} Coverage</p>
              </div>
              <div className="text-right">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  policy.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {policy.status.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weekly Premium</label>
                <div className="text-2xl font-bold text-emerald-600">₹{policy.premium}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Valid Until</label>
                <div className="text-lg font-semibold text-gray-900">{policy.expiry}</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleClaim}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-8 rounded-xl font-semibold text-lg shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
              >
                🚨 Trigger Parametric Claim
              </button>
              <button className="flex-1 bg-gray-100 text-gray-900 py-4 px-8 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                Renew Policy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Policy

