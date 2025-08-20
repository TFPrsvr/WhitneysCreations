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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-4 lg:px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="header-main">Sign In</h1>
          <p className="text-gray-600 mt-2">Welcome back to PrintCraft</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              className="input-primary"
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <input
              className="input-primary"
              type="password"
              name="password"
              placeholder="Password"
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
          <Button 
            onClick={() => handleReg()}
            variant="outline"
            className="mt-2"
          >
            Create Account
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Login