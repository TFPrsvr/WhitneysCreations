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
  const nav = useNavigate()

  const handleChange = (e) => {
    setformData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

 const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    console.log('Form data:', formData)

    const usernameTrimmed = formData.username.trim();
    const passwordTrimmed = formData.password.trim();
  
    console.log('Form data:', { username: usernameTrimmed, password: passwordTrimmed });
  
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
        alert(result.error || 'Login failed')
      }
    } catch (error) {
      console.error("Login error:", error)
      alert('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }


  const handleReg = () => {
    nav('/reg')
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-4 lg:px-4 relative">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 text-4xl opacity-20 animate-bounce hidden lg:block">🎨</div>
      <div className="absolute top-20 right-20 text-3xl opacity-20 animate-pulse hidden lg:block">👕</div>
      <div className="absolute bottom-20 left-20 text-3xl opacity-20 animate-bounce delay-1000 hidden lg:block">☕</div>
      <div className="absolute bottom-10 right-10 text-2xl opacity-20 animate-spin hidden lg:block" style={{animationDuration: '10s'}}>🧢</div>
      
      <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="text-4xl">🎨</span>
            <h1 className="header-main ml-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Sign In</h1>
          </div>
          <p className="text-gray-600 mt-2">Welcome back to PrintCraft</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white text-gray-900"
              style={{color: '#1f2937'}}
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white text-gray-900"
              style={{color: '#1f2937'}}
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <Button 
            type="submit"
            className="w-full"
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
        
        <div className="text-center">
          <p className="text-gray-600">
            Don't have an account?
          </p>
          <button 
            onClick={() => handleReg()}
            className="w-full mt-3 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
            style={{borderRadius: '10%'}}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login