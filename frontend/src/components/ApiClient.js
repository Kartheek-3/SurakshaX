const API_BASE = 'http://localhost:5000'

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}

export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error || 'Registration failed')
  }
  return data
}

export const loginUser = async (phone) => {
  const response = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ phone })
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error || 'Login failed')
  }
  return data
}

export const onboardUser = async (userData) => {
  const response = await fetch(`${API_BASE}/onboard`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(userData)
  })
  return response.json()
}

export const createPolicy = async (policyData) => {
  const response = await fetch(`${API_BASE}/policy`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(policyData)
  })
  return response.json()
}

export const buyPolicy = async (policyData) => {
  const response = await fetch(`${API_BASE}/buy_policy`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(policyData)
  })
  return response.json()
}

export const triggerClaim = async (claimData) => {
  const response = await fetch(`${API_BASE}/trigger_claim`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(claimData)
  })
  return response.json()
}

export const predictIncome = async (features) => {
  const response = await fetch(`${API_BASE}/predict_income`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({features})
  })
  return response.json()
}

export const getRiskData = async () => {
  const response = await fetch(`${API_BASE}/risk_data`)
  return response.json()
}

export const getClaims = async (userId) => {
  const response = await fetch(`${API_BASE}/claims/${userId}`, {
    headers: getAuthHeaders()
  })
  return response.json()
}
