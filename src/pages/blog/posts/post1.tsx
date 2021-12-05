import Post from '../components/post/Post';
import 'highlight.js/styles/kimbie-dark.css';
import image from '../../../assets/img/rehash-transform/crowd.jpg';

const metadata = {
  'title': 'Test post',
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
      <div dangerouslySetInnerHTML={ { __html: `<p>With some content</p>
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

