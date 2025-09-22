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
  })
  const [userInfo, setUserInfo] = useState({})
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 flex items-center justify-center py-8 px-4 relative page-container" style={{maxWidth: 'calc(100vw - 11rem)'}}>
      {/* Background decorative elements */}
      <div className="absolute top-15 right-15 text-4xl opacity-20 animate-spin hidden lg:block" style={{animationDuration: '8s'}} aria-hidden="true">🎨</div>
      <div className="absolute top-32 left-15 text-3xl opacity-20 animate-bounce hidden lg:block" aria-hidden="true">👚</div>
      <div className="absolute bottom-32 right-15 text-3xl opacity-20 animate-pulse hidden lg:block" aria-hidden="true">☕</div>
      <div className="absolute bottom-15 left-15 text-2xl opacity-20 animate-bounce delay-500 hidden lg:block" aria-hidden="true">🧥</div>
      
      <main className="max-w-sm w-full space-y-6 bg-white rounded-2xl shadow-2xl p-6 border border-gray-100" role="main" style={{maxWidth: '450px'}}>
        <header className="text-center">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Create Account</h1>
            <span className="text-4xl" aria-hidden="true">👕</span>
          </div>
          <p className="text-gray-800 font-semibold mt-2 drop-shadow-sm">Join Whitney's Creations today</p>
        </header>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm" role="alert" aria-live="polite">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                id="first_name"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 transition-all bg-white text-gray-900 ${
                  errors.first_name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                }`}
                style={{color: '#1f2937'}}
                type="text"
                placeholder="Enter first name"
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
                <p className="mt-1 text-sm text-red-600" role="alert" aria-live="polite" id="first_name-error">
                  {errors.first_name}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                id="last_name"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 transition-all bg-white text-gray-900 ${
                  errors.last_name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                }`}
                style={{color: '#1f2937'}}
                type="text"
                placeholder="Enter last name"
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
                <p className="mt-1 text-sm text-red-600" role="alert" aria-live="polite" id="last_name-error">
                  {errors.last_name}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="reg_username" className="block text-base font-bold text-gray-900 mb-2 drop-shadow-sm">
              Username
            </label>
            <input
              id="reg_username"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 transition-all bg-white text-gray-900 ${
                errors.username ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
              }`}
              style={{color: '#1f2937'}}
              type="text"
              placeholder="Choose a username"
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
              <p className="mt-1 text-sm text-red-600" role="alert" aria-live="polite" id="username-error">
                {errors.username}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 transition-all bg-white text-gray-900 ${
                errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
              }`}
              style={{color: '#1f2937'}}
              type="email"
              placeholder="Enter your email address"
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
              <p className="mt-1 text-sm text-red-600" role="alert" aria-live="polite" id="email-error">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="reg_password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="reg_password"
                className={`w-full px-3 py-2 pr-12 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white text-gray-900 ${
                  errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                }`}
                style={{color: '#1f2937'}}
                type={showPassword ? "text" : "password"}
                placeholder="Create your own secure password (8+ characters)"
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
            className="w-full btn-gradient-purple disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
            aria-label={isLoading ? 'Creating account...' : 'Create your account'}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?
          </p>
          <button
            onClick={() => handleLogin()}
            className="w-full btn-gradient-primary"
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