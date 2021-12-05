import { useMemo } from 'react';
import Button from '../../../../components/input/button/Button';
import LazyImage from '../../../../components/media/image/LazyImage';
import Bar from '../../../../components/ornamental/bars/Bar';
import Title from '../../../../components/title/Title';

import './Post.scss';

export type PostMetadata = {
  title : string,
  date : string,
  image ?: string,
  keywords : string,
  id : number,
}

export type PostData = {
  metadata : PostMetadata,
  snippet : string,
  content : string,
}

export type PostProps = {
  metadata : PostMetadata,
  children : React.ReactNode,
  image ?: string,
}

type HeaderProps = {
  metadata : PostMetadata,
  imageSrc ?: string,
}

const Header = ( { metadata, imageSrc } : HeaderProps ) => {
  return (
    <header className="post__header">
      { imageSrc && (
        <img
          src={ imageSrc } 
          alt={ metadata.title }
        />
      )}
      <Title
        text={ metadata.title }
        level={ 1 }
      />
      <div>{ metadata.date }</div>
      <Bar 
        direction="horizontal"
        variant="inset"
      />
    </header>
  );
};

const Post = ( { metadata, image, children } : PostProps ) : JSX.Element => {
  const splitKeywords = metadata.keywords.split( ', ' );

  return (
    <div className="post">
      <Header 
        metadata={ metadata } 
        imageSrc={ image }
      />
      { children }
      <footer>
        <Bar
          variant="inset" 
          direction="horizontal"
        />
        <div className="post__footer-keywords">
          { splitKeywords.map( keyword => (
            <Button
              key={ keyword }
              onClick={ () => console.log( keyword ) }
            >
              { keyword }
            </Button>
          ) ) }
        </div>
        
      </footer>
    </div>
  );
};

export default Post;