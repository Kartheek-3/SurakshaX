import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    try {
      const token = localStorage.getItem('token')
      const userDataStr = localStorage.getItem('user')
      if (token && userDataStr) {
        const parsedUser = JSON.parse(userDataStr)
        setUser(parsedUser)
        setIsAdmin(parsedUser.phone === 'admin' || parsedUser.platform === 'Admin')
      }
    } catch (err) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      console.error('Auth load error, cleared storage:', err)
    }
    setLoading(false)
  }, [])


  const login = (userData, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    setIsAdmin(userData.phone === 'admin' || userData.platform === 'Admin')
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsAdmin(false)
  }

  const value = {
    user,
    login,
    logout,
    isAdmin,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

