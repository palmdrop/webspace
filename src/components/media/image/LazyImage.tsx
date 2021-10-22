import React, { useEffect, useMemo, useState } from 'react'
import { LazyLoadImage, ScrollPosition } from 'react-lazy-load-image-component';

import './LazyImage.scss';

type Props = {
  src : string,
  alt : string,
  width? : number,
  height? : number,
  scrollPosition? : ScrollPosition,
  placeholder? : JSX.Element,
  children? : React.ReactNode
};

const loadedImages = new Set<string>();

const LazyImage = ( { src, alt, width, height, scrollPosition, placeholder, children } : Props ) : JSX.Element => {
  const [ loaded, setLoaded ] = useState( false );
  const alreadyLoaded = useMemo( () => loadedImages.has( src ), [ src ] );

  useEffect( () => {
    if( !loadedImages.has( src ) && loaded ) {
      loadedImages.add( src );
    }
  }, [ src, loaded ] );
  
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
        visibleByDefault={ alreadyLoaded }
      /> 
      { loaded && children }
    </div>
  )
}

export default LazyImage;
