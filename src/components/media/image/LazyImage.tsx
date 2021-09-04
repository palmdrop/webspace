import React, { useState } from 'react'
import { LazyLoadImage, ScrollPosition } from 'react-lazy-load-image-component';

import './LazyImage.scss';

type Props = {
  src : string,
  alt : string,
  width? : number,
  height? : number,
  scrollPosition? : ScrollPosition,
  placeholder? : JSX.Element
};

const LazyImage = ( { src, alt, width, height, scrollPosition, placeholder } : Props ) : JSX.Element => {
  const [ loaded, setLoaded ] = useState( false );
  
  return (
    <div className={ `lazy-image ${ loaded ? 'lazy-image--loaded' : '' }` }>
      <LazyLoadImage
        src={ src }
        alt={ alt }
        width={ width }
        height={ height }
        scrollPosition={ scrollPosition }
        placeholder={ placeholder }
        afterLoad={ () => setLoaded( true ) } 
      /> 
    </div>
  )
}

export default LazyImage;
