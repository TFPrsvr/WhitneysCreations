import React from 'react';
import Img1 from '../Others/img1.jpg'
import Img2 from '../Others/img2.jpg'
import Img3 from '../Others/img3.jpg'
import Img4 from '../Others/img4.jpg'
import Img5 from '../Others/img5.jpg'
import Img6 from '../Others/img6.jpg'


const ImageGrid = ({  }) => {
  const images = [
    {src: Img1, alt: 'Image 1'},  
    {src: Img2, alt: 'Image 2'},  
    {src: Img3, alt: 'Image 3'},  
    {src: Img4, alt: 'Image 4'},  
    {src: Img5, alt: 'Image 5'},  
    {src: Img6, alt: 'Image 6'},  
  ]

  if (!images || images.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">No Images To Display</h2>
          <p className="text-gray-500">Please check back later for new images.</p>
        </div>
      </div>
    );
  }
 
  
  const handleImageClick = (image) => {
    console.log('Image clicked:', image)
  };
  
  const onImageClick = (image, index) => {
    console.log('onImgClick:', image)
    handleImageClick(image.index)
  }


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Image Gallery</h1>
          <p className="text-gray-600">Browse our collection of images</p>
        </div>

        {/* Image Grid */}
        <div className="w-full mx-auto p-8">
          <div className="grid grid-cols-3 gap-8 place-items-center max-w-4xl mx-auto">
            {images.map((image, index) => (
              <img
                key={index}
                src={image.src}
                alt={image.alt}
                className="object-cover cursor-pointer hover:opacity-80 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                style={{ 
                  width: '128px',
                  height: '128px',
                  borderRadius: '12%',
                  maxWidth: '128px',
                  maxHeight: '128px',
                  minWidth: '128px',
                  minHeight: '128px'
                }}
                onClick={() => onImageClick(image)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGrid;