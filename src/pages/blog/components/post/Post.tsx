import { Link } from 'react-router-dom';
import { PageRoute } from '../../../../App';
import SimpleNavBar from '../../../../components/navigation/navbar/simple/SimpleNavBar';
import Bar from '../../../../components/ornamental/bars/Bar';
import Title from '../../../../components/title/Title';
import { formatDate } from '../../blog';

import { ReactComponent as Arrow } from '../../../../assets/svg/arrow.svg';

import './Post.scss';

export type PostMetadata = {
  title : string,
  date : string,
  image ?: string,
  keywords : string[],
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
      <Link 
        className="post__header-back-arrow"
        to={ PageRoute.blog }
      >
        <Arrow className="arrow"/>
        <div className="arrow-background" />
      </Link>
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
      <div className="post__header-date">{ formatDate( metadata.date ) }</div>
      <Bar 
        direction="horizontal"
        variant="inset"
      />
    </header>
  );
};

const Post = ( { metadata, image, children } : PostProps ) : JSX.Element => {
  const title = process.env.REACT_APP_BLOG_TITLE ?? 'blog';

  return (
    <div className="post">
      <Header 
        metadata={ metadata } 
        imageSrc={ image }
      />
      { children }
      <Bar
        variant="inset" 
        direction="horizontal"
      />
      <footer>
        <span>
          Obscured - { title } - palmdrop
        </span>
        <SimpleNavBar 
          mainRoute={ PageRoute.root }
        />
      </footer>
    </div>
  );
};

export default Post;