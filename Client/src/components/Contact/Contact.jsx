import React, {useState} from 'react';
import './Contact.css'
import { Card, CardHeader, CardTitle, CardContent } from '@/lib/ui/card';
import { Button } from '@/lib/ui/button';



const Contact = () => {



  return (
    <div className="min-h-screen bg-gray-50 pt-20">
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
                  <p className="text-gray-600">support@printcraft.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📞</span>
                <div>
                  <p className="font-medium text-gray-900">Phone</p>
                  <p className="text-gray-600">1-800-PRINTCRAFT</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🕒</span>
                <div>
                  <p className="font-medium text-gray-900">Business Hours</p>
                  <p className="text-gray-600">Mon-Fri 9AM-6PM EST</p>
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
              <Button
                type="submit"
                className="w-full"
                size="lg"
              >
                Send Message
              </Button>
            </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;