import React from 'react';
import { getAllProfessionalIcons } from '../../config/navigationIcons';
import { getAllProfessionalSocialIcons } from '../../config/socialMediaIcons';

const IconAttributions = () => {
  // Automatically get all professional icons for attribution
  const professionalIcons = getAllProfessionalIcons();
  const professionalSocialIcons = getAllProfessionalSocialIcons();

  // Combine all professional icons
  const allProfessionalIcons = [...professionalIcons, ...professionalSocialIcons];

  const attributions = allProfessionalIcons.map(icon => ({
    iconName: icon.iconName,
    creator: icon.creator,
    url: `https://thenounproject.com/browse/icons/term/${icon.iconName.toLowerCase().replace(/\s+/g, '-')}/`,
    title: `${icon.iconName} Icons`
  }));

  // Return null if no professional icons are being used
  if (attributions.length === 0) {
    return null;
  }

  return (
    <div className="icon-attributions" style={{
      padding: '20px',
      fontSize: '0.8rem',
      color: '#666',
      borderTop: '1px solid #eee',
      backgroundColor: '#f9f9f9',
      textAlign: 'center'
    }}>
      <h4 style={{marginBottom: '10px', fontSize: '0.9rem', color: '#333'}}>Icon Attributions</h4>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px'}}>
        {attributions.map((attr, index) => (
          <span key={index}>
            {attr.iconName} by {attr.creator} from{' '}
            <a
              href={attr.url}
              target="_blank"
              rel="noopener noreferrer"
              title={attr.title}
              style={{color: '#007bff', textDecoration: 'none'}}
            >
              Noun Project
            </a>{' '}
            (CC BY 3.0)
          </span>
        ))}
      </div>
    </div>
  );
};

export default IconAttributions;