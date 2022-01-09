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
<p>I started a blog over at <a target="_blank" href="https://palmdrop.github.io" rel="noopener noreferrer" title="palmdrop.github.io - https://palmdrop.github.io">palmdrop.github.io</a> using a static website builder called <a target="_blank" href="https://gohugo.io/" rel="noopener noreferrer" title="hugo - https://gohugo.io/">hugo</a>. I made a few posts about some of the techniques I used when creating generative art. Then the blog died. I did other things for a while. But my interest for web design, digital art, and the Internet in general did not falter. After a while I wanted to build this page -- a page of my own, controlled by me, on my own domain, built by me.</p>
<p>And why not build a blog as well? I still wanted to write. I want to force myself to formulate my thoughts. I often find myself stuck in mind fog if I don&#39;t. Everything is too ethereal and abstract unless I actually spend time structuring, writing, developing. Maybe, hopefully, someone will find what I write interesting. If not, I do not mind. This is mostly for me.</p>
<p>My first posts will likely just be my old posts, ported to this page, to make sure everything works. </p>
<p>Hopefully, more will come.</p>
` } }/>
    </Post>
  );
};

export default Post1;

