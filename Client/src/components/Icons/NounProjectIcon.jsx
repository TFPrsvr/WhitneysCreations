import React from 'react';

const NounProjectIcon = ({
  iconPath,
  iconName,
  creator,
  size = '1.5rem',
  className = '',
  style = {},
  showAttribution = false
}) => {
  const attributionUrl = `https://thenounproject.com/browse/icons/term/${iconName.toLowerCase().replace(/\s+/g, '-')}/`;

  const iconStyle = {
    width: size,
    height: size,
    display: 'inline-block',
    fill: 'currentColor',
    ...style
  };

  return (
    <>
      <img
        src={iconPath}
        alt=""
        style={iconStyle}
        className={className}
        aria-hidden="true"
      />
      {showAttribution && (
        <span className="sr-only">
          {iconName} by {creator} from{' '}
          <a
            href={attributionUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={`${iconName} Icons`}
          >
            Noun Project
          </a>{' '}
          (CC BY 3.0)
        </span>
      )}
    </>
  );
};

export default NounProjectIcon;