import Post from '../components/post/Post';
import '../../../styles/highlighting/smog.scss';
import image from '../../../assets/posts/on-navigating-brain-fog/main.jpg';

const metadata = {
  'title': 'On Navigating Brain Fog',
  'keywords': [
    'first',
    'intro',
    'brain fog'
  ],
  'date': '2022-01-09',
  'image': '../../../assets/posts/on-navigating-brain-fog/main.jpg',
  'id': 1
};

const Post1 = () => {
  return (
    <Post 
      metadata={ metadata }
      image={ image }
    >
      <div dangerouslySetInnerHTML={ { __html: `<p>The purpose of this blog is intentionally unclear. I want to share thoughts, ideas, and things I create. Most of all, I want to force myself to think and explore more deeply. Time will tell how this goes. Everything is under construction, always.</p>
<hr>
<p>I started a blog over at <a target="_blank" href="https://palmdrop.github.io" rel="noopener noreferrer" title="palmdrop.github.io - https://palmdrop.github.io">palmdrop.github.io</a> using a static website builder called <a target="_blank" href="https://gohugo.io/" rel="noopener noreferrer" title="Hugo - https://gohugo.io/">Hugo</a>. I made a few posts explaining the techniques I employ when creating generative art. Then the blog died, and I did other things for a while. But my interest in web design, digital art, and the Internet did not falter. Eventually, I decided to build this site -- a webspace of my own, where I could upload living instances of my generative art and share whatever I found interesting.</p>
<p>And so, why not build a blog as well? I still have the desire to write. I want to force myself to formulate my thoughts. Often, I find myself stuck in brain fog if I don&#39;t. Everything is too ethereal and abstract unless I spend time structuring, writing, and developing. Maybe someone will find what I write interesting. If not, I do not mind. This space is for me.</p>
<p>My first posts will likely be copies of my old posts, ported to this site. To make sure everything works. </p>
<p>Hopefully, more will come.</p>
` } }/>
    </Post>
  );
};

export default Post1;

