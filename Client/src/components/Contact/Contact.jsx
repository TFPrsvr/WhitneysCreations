import React, {useState} from 'react';
import './Contact.css'
import { Card, CardHeader, CardTitle, CardContent } from '@/lib/ui/card';



const Contact = () => {



  return (
    <div className="min-h-screen bg-gray-50 pt-20 page-container">
      <div className="max-w-4xl mx-auto px-4 sm:px-4 lg:px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="header-main">Contact Us</h1>
          <p className="text-gray-600 mt-4 text-lg">
            Get in touch with our team - we're here to help!
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <Card>
            <CardHeader>
              <CardTitle className="header-primary">Get In Touch</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📧</span>
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <p className="text-gray-600">support@whitneyscreations.com</p>
                  <p className="text-gray-600">orders@whitneyscreations.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📞</span>
                <div>
                  <p className="font-medium text-gray-900">Phone</p>
                  <p className="text-gray-600">(555) 123-CRAFT (2738)</p>
                  <p className="text-gray-600">Toll Free: 1-800-WHITNEY-1</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🏢</span>
                <div>
                  <p className="font-medium text-gray-900">Address</p>
                  <p className="text-gray-600">123 Creative Avenue</p>
                  <p className="text-gray-600">Design District, NY 10001</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🕒</span>
                <div>
                  <p className="font-medium text-gray-900">Business Hours</p>
                  <p className="text-gray-600">Monday - Friday: 9:00 AM - 7:00 PM EST</p>
                  <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM EST</p>
                  <p className="text-gray-600">Sunday: Closed</p>
                </div>
              </div>
            </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="header-primary">Send Message</CardTitle>
            </CardHeader>
            <CardContent>
            <form className="space-y-4">
              <div>
                <input
                  className="input-primary"
                  type="text"
                  placeholder="Your Name"
                  required
                />
              </div>
              <div>
                <input
                  className="input-primary"
                  type="email"
                  placeholder="Your Email"
                  required
                />
              </div>
              <div>
                <textarea
                  className="input-large"
                  placeholder="Your Message"
                  rows="4"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
              >
                Send Message
              </button>
            </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;