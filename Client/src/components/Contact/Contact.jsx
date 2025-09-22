import React, {useState} from 'react';
import './Contact.css'
import { Card, CardHeader, CardTitle, CardContent } from '@/lib/ui/card';



const Contact = () => {



  return (
    <div className="min-h-screen bg-gray-50 pt-20 page-container">
      <div className="max-w-4xl mx-auto px-4 sm:px-4 lg:px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">Contact Us</h1>
          <p className="text-gray-600 mt-4 text-lg">
            Get in touch with our team - we're here to help!
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">Get In Touch</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <span className="text-3xl">📧</span>
                <div>
                  <p className="font-bold text-gray-900 text-lg mb-2">Email</p>
                  <p className="text-gray-700 font-medium">support@whitneyscreations.com</p>
                  <p className="text-gray-700 font-medium">orders@whitneyscreations.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <span className="text-3xl">📞</span>
                <div>
                  <p className="font-bold text-gray-900 text-lg mb-2">Phone</p>
                  <p className="text-gray-700 font-medium">(555) 123-CRAFT (2738)</p>
                  <p className="text-gray-700 font-medium">Toll Free: 1-800-WHITNEY-1</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <span className="text-3xl">🏢</span>
                <div>
                  <p className="font-bold text-gray-900 text-lg mb-2">Address</p>
                  <p className="text-gray-700 font-medium">123 Creative Avenue</p>
                  <p className="text-gray-700 font-medium">Design District, NY 10001</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <span className="text-3xl">🕒</span>
                <div>
                  <p className="font-bold text-gray-900 text-lg mb-2">Business Hours</p>
                  <p className="text-gray-700 font-medium">Monday - Friday: 9:00 AM - 7:00 PM EST</p>
                  <p className="text-gray-700 font-medium">Saturday: 10:00 AM - 4:00 PM EST</p>
                  <p className="text-gray-700 font-medium">Sunday: Closed</p>
                </div>
              </div>
            </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">Send Message</CardTitle>
            </CardHeader>
            <CardContent>
            <form className="space-y-4">
              <div>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white text-gray-900"
                  type="text"
                  placeholder="Your Name"
                  required
                />
              </div>
              <div>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white text-gray-900"
                  type="email"
                  placeholder="Your Email"
                  required
                />
              </div>
              <div>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white text-gray-900"
                  placeholder="Your Message"
                  rows="4"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
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