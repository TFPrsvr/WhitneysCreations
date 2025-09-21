import React, {useState} from 'react'
import './Login.css'
import axios from 'axios'
import {Link, useNavigate} from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Reg from '../Registration/Reg'
import { Button } from '@/lib/ui/button'

const Login = () => {
  const { login } = useAuth()
  const [formData, setformData] = useState({
    username: '',
    password: ''
  })
  const [loginData, setLoginData] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const nav = useNavigate()

  const handleChange = (e) => {
    setformData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear errors when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

 const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    const usernameTrimmed = formData.username.trim();
    const passwordTrimmed = formData.password.trim();

    try {
      const result = await login({
        username: usernameTrimmed,
        password: passwordTrimmed
      })

      if (result.success) {
        console.log("Login successful:", result)
        nav('/create')
      } else {
        console.error("Login failed:", result.error)
        setErrors({ general: result.error || 'Login failed. Please check your credentials.' })
      }
    } catch (error) {
      console.error("Login error:", error)
      setErrors({ general: 'Login failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }


  const handleReg = () => {
    nav('/reg')
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-8 px-4 relative" style={{ marginLeft: '16rem', maxWidth: 'calc(100vw - 16rem)', width: 'calc(100vw - 16rem)' }}>
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 text-4xl opacity-20 animate-bounce hidden lg:block">🎨</div>
      <div className="absolute top-20 right-20 text-3xl opacity-20 animate-pulse hidden lg:block">👕</div>
      <div className="absolute bottom-20 left-20 text-3xl opacity-20 animate-bounce delay-1000 hidden lg:block">☕</div>
      <div className="absolute bottom-10 right-10 text-2xl opacity-20 animate-spin hidden lg:block" style={{animationDuration: '10s'}}>🧢</div>

      <div className="max-w-md w-full space-y-6 bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        <div className="text-center">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Sign In</h1>
            <span className="text-4xl">🎨</span>
          </div>
          <p className="text-gray-600 mt-2">Welcome back to Whitney's Creations</p>
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              id="username"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-gray-900 ${
                errors.username ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
              }`}
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              autocomplete="username"
              required
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-gray-900 ${
                errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
              }`}
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autocomplete="current-password"
              required
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <button 
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={isLoading}
            style={{borderRadius: '12px'}}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-gray-700 text-sm mb-4 font-medium">
            Not a member yet?
          </p>
          <button
            onClick={() => handleReg()}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            style={{borderRadius: '12px'}}
          >
            <div className="text-center">
              Create Account
              <div className="text-2xl">👕</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login