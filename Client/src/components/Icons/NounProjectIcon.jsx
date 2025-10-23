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
    overflow: 'hidden',
    ...style
  };

  return (
    <div style={{ display: 'inline-block', overflow: 'hidden', width: size, height: size }}>
      <img
        src={iconPath}
        alt=""
        title=""
        style={iconStyle}
        className={`${className} noun-icon-no-attribution`}
        aria-hidden="true"
      />
    </div>
  );
};

export default NounProjectIcon;