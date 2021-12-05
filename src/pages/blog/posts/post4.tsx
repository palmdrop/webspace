import Post from '../components/post/Post';
import "highlight.js/styles/kimbie-dark.css";

const metadata = {
  "title": "Test post 4",
  "keywords": "other, c5",
  "date": "Nov 26, 2021",
  "id": 4
};

const Post4 = () => {
  return (
    <Post metadata={ metadata }>
      <div dangerouslySetInnerHTML={ { __html: `<h1 id="test-post-4">TEST POST 4</h1>
<p>With some content</p>
<ul>
<li>item</li>
<li>item</li>
<li>item</li>
</ul>
<pre><code class="hljs language-jsx">
<span class="hljs-keyword">const</span> <span class="hljs-title function_">test</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">return</span> {
    <span class="hljs-attr">a</span>: <span class="hljs-number">10</span>,
    <span class="hljs-attr">b</span>: <span class="hljs-string">&#x27;test&#x27;</span>
  }
}
</code></pre>
` } }/>
    </Post>
  )
}

export default Post4;

