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
      if (value.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
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
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 flex items-center justify-center py-8 px-4 relative page-container">
      {/* Background decorative elements */}
      <div className="absolute top-15 right-15 text-4xl opacity-20 animate-spin hidden lg:block" style={{animationDuration: '8s'}}>🎨</div>
      <div className="absolute top-32 left-15 text-3xl opacity-20 animate-bounce hidden lg:block">👚</div>
      <div className="absolute bottom-32 right-15 text-3xl opacity-20 animate-pulse hidden lg:block">☕</div>
      <div className="absolute bottom-15 left-15 text-2xl opacity-20 animate-bounce delay-500 hidden lg:block">🧥</div>
      
      <div className="max-w-md w-full space-y-6 bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        <div className="text-center">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Create Account</h1>
            <span className="text-4xl">👕</span>
          </div>
          <p className="text-gray-600 mt-2">Join Whitney's Creations today</p>
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
                autocomplete="given-name"
                required
              />
              {errors.first_name && (
                <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
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
                autocomplete="family-name"
                required
              />
              {errors.last_name && (
                <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="reg_username" className="block text-sm font-medium text-gray-700 mb-2">
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
              autocomplete="username"
              required
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username}</p>
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
              autocomplete="email"
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
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
                placeholder="Create a secure password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                autocomplete="new-password"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                <span className="text-xl">
                  {showPassword ? '🙈' : '👁️'}
                </span>
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            style={{borderRadius: '12px'}}
          >
            Create Account
          </button>
        </form>

        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?
          </p>
          <button
            onClick={() => handleLogin()}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            style={{borderRadius: '12px'}}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  )
}

export default Reg