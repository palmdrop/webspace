import Post from '../components/post/Post';
import 'highlight.js/styles/kimbie-dark.css';
import image from '../../../assets/img/rehash-transform/crowd.jpg';

const metadata = {
  'title': 'On Navigating Mind Fog',
  'keywords': 'other',
  'date': 'Jan 10, 2022',
  'image': '../../../assets/img/rehash-transform/crowd.jpg',
  'id': 1
};

const Post1 = () => {
  return (
    <Post 
      metadata={ metadata }
      image={ image }
    >
      <div dangerouslySetInnerHTML={ { __html: `<p>The purpose of this blog is intentionally unclear. I want to share thoughts, ideas, and things I create. Most of all I want to force myself to think and explore more deeply. Time will tell how this goes. At this point, everything is under construction. Nothing is clear, but all is open and free to read.</p>
<hr>
<p>I started a blog over at <a target="_blank" href="https://palmdrop.github.io" rel="noopener noreferrer" title="palmdrop.github.io - https://palmdrop.github.io">palmdrop.github.io</a> using a static website builder called <a target="_blank" href="https://gohugo.io/" rel="noopener noreferrer" title="hugo - https://gohugo.io/">hugo</a>. </p>
` } }/>
    </Post>
  );
};

export default Post1;

