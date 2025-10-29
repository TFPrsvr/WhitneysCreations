import React, {useState} from 'react'
import './Reg.css'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import { API_BASE_URL } from '../../config/api'


const Reg = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [userInfo, setUserInfo] = useState({})
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const nav = useNavigate()

  // const handleChange = (e) => {
  //   setFormData({
  //     ...formData, 
  //     [e.target.name]: e.target.value
  //   })
  // }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };

    // Validate specific field on blur
    if (name === 'email' && value) {
      if (!/\S+@\S+\.\S+/.test(value)) {
        newErrors.email = 'Please enter a valid email address';
      } else {
        delete newErrors.email;
      }
    }

    if (name === 'first_name' && !value.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (name === 'last_name' && !value.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (name === 'username' && value) {
      if (value.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      } else {
        delete newErrors.username;
      }
    }

    if (name === 'password' && value) {
      if (value.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
        newErrors.password = 'Password must include uppercase, lowercase, and number';
      } else {
        delete newErrors.password;
      }

      // Check if confirm password matches
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords must match';
        newErrors.password = 'Passwords must match';
      } else if (formData.confirmPassword && value === formData.confirmPassword) {
        delete newErrors.confirmPassword;
        delete newErrors.password;
      }
    }

    if (name === 'confirmPassword' && value) {
      if (value !== formData.password) {
        newErrors.confirmPassword = 'Passwords must match';
        newErrors.password = 'Passwords must match';
      } else {
        delete newErrors.confirmPassword;
        delete newErrors.password;
      }
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must include uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords must match';
      newErrors.password = 'Passwords must match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    axios({
      method:'post',
      url: `${API_BASE_URL}/api/reg`,
      data: {
        first_name: formData.first_name,
        last_name: formData.last_name,
        username: formData.username,
        email: formData.email,
        password: formData.password
    }
    })
    .then(res => {
      console.log('Registration Successful', res.data)
      setUserInfo(res.data)
      nav('/login')
    })
    .catch(err => {
      console.error('Registration failed:', err.response || err.message)
      if (err.response && err.response.data && err.response.data.msg) {
        setErrors({ general: err.response.data.msg });
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    })
    .finally(() => {
      setIsLoading(false);
    })
  }

  const handleLogin = () => {
    nav('/Login')
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 flex items-center justify-center px-4 relative page-container">
      {/* Background decorative elements */}
      <div className="absolute text-2xl opacity-40 hidden lg:block" style={{top: '1rem', left: '1rem', filter: 'drop-shadow(4px 4px 8px rgba(147,51,234,1)) drop-shadow(0 0 15px rgba(168,85,247,0.9)) drop-shadow(0 0 20px rgba(147,51,234,0.6)) drop-shadow(0 0 2px rgba(0,0,0,0.7))', animation: 'float 3s ease-in-out infinite'}} aria-hidden="true">🎨</div>
      <div className="absolute text-2xl opacity-40 hidden lg:block" style={{top: '1rem', right: '1rem', filter: 'drop-shadow(2px 2px 4px rgba(234,179,8,0.6)) drop-shadow(0 0 8px rgba(250,204,21,0.5)) drop-shadow(0 0 12px rgba(234,179,8,0.3)) drop-shadow(0 0 2px rgba(0,0,0,0.7))', animation: 'float 3s ease-in-out infinite'}} aria-hidden="true">👚</div>
      <div className="absolute text-2xl opacity-40 hidden lg:block" style={{bottom: '1rem', left: '1rem', filter: 'drop-shadow(4px 4px 8px rgba(59,130,246,1)) drop-shadow(0 0 20px rgba(96,165,250,0.9)) drop-shadow(0 0 30px rgba(59,130,246,0.6)) drop-shadow(0 0 2px rgba(0,0,0,0.7))', animation: 'float 3s ease-in-out infinite'}} aria-hidden="true">☕</div>
      <div className="absolute text-2xl opacity-40 hidden lg:block" style={{bottom: '1rem', right: '1rem', filter: 'drop-shadow(4px 4px 8px rgba(251,146,60,1)) drop-shadow(0 0 20px rgba(253,186,116,0.9)) drop-shadow(0 0 30px rgba(251,146,60,0.6)) drop-shadow(0 0 2px rgba(0,0,0,0.7))', animation: 'float 3s ease-in-out infinite'}} aria-hidden="true">🧥</div>

      <main className="w-full space-y-3 bg-white rounded-2xl shadow-2xl border border-gray-100" role="main" style={{maxWidth: '280px', paddingTop: '2.5rem', paddingBottom: '2.5rem', paddingLeft: '0.75rem', paddingRight: '0.75rem'}}>
        <header className="text-center" style={{marginTop: '-40px', marginBottom: '-24px'}}>
          <h1 className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent" style={{margin: '0', padding: '0', lineHeight: '1', fontSize: '26px'}}>Create Account</h1>
          <div className="text-center" style={{margin: '8px 0', padding: '0'}}>
            <span className="text-2xl" aria-hidden="true" style={{margin: '0', padding: '0', display: 'inline-block', lineHeight: '1'}}>👕</span>
          </div>
          <p className="font-semibold drop-shadow-sm text-[8px]" style={{margin: '0', padding: '0', marginBottom: '40px'}}>
            <span style={{color: '#6b7280'}}>Join Whitney's Unique Creations today</span>
          </p>
        </header>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-2.5 py-1.5 rounded-lg text-[10px] mx-auto" role="alert" aria-live="polite" style={{maxWidth: '85%'}}>
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mx-auto" noValidate style={{maxWidth: '70%'}}>
          <div className="grid grid-cols-2 gap-2" style={{marginBottom: '24px'}}>
            <div>
              <label htmlFor="first_name" className="block text-[13px] font-semibold mb-0.5 drop-shadow-sm" style={{color: '#6b7280'}}>
                First Name
              </label>
              <input
                id="first_name"
                className={`w-full px-2 py-1 border-2 rounded focus:ring-1 transition-all bg-white text-gray-900 text-[10px] ${
                  errors.first_name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                }`}
                style={{color: '#1f2937'}}
                type="text"
                placeholder="First"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="given-name"
                required
                aria-describedby={errors.first_name ? 'first_name-error' : undefined}
                aria-invalid={errors.first_name ? 'true' : 'false'}
              />
              {errors.first_name && (
                <p className="mt-0.5 text-[9px] text-red-600" role="alert" aria-live="polite" id="first_name-error">
                  {errors.first_name}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="last_name" className="block text-[13px] font-semibold mb-0.5 drop-shadow-sm" style={{color: '#6b7280'}}>
                Last Name
              </label>
              <input
                id="last_name"
                className={`w-full px-2 py-1 border-2 rounded focus:ring-1 transition-all bg-white text-gray-900 text-[10px] ${
                  errors.last_name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                }`}
                style={{color: '#1f2937'}}
                type="text"
                placeholder="Last"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="family-name"
                required
                aria-describedby={errors.last_name ? 'last_name-error' : undefined}
                aria-invalid={errors.last_name ? 'true' : 'false'}
              />
              {errors.last_name && (
                <p className="mt-0.5 text-[9px] text-red-600" role="alert" aria-live="polite" id="last_name-error">
                  {errors.last_name}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2" style={{marginBottom: '24px'}}>
            <div>
              <label htmlFor="reg_username" className="block text-[13px] font-semibold mb-0.5 drop-shadow-sm" style={{color: '#6b7280'}}>
                Username
              </label>
              <input
                id="reg_username"
                className={`w-full px-2 py-1 border-2 rounded focus:ring-1 transition-all bg-white text-gray-900 text-[10px] ${
                  errors.username ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                }`}
                style={{color: '#1f2937'}}
                type="text"
                placeholder="Username"
                name="username"
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

            <div>
              <label htmlFor="email" className="block text-[13px] font-semibold mb-0.5 drop-shadow-sm" style={{color: '#6b7280'}}>
                Email
              </label>
              <input
                id="email"
                className={`w-full px-2 py-1 border-2 rounded focus:ring-1 transition-all bg-white text-gray-900 text-[10px] ${
                  errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                }`}
                style={{color: '#1f2937'}}
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="email"
                required
                aria-describedby={errors.email ? 'email-error' : undefined}
                aria-invalid={errors.email ? 'true' : 'false'}
              />
              {errors.email && (
                <p className="mt-0.5 text-[9px] text-red-600" role="alert" aria-live="polite" id="email-error">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2" style={{marginBottom: '36px'}}>
            <div>
              <label htmlFor="reg_password" className="block text-[13px] font-semibold mb-0.5 drop-shadow-sm" style={{color: '#6b7280'}}>
                Password
              </label>
              <div className="relative">
                <input
                  id="reg_password"
                  className={`w-full px-2 py-1 pr-7 border-2 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white text-gray-900 text-[10px] ${
                    errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                  }`}
                  style={{color: '#1f2937', height: '28px'}}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password (8+)"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="new-password"
                  data-lpignore="true"
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
                      // Regular eye (password visible)
                      <>
                        <path d="M12 11a2 2 0 100-4 2 2 0 000 4z" stroke="#9ca3af" strokeWidth="1" fill="#9ca3af" />
                        <path d="M1 9s3-6 11-6 11 6 11 6-3 6-11 6S1 9 1 9z" stroke="#9ca3af" strokeWidth="1" fill="none" />
                      </>
                    ) : (
                      // Eye-slash (password hidden)
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

            <div>
              <label htmlFor="confirm_password" className="block text-[13px] font-semibold mb-0.5 drop-shadow-sm" style={{color: '#6b7280'}}>
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirm_password"
                  className={`w-full px-2 py-1 pr-7 border-2 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white text-gray-900 text-[10px] ${
                    errors.confirmPassword ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                  }`}
                  style={{color: '#1f2937', height: '28px'}}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="new-password"
                  data-lpignore="true"
                  required
                  aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                  aria-invalid={errors.confirmPassword ? 'true' : 'false'}
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowConfirmPassword(!showConfirmPassword); }}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  <svg
                    width="16"
                    height="12"
                    viewBox="0 0 24 18"
                    aria-hidden="true"
                    style={{fill: 'none', display: 'block'}}
                  >
                    {showConfirmPassword ? (
                      // Regular eye (password visible)
                      <>
                        <path d="M12 11a2 2 0 100-4 2 2 0 000 4z" stroke="#9ca3af" strokeWidth="1" fill="#9ca3af" />
                        <path d="M1 9s3-6 11-6 11 6 11 6-3 6-11 6S1 9 1 9z" stroke="#9ca3af" strokeWidth="1" fill="none" />
                      </>
                    ) : (
                      // Eye-slash (password hidden)
                      <>
                        <path d="M12 11a2 2 0 100-4 2 2 0 000 4z" stroke="#9ca3af" strokeWidth="1" fill="#9ca3af" />
                        <path d="M1 9s3-6 11-6 11 6 11 6-3 6-11 6S1 9 1 9z" stroke="#9ca3af" strokeWidth="1" fill="none" />
                        <line x1="3" y1="1" x2="21" y2="17" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
                      </>
                    )}
                  </svg>
                </div>
              </div>
              {errors.confirmPassword && (
                <p className="mt-0.5 text-[9px] text-red-600" role="alert" aria-live="polite" id="confirm-password-error">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn-gradient-purple disabled:opacity-50 disabled:cursor-not-allowed text-[9px] font-semibold"
            disabled={isLoading}
            style={{height: '24px'}}
            aria-label={isLoading ? 'Creating account...' : 'Create your account'}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center border-t border-gray-200 mx-auto" style={{maxWidth: '70%', marginTop: '20px', paddingTop: '16px'}}>
          <p className="font-semibold drop-shadow-sm text-[8px]" style={{color: '#6b7280', marginBottom: '12px'}}>
            Already have an account?
          </p>
          <button
            onClick={() => handleLogin()}
            className="w-full btn-gradient-primary text-[9px] font-semibold"
            style={{height: '24px'}}
            aria-label="Go to sign in page"
          >
            Sign In
          </button>
        </div>
      </main>
    </div>
  )
}

export default Reg