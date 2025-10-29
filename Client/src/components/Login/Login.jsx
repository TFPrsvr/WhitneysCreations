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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 relative page-container">
      {/* Background decorative elements */}
      <div className="absolute text-2xl opacity-40 hidden lg:block" style={{top: '1rem', left: '1rem', filter: 'drop-shadow(4px 4px 8px rgba(59,130,246,1)) drop-shadow(0 0 15px rgba(96,165,250,0.9)) drop-shadow(0 0 20px rgba(59,130,246,0.6)) drop-shadow(0 0 2px rgba(0,0,0,0.7))', animation: 'float 3s ease-in-out infinite'}} aria-hidden="true">🎨</div>
      <div className="absolute text-2xl opacity-40 hidden lg:block" style={{top: '1rem', right: '1rem', filter: 'drop-shadow(4px 4px 8px rgba(147,51,234,1)) drop-shadow(0 0 20px rgba(168,85,247,0.9)) drop-shadow(0 0 30px rgba(147,51,234,0.6)) drop-shadow(0 0 2px rgba(0,0,0,0.7))', animation: 'float 3s ease-in-out infinite'}} aria-hidden="true">👕</div>
      <div className="absolute text-2xl opacity-40 hidden lg:block" style={{bottom: '1rem', left: '1rem', filter: 'drop-shadow(4px 4px 8px rgba(251,146,60,1)) drop-shadow(0 0 20px rgba(253,186,116,0.9)) drop-shadow(0 0 30px rgba(251,146,60,0.6)) drop-shadow(0 0 2px rgba(0,0,0,0.7))', animation: 'float 3s ease-in-out infinite'}} aria-hidden="true">☕</div>
      <div className="absolute text-2xl opacity-40 hidden lg:block" style={{bottom: '1rem', right: '1rem', filter: 'drop-shadow(4px 4px 8px rgba(236,72,153,1)) drop-shadow(0 0 20px rgba(244,114,182,0.9)) drop-shadow(0 0 30px rgba(236,72,153,0.6)) drop-shadow(0 0 2px rgba(0,0,0,0.7))', animation: 'float 3s ease-in-out infinite'}} aria-hidden="true">🧢</div>

      <main className="w-full space-y-3 bg-white rounded-2xl shadow-2xl border border-gray-100" role="main" style={{maxWidth: '280px', paddingTop: '2.5rem', paddingBottom: '2.5rem', paddingLeft: '0.75rem', paddingRight: '0.75rem'}}>
        <header className="text-center" style={{marginTop: '-40px', marginBottom: '-24px'}}>
          <h1 className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" style={{margin: '0', padding: '0', lineHeight: '1', fontSize: '34px'}}>Sign In</h1>
          <div className="text-center" style={{margin: '8px 0', padding: '0'}}>
            <span className="text-2xl" aria-hidden="true" style={{margin: '0', padding: '0', display: 'inline-block', lineHeight: '1'}}>👕</span>
          </div>
          <p className="font-semibold drop-shadow-sm text-[8px]" style={{margin: '0', padding: '0', marginBottom: '40px'}}>
            <span style={{color: '#6b7280'}}>Welcome back to Whitney's Creations</span>
          </p>
        </header>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-2.5 py-1.5 rounded-lg text-[10px] mx-auto" role="alert" aria-live="polite" style={{maxWidth: '85%'}}>
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mx-auto" noValidate style={{maxWidth: '70%'}}>
          <div style={{marginBottom: '24px'}}>
            <label htmlFor="username" className="block text-[13px] font-semibold mb-0.5 drop-shadow-sm" style={{color: '#6b7280'}}>
              Username
            </label>
            <input
              id="username"
              className={`w-full px-2 py-1 border-2 rounded focus:ring-1 transition-all bg-white text-gray-900 text-[10px] ${
                errors.username ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              style={{color: '#1f2937'}}
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="username"
              required
              aria-describedby={errors.username ? 'username-error' : undefined}
              aria-invalid={errors.username ? 'true' : 'false'}
            />
            {errors.username && (
              <p className="mt-0.5 text-[9px] text-red-600" role="alert" aria-live="polite" id="username-error">
                {errors.username}
              </p>
            )}
          </div>

          <div style={{marginBottom: '36px'}}>
            <label htmlFor="password" className="block text-[13px] font-semibold mb-0.5 drop-shadow-sm" style={{color: '#6b7280'}}>
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                className={`w-full px-2 py-1 pr-7 border-2 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-gray-900 text-[10px] ${
                  errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                }`}
                style={{color: '#1f2937', height: '28px'}}
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="current-password"
                required
                aria-describedby={errors.password ? 'password-error' : undefined}
                aria-invalid={errors.password ? 'true' : 'false'}
              />
              <div
                role="button"
                tabIndex={0}
                style={{
                  position: 'absolute',
                  top: '2px',
                  right: '4px',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  backgroundColor: 'transparent',
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  padding: '0',
                  margin: '0',
                  cursor: 'pointer'
                }}
                onClick={() => setShowPassword(!showPassword)}
                onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowPassword(!showPassword); }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <svg
                  width="16"
                  height="12"
                  viewBox="0 0 24 18"
                  aria-hidden="true"
                  style={{fill: 'none', display: 'block'}}
                >
                  {showPassword ? (
                    <>
                      <path d="M12 11a2 2 0 100-4 2 2 0 000 4z" stroke="#9ca3af" strokeWidth="1" fill="#9ca3af" />
                      <path d="M1 9s3-6 11-6 11 6 11 6-3 6-11 6S1 9 1 9z" stroke="#9ca3af" strokeWidth="1" fill="none" />
                    </>
                  ) : (
                    <>
                      <path d="M12 11a2 2 0 100-4 2 2 0 000 4z" stroke="#9ca3af" strokeWidth="1" fill="#9ca3af" />
                      <path d="M1 9s3-6 11-6 11 6 11 6-3 6-11 6S1 9 1 9z" stroke="#9ca3af" strokeWidth="1" fill="none" />
                      <line x1="3" y1="1" x2="21" y2="17" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
                    </>
                  )}
                </svg>
              </div>
            </div>
            {errors.password && (
              <p className="mt-0.5 text-[9px] text-red-600" role="alert" aria-live="polite" id="password-error">
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full btn-gradient-primary disabled:opacity-50 disabled:cursor-not-allowed text-[9px] font-semibold"
            disabled={isLoading}
            style={{height: '24px'}}
            aria-label={isLoading ? 'Signing in...' : 'Sign in to your account'}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center border-t border-gray-200 mx-auto" style={{maxWidth: '70%', marginTop: '20px', paddingTop: '16px'}}>
          <p className="font-semibold drop-shadow-sm text-[8px]" style={{color: '#6b7280', marginBottom: '12px'}}>
            Not a member yet?
          </p>
          <button
            onClick={() => handleReg()}
            className="w-full btn-gradient-purple text-[9px] font-semibold"
            style={{height: '24px'}}
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