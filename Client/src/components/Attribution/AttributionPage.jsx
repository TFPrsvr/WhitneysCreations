import React from 'react';
import { getAllProfessionalIcons } from '../../config/navigationIcons';
import { getAllProfessionalSocialIcons } from '../../config/socialMediaIcons';

const AttributionPage = () => {
  const professionalIcons = getAllProfessionalIcons();
  const professionalSocialIcons = getAllProfessionalSocialIcons();
  const allProfessionalIcons = [...professionalIcons, ...professionalSocialIcons];

  const attributions = allProfessionalIcons.map(icon => ({
    iconName: icon.iconName,
    creator: icon.creator,
    url: `https://thenounproject.com/browse/icons/term/${icon.iconName.toLowerCase().replace(/\s+/g, '-')}/`,
    title: `${icon.iconName} Icons`
  }));

  return (
    <div className="min-h-screen bg-gray-50 page-container">
      <div className="max-w-4xl mx-auto px-4 sm:px-4 lg:px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Icon Attributions
          </h1>
          <p className="text-gray-600 mt-4 text-lg">
            We believe in giving credit where credit is due. All professional icons used on this site are from talented creators.
          </p>
        </header>

        <main>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Professional Icons</h2>
            <p className="text-gray-600 mb-8 text-center">
              All icons are used under Creative Commons Attribution (CC BY 3.0) license from The Noun Project.
            </p>

            {attributions.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {attributions.map((attr, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow duration-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{attr.iconName}</h3>
                    <p className="text-gray-600 mb-3">by {attr.creator}</p>
                    <a
                      href={attr.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={attr.title}
                      className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                    >
                      View on Noun Project
                    </a>
                    <p className="text-xs text-gray-500 mt-2">(CC BY 3.0)</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">No professional icons currently in use.</p>
              </div>
            )}

            <div className="mt-12 pt-8 border-t border-gray-200 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">About The Noun Project</h3>
              <p className="text-gray-600 mb-4">
                The Noun Project is a platform that brings together a global community of designers creating icons and symbols.
                They believe that visual communication can transcend cultural and language barriers.
              </p>
              <a
                href="https://thenounproject.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Visit The Noun Project
              </a>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-3">License Information</h3>
              <p className="text-gray-600 text-sm max-w-2xl mx-auto">
                All icons are used under the Creative Commons Attribution (CC BY 3.0) license. This means the icons are free to use
                as long as proper attribution is given to the original creators. We are committed to supporting the creative community
                by providing proper attribution for all creative works used on our platform.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AttributionPage;