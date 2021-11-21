import './blogPage.scss';

export type PostMetadata = {
  title : string,
  date : string,
  image? : string,
  id : number,
}

export type PostData = {
  metadata : PostMetadata,
  content : string,
}

export type PostProps = {
  metadata : PostMetadata,
  children : React.ReactNode,
}

const Post = ( { metadata, children } : PostProps ) => {
  return (
    <div className="post">
      { children }
    </div>
  );
}

export default Post;