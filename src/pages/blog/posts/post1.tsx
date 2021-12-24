import Post from '../components/post/Post';
import 'highlight.js/styles/kimbie-dark.css';
import image from '../../../assets/img/rehash-transform/crowd.jpg';

const metadata = {
  'title': 'Test post with a long and convoluted title',
  'keywords': 'art, c2, c3',
  'date': 'Nov 21, 2021',
  'image': '../../../assets/img/rehash-transform/crowd.jpg',
  'id': 1
};

const Post1 = () => {
  return (
    <Post 
      metadata={ metadata }
      image={ image }
    >
      <div dangerouslySetInnerHTML={ { __html: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
<hr>
<ul>
<li>item</li>
<li>item</li>
<li>item</li>
</ul>
<p><a href="palmdrop.zone">a link</a></p>
<div>
  <h1>
    Some html
  </h1>

  <p>
    And some text
  </p>
</div>` } }/>
    </Post>
  );
};

export default Post1;

