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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 flex items-center justify-center py-12 px-4 sm:px-4 lg:px-4 relative ml-64 max-w-none overflow-x-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-15 right-15 text-4xl opacity-20 animate-spin hidden lg:block" style={{animationDuration: '8s'}}>🎨</div>
      <div className="absolute top-32 left-15 text-3xl opacity-20 animate-bounce hidden lg:block">👚</div>
      <div className="absolute bottom-32 right-15 text-3xl opacity-20 animate-pulse hidden lg:block">☕</div>
      <div className="absolute bottom-15 left-15 text-2xl opacity-20 animate-bounce delay-500 hidden lg:block">🧥</div>
      
      <div className="max-w-md w-full space-y-6 bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="text-4xl mr-3">👕</span>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Create Account</h1>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white text-gray-900"
                style={{color: '#1f2937'}}
                type="text"
                placeholder="Enter first name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white text-gray-900"
                style={{color: '#1f2937'}}
                type="text"
                placeholder="Enter last name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white text-gray-900"
              style={{color: '#1f2937'}}
              type="text"
              placeholder="Choose a username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white text-gray-900"
              style={{color: '#1f2937'}}
              type="email"
              placeholder="Enter your email address"
              name="email"
              value={formData.email}
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
              placeholder="Create a secure password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            style={{borderRadius: '10%'}}
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
            className="w-full mt-3 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-200"
            style={{borderRadius: '10%'}}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  )
}

export default Reg