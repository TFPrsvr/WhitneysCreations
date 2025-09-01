import { Link } from 'react-router-dom';

const About = () => {
  const teamMembers = [
    {
      name: 'Whitney Richards',
      role: 'Founder & CEO',
      bio: 'Passionate about empowering creators to build sustainable businesses through print-on-demand.',
      avatar: '👩‍💻',
      linkedin: 'https://linkedin.com/in/whitney-richards'
    },
    {
      name: 'Tabitha Fortner',
      role: 'Head of Design',
      bio: '10+ years in product design, focused on creating intuitive and powerful design tools.',
      avatar: '👩‍💻',
      linkedin: 'https://linkedin.com/in/tabitha-fortner'
    },
    {
      name: 'Terry Green',
      role: 'VP of Operations',
      bio: 'Ensures quality and fast fulfillment across our global network of print partners.',
      avatar: '👨‍💻',
      linkedin: 'https://linkedin.com/in/terry-green'
    }
  ];

  const values = [
    {
      icon: '🎯',
      title: 'Quality First',
      description: 'We never compromise on product quality. Every item is printed on premium materials with vibrant, long-lasting inks.'
    },
    {
      icon: '🌱',
      title: 'Sustainable Practices',
      description: 'Eco-friendly printing processes and sustainable materials. We care about our planet as much as your business.'
    },
    {
      icon: '🚀',
      title: 'Creator Success',
      description: 'Your success is our success. We provide tools, support, and guidance to help you build a thriving business.'
    },
    {
      icon: '🤝',
      title: 'Community Driven',
      description: 'Built by creators, for creators. We listen to our community and continuously improve based on your feedback.'
    }
  ];

  const milestones = [
    { year: '2020', event: 'PrintCraft founded with a vision to democratize custom product creation' },
    { year: '2021', event: 'Launched with 10 product types and 100 satisfied creators' },
    { year: '2022', event: 'Expanded to 50+ products and served 10,000+ customers worldwide' },
    { year: '2023', event: 'Introduced advanced design tools and automated fulfillment' },
    { year: '2024', event: 'Growing community of 100,000+ active creators and counting' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-4 page-container">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-purple-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About PrintCraft
            </h1>
            <p className="text-2xl md:text-3xl mb-8 max-w-3xl mx-auto text-gray-100 font-bold">
              We&apos;re on a mission to empower creators worldwide to turn their ideas into successful businesses 
              through high-quality print-on-demand products.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center justify-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-xl text-gray-700 mb-6 font-semibold">
                At PrintCraft, we believe everyone should have the opportunity to turn their creativity into a 
                thriving business. That&apos;s why we&apos;ve built the most intuitive, powerful, and accessible 
                print-on-demand platform in the world.
              </p>
              <p className="text-xl text-gray-700 mb-8 font-semibold">
                Whether you&apos;re an artist, entrepreneur, or just someone with great ideas, we provide all the 
                tools you need to design, sell, and fulfill custom products without any upfront investment 
                or inventory management.
              </p>
              <Link
                to="/reg"
                className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
              >
                Start Your Journey
              </Link>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-100 to-purple-100 rounded-2xl p-8 text-center">
                <div className="text-8xl mb-6">🎨</div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <Link to="/projects" className="bg-white rounded-lg p-4 hover:bg-primary-50 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                    <div className="text-2xl font-bold text-primary-600">100K+</div>
                    <div className="text-sm text-gray-600">Active Creators</div>
                  </Link>
                  <Link to="/products" className="bg-white rounded-lg p-4 hover:bg-primary-50 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                    <div className="text-2xl font-bold text-primary-600">2M+</div>
                    <div className="text-sm text-gray-600">Products Sold</div>
                  </Link>
                  <Link to="/products" className="bg-white rounded-lg p-4 hover:bg-primary-50 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                    <div className="text-2xl font-bold text-primary-600">150+</div>
                    <div className="text-sm text-gray-600">Product Types</div>
                  </Link>
                  <Link to="/contact" className="bg-white rounded-lg p-4 hover:bg-primary-50 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                    <div className="text-2xl font-bold text-primary-600">50+</div>
                    <div className="text-sm text-gray-600">Countries</div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do at PrintCraft
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex-shrink-0">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed flex-grow">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate people behind PrintCraft
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 text-center hover:bg-white hover:shadow-lg transition-all duration-300">
                <div className="text-6xl mb-4">{member.avatar}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600 mb-6 text-sm">{member.bio}</p>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium hover:underline"
                >
                  Connect on LinkedIn →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-4 lg:px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600">
              From startup to global platform
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-px top-0 bottom-0 w-0.5 bg-primary-200"></div>
            
            {milestones.map((milestone, index) => (
              <div key={index} className="relative mb-8">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center z-10">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                
                <div className={`flex ${index % 2 === 0 ? 'justify-end pr-8 md:pr-16' : 'justify-start pl-8 md:pl-16'}`}>
                  <div className={`bg-white p-6 rounded-lg shadow-sm max-w-md w-full ${index % 2 === 0 ? 'mr-4' : 'ml-4'}`}>
                    <div className="text-primary-600 font-bold text-lg mb-2">{milestone.year}</div>
                    <p className="text-gray-700 text-sm leading-relaxed">{milestone.event}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 bg-gradient-to-r from-primary-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-4 lg:px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
            WebkitTextStroke: '1px rgba(0, 0, 0, 0.3)'
          }}>
            Ready to Join Our Community?
          </h2>
          <p className="text-xl mb-8 font-semibold" style={{
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
          }}>
            Become part of a thriving community of creators who are building successful businesses with PrintCraft.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/reg"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
            >
              Get Started Free
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-600 transition-all duration-200"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;