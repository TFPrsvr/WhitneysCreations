import React, {useState, useEffect} from 'react';
import './Contact.css'
import { Card, CardHeader, CardTitle, CardContent } from '@/lib/ui/card';
import axios from 'axios';
import SuggestionCard from '../Suggestions/SuggestionCard';
import SuggestionForm from '../Suggestions/SuggestionForm';
import { API_BASE_URL } from '../../config/api';



const Contact = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [editingSuggestion, setEditingSuggestion] = useState(null);
  const [isAddingSuggestion, setIsAddingSuggestion] = useState(false);

  useEffect(() => {
    const fetchSuggestions = () => {
      const token = localStorage.getItem('token');

      axios({
        method: 'get',
        url: `${API_BASE_URL}/api/suggestions`,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      })
      .then(res => {
        if (Array.isArray(res.data.suggestions)) {
          setSuggestions(res.data.suggestions);
        } else {
          console.log('Invalid data format:', res.data);
        }
      })
      .catch(error => {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      });
    };

    fetchSuggestions();
  }, []);

  const handleEdit = (suggestion) => {
    setEditingSuggestion(suggestion);
  };

  const handleDelete = (suggestionId) => {
    setSuggestions(prevSuggestions =>
      prevSuggestions.filter(s => s._id !== suggestionId)
    );
  };

  const handleSuccess = (updatedSuggestion) => {
    if (!updatedSuggestion || !updatedSuggestion._id) {
      console.error('Updated suggestion or _id is missing:', updatedSuggestion);
      return;
    }

    if (editingSuggestion) {
      setSuggestions(prevSuggestions =>
        prevSuggestions.map(suggestion =>
          suggestion._id === updatedSuggestion._id ? updatedSuggestion : suggestion
        )
      );
    } else {
      setSuggestions(prevSuggestions => [...prevSuggestions, updatedSuggestion]);
    }
    setEditingSuggestion(null);
    setIsAddingSuggestion(false);
  };

  const handleCancel = () => {
    setEditingSuggestion(null);
    setIsAddingSuggestion(false);
  };

  const handleAddSuggestion = () => {
    setIsAddingSuggestion(true);
  };

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
              <div className="flex items-start space-x-4 p-4 rounded-lg">
                <div className="flex flex-col items-center">
                  <span className="text-3xl" aria-hidden="true">📧</span>
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
              <div className="flex items-start space-x-4 p-4 rounded-lg">
                <div className="flex flex-col items-center">
                  <span className="text-3xl" aria-hidden="true">📞</span>
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
              <div className="flex items-start space-x-4 p-4 rounded-lg">
                <div className="flex flex-col items-center">
                  <span className="text-3xl" aria-hidden="true">🏢</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2 drop-shadow-sm">Address</h3>
                  <address className="text-gray-900 font-semibold not-italic">
                    3843 Hwy 45<br/>
                    Kenton, TN 38233
                  </address>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 rounded-lg">
                <div className="flex flex-col items-center">
                  <span className="text-3xl" aria-hidden="true">🕒</span>
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

        {/* Suggestions Section */}
        <section className="mt-16 pt-12 border-t border-gray-200">
          <div className="text-center mb-8">
            <p className="text-xl text-gray-600 mb-4">Let Your Imagination Run Wild</p>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-8">Ideas That Come To Life</h2>
          </div>

          {editingSuggestion ? (
            <SuggestionForm
              suggestion={editingSuggestion}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          ) : isAddingSuggestion ? (
            <SuggestionForm
              suggestion={null}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          ) : (
            <div className="suggestions-list">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">What Can You Imagine?</h3>
              <div className="text-center mb-8">
                <button
                  onClick={handleAddSuggestion}
                  className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  style={{
                    maxWidth: '16vw',
                    minWidth: '200px',
                    borderRadius: '12px'
                  }}
                >
                  Add a Suggestion
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {suggestions.length > 0 ? (
                  suggestions.map((suggestion) => (
                    <SuggestionCard
                      key={suggestion._id}
                      suggestion={suggestion}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-xl text-gray-600">No suggestions available.</p>
                    <p className="text-lg text-gray-500 mt-2">Be the first to share your creative ideas!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Contact;