
import Post from '../posts';
import 'highlight.js/styles/kimbie-dark.css';

const metadata = {
  'title': 'Test post',
  'date': 'Nov 21, 2021',
  'id': 1
};

const Post1 = () => {
  return (
    <Post metadata={ metadata }>
      <div dangerouslySetInnerHTML={ { __html: `<h1 id="test-post">TEST POST</h1>
<p>With some content</p>
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

