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
  const [showPassword, setShowPassword] = useState(false)
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

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };

    // Validate specific field on blur
    if (name === 'username' && !value.trim()) {
      newErrors.username = 'Username is required';
    } else if (name === 'username' && value.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (name === 'password' && !value) {
      newErrors.password = 'Password is required';
    } else if (name === 'password' && value.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
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
        nav('/')
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-8 px-4 relative page-container" style={{maxWidth: 'calc(100vw - 11rem)'}}>
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 text-4xl opacity-20 animate-bounce hidden lg:block" aria-hidden="true">🎨</div>
      <div className="absolute top-20 right-20 text-3xl opacity-20 animate-pulse hidden lg:block" aria-hidden="true">👕</div>
      <div className="absolute bottom-20 left-20 text-3xl opacity-20 animate-bounce delay-1000 hidden lg:block" aria-hidden="true">☕</div>
      <div className="absolute bottom-10 right-10 text-2xl opacity-20 animate-spin hidden lg:block" style={{animationDuration: '10s'}} aria-hidden="true">🧢</div>

      <main className="max-w-sm w-full space-y-6 bg-white rounded-2xl shadow-2xl p-6 border border-gray-100" role="main" style={{maxWidth: '400px'}}>
        <header className="text-center">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Sign In</h1>
          </div>
          <p className="text-gray-800 font-semibold mt-2 drop-shadow-sm">Welcome back to Whitney's Creations</p>
        </header>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm" role="alert" aria-live="polite">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label htmlFor="username" className="block text-base font-bold text-gray-900 mb-2 drop-shadow-sm">
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
              onBlur={handleBlur}
              autoComplete="username"
              required
              aria-describedby={errors.username ? 'username-error' : undefined}
              aria-invalid={errors.username ? 'true' : 'false'}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600" role="alert" aria-live="polite" id="username-error">
                {errors.username}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-base font-bold text-gray-900 mb-2 drop-shadow-sm">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-gray-900 ${
                  errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                }`}
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="current-password"
                required
                aria-describedby={errors.password ? 'password-error' : undefined}
                aria-invalid={errors.password ? 'true' : 'false'}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 transition-colors duration-200 bg-white rounded-r-lg"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  {showPassword ? (
                    // Regular eye (password visible)
                    <>
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </>
                  ) : (
                    // Eye-slash (password hidden)
                    <>
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      <path stroke="currentColor" strokeWidth="2" d="M4 4l12 12" strokeLinecap="round" />
                    </>
                  )}
                </svg>
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600" role="alert" aria-live="polite" id="password-error">
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full btn-gradient-primary disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-gray-800 text-base mb-4 font-bold drop-shadow-sm">
            Not a member yet?
          </p>
          <button
            onClick={() => handleReg()}
            className="w-full btn-gradient-purple"
            aria-label="Create a new account"
          >
            Create Account
          </button>
        </div>
      </main>
    </div>
  )
}

export default Login