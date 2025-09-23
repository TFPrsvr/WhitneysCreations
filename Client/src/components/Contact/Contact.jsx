import React, {useState} from 'react';
import './Contact.css'
import { Card, CardHeader, CardTitle, CardContent } from '@/lib/ui/card';



const Contact = () => {



  return (
    <div className="min-h-screen bg-gray-50 pt-20 page-container">
      <div className="max-w-4xl mx-auto px-4 sm:px-4 lg:px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">Contact Us</h1>
          <p className="text-gray-600 mt-4 text-lg">
            Get in touch with our team - we're here to help!
          </p>
        </header>
        
        <main className="grid md:grid-cols-2 gap-12">
          <section aria-labelledby="contact-info-title">
            <Card>
              <CardHeader>
                <CardTitle id="contact-info-title" className="text-2xl font-bold text-gray-900">Get In Touch</CardTitle>
              </CardHeader>
              <CardContent>
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex flex-col items-center">
                  <span className="text-3xl" aria-hidden="true">📧</span>
                  <span className="text-xs font-medium text-gray-600 mt-1">Email</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2 drop-shadow-sm">Email</h3>
                  <p className="text-gray-900 font-semibold">
                    <a href="mailto:support@whitneyscreations.com" className="hover:text-primary-600 transition-colors">
                      support@whitneyscreations.com
                    </a>
                  </p>
                  <p className="text-gray-900 font-semibold">
                    <a href="mailto:orders@whitneyscreations.com" className="hover:text-primary-600 transition-colors">
                      orders@whitneyscreations.com
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex flex-col items-center">
                  <span className="text-3xl" aria-hidden="true">📞</span>
                  <span className="text-xs font-medium text-gray-600 mt-1">Phone</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2 drop-shadow-sm">Phone</h3>
                  <p className="text-gray-900 font-semibold">
                    <a href="tel:+15551232738" className="hover:text-primary-600 transition-colors">
                      (555) 123-CRAFT (2738)
                    </a>
                  </p>
                  <p className="text-gray-900 font-semibold">
                    <a href="tel:+18009448639" className="hover:text-primary-600 transition-colors">
                      Toll Free: 1-800-WHITNEY-1
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex flex-col items-center">
                  <span className="text-3xl" aria-hidden="true">🏢</span>
                  <span className="text-xs font-medium text-gray-600 mt-1">Address</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2 drop-shadow-sm">Address</h3>
                  <address className="text-gray-900 font-semibold not-italic">
                    3843 Hwy 45<br/>
                    Kenton, TN 38233
                  </address>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex flex-col items-center">
                  <span className="text-3xl" aria-hidden="true">🕒</span>
                  <span className="text-xs font-medium text-gray-600 mt-1">Hours</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2 drop-shadow-sm">Business Hours</h3>
                  <ul className="text-gray-900 font-semibold space-y-1">
                    <li>Monday - Friday: 8:00 AM - 6:00 PM CST</li>
                    <li>Saturday: 9:00 AM - 3:00 PM CST</li>
                    <li>Sunday: Closed</li>
                  </ul>
                </div>
              </div>
            </div>
            </CardContent>
          </Card>
          </section>

          <section aria-labelledby="contact-form-title">
          <Card>
            <CardHeader>
              <CardTitle id="contact-form-title" className="text-2xl font-bold text-gray-900">Send Message</CardTitle>
            </CardHeader>
            <CardContent>
            <form className="space-y-4" noValidate>
              <div>
                <label htmlFor="contact-name" className="block text-base font-bold text-gray-900 mb-2 drop-shadow-sm">
                  Full Name
                </label>
                <input
                  id="contact-name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white text-gray-900"
                  type="text"
                  placeholder="Your Name"
                  autoComplete="name"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-base font-bold text-gray-900 mb-2 drop-shadow-sm">
                  Email Address
                </label>
                <input
                  id="contact-email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white text-gray-900"
                  type="email"
                  placeholder="Your Email"
                  autoComplete="email"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-base font-bold text-gray-900 mb-2 drop-shadow-sm">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white text-gray-900"
                  placeholder="Your Message"
                  rows="4"
                  required
                  aria-required="true"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                style={{
                  maxWidth: '16vw',
                  minWidth: '200px',
                  borderRadius: '12px'
                }}
                aria-label="Send your message to Whitney's Creations"
              >
                Send Message
              </button>
            </form>
            </CardContent>
          </Card>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Contact;