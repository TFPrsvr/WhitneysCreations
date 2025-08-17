import React, {useState} from 'react'
import '../Reg/Reg.css'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'


const Reg = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
  })
  const [userInfo, setUserInfo] = useState({})  
  
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
  };


  const handleSubmit = (e) => {
    e.preventDefault()

    axios({
      method:'post',
      url: 'http://localhost:3002/api/reg',
      data: { 
        first_name: formData.first_name,
        last_name: formData.last_name,
        username: formData.username,
        email: formData.email,
        password: formData.password
    }
    })
    .then(res => {
      console.log('Registration Successfull', res.data)
      setUserInfo(res.data)
      nav('/login')
    })
    .catch(err => {
      console.error('Registration failed:', err.response || err.message)
    })
  }

  const handleLogin = () => {
    nav('/Login')
  }



  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="header-main">Create Account</h1>
          <p className="text-gray-600 mt-2">Join PrintCraft today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              className="input-primary"
              type="text"
              placeholder="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
            <input
              className="input-primary"
              type="text"
              placeholder="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <input
              className="input-primary"
              type="text"
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <input
              className="input-primary"
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <input
              className="input-primary"
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit"
            className="btn-action-blue w-full py-3"
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
            className="btn-secondary mt-2"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  )
}

export default Reg