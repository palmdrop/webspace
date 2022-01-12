import Post from '../components/post/Post';
import '../../../styles/highlighting/smog.scss';
import image from '../../../assets/posts/my-take-on-domain-warping/main.jpg';

const metadata = {
  'title': 'My Take on Domain Warping',
  'keywords': [
    'generative'
  ],
  'date': '2022-01-10',
  'image': '../../../assets/posts/my-take-on-domain-warping/main.jpg',
  'id': 2
};

const Post2 = () => {
  return (
    <Post 
      metadata={ metadata }
      image={ image }
    >
      <div dangerouslySetInnerHTML={ { __html: `<p>[OLD POST] Domain warping: a procedural method for generating natural-looking patterns and shapes. I&#39;ve used this technique for a long time, and the results can be beautiful and strangely organic. This post will explore my (slightly different) approach, and some of the images this approached helped produce.</p>
<hr>
<p>The traditional implementation of domain warping is introduced perfectly by Inigo Quilez in <a target="_blank" href="https://www.iquilezles.org/www/articles/warp/warp.htm" rel="noopener noreferrer" title="this - https://www.iquilezles.org/www/articles/warp/warp.htm">this</a> blog post. Here&#39;s my summary:</p>
<p>A domain is the set of all possible input alues for a particular function. When we warp a domain, each input value is mapped to some other input value, before being passed to the function. E.g, we warp the domain of <code>f(x)</code> by inserting another function <code>g(x)</code> like this: <code>f(g(x))</code>. For math heads, this is just function composition, but when this operation is performed in order to deform a 2D or 3D graphical scene or object, the term domain warping is often used instead. It&#39;s more descriptive; spatial warping is what we do.</p>
<p>I mostly work in two dimensions. <code>x</code> then becomes <code>p</code>, a two-dimensional point. <code>f(p)</code> is a function that takes a point and returns a floating-point value, and <code>g(x)</code> is a function which takes a point and returns a new, transformed point. </p>
<p>Here&#39;s a spiral pattern I made using a sawtooth wave (<code>f(p)</code>) and a warping function that rotates each input point around origo (<code>g(p)</code>).</p>
<p><img src="/img/dw/simple1.jpg" alt="spiral"></p>
<p>Possibly hypnotic. If I didn&#39;t want you to keep reading I would have made it spin as well. </p>
<p>Moving on, let&#39;s consider my implementation of domain warping. It&#39;s not that different from the traditional method, however, I strictly work with polar offsets (an angle and a distance) to transform my points, instead of defining an x and y offset separately. </p>
<p>As Inigo Quilez describes, we often only want to warp the domain with a small amount. If the point <code>p</code> is the non-warped input to a function <code>f(p)</code>, we might define our warping function like this: <code>g(p) = p + h(p)</code> where <code>h(p)</code> returns a small offset. Instead of this, I use two functions <code>A(p)</code> and <code>D(p)</code> to define an angle and a distance which I use to calculate a polar offset. We get:</p>
<pre><code class="hljs language-javascript"><span class="hljs-title function_">g</span>(p) = p + [<span class="hljs-title function_">cos</span>(<span class="hljs-title function_">A</span>(p)), <span class="hljs-title function_">sin</span>(<span class="hljs-title function_">A</span>(p))] * <span class="hljs-title function_">D</span>(p)
</code></pre>
<p>where <code>[x, y]</code> is a two-dimensional point.</p>
<p>This allows me to define different functions for <code>A(p)</code> and <code>D(p)</code>, which often produces interesting results. This method makes the x and y values of the offset fairly coherent across space and gives me a lot of control. It also makes it trivial to vary the strength of the warping effect across space (make sure <code>D(p)</code> is a low value for some areas) or control the intensity of the distortions, i.e, how detailed the warp is (by tuning the frequency of <code>A(p)</code>). </p>
<p>When working with this method, I often use simple mathematical functions in combination with noise functions (like Perlin noise). It&#39;s helpful to make sure all these functions return values between 0 and 1, to know what we are working with. To get an angle or a distance outside the range of [0,1], just multiply the result of <code>D(p)</code> and/or <code>A(p)</code>. </p>
<p>Perhaps all this will be more clear with some pseudo-code:</p>
<pre><code class="hljs language-javascript"><span class="hljs-title function_">domainWarp</span>(p, angleFunction, distFunction, maxDist) 
    angle = <span class="hljs-title function_">angleFunction</span>(p) * <span class="hljs-variable constant_">TWO_PI</span>
    distance = <span class="hljs-title function_">distFunction</span>(p) * maxDist

    offset = <span class="hljs-title function_">vec2</span>(<span class="hljs-title function_">cos</span>(angle), <span class="hljs-title function_">sin</span>(angle)) * distance

    <span class="hljs-keyword">return</span> p + offset
</code></pre>
<p>If <code>angleFunction</code> and <code>distFunction</code> only return values between 0 and 1, the angle will be between 0 and two times <em>pi</em> (radians), and the distance will be between 0 and <code>maxDist</code>. Using three different noise functions, <code>N1</code>, <code>N2</code> and <code>N3</code>, let&#39;s try this out:</p>
<pre><code class="hljs language-javascript"><span class="hljs-title function_">N1</span>(<span class="hljs-title function_">domainWarp</span>(p, <span class="hljs-variable constant_">N2</span>, <span class="hljs-variable constant_">N3</span>, maxDist))
</code></pre>
<p>We have now warped the domain of <code>N1</code> using polar offsets with a max distance of <code>maxDist</code>. </p>
<p>Here&#39;s another image produced with this method. <code>N1</code> is a sine function, <code>N2</code> is a noise function with a high frequency and <code>N3</code> is a noise function with a low frequency.</p>
<p><img src="/img/dw/simple2.jpg" alt="Domain warp 1"></p>
<p>Some areas are less intense, and in these areas, the sine wave is still apparent, but it&#39;s been transformed to a curled and folded string. Here, the waveform remains continuous because the noise functions used are fairly smooth. The curl effect is created thanks to the use of polar offsets. However, when the effect becomes more intense (<code>D(p)</code> takes on a higher value), the sine wave is transfigured -- it becomes a mess of alien-like scribbles. The overall effect is quite organic, and to me, a lot more visually engaging than plain noise.</p>
<p>Generally, the best (and most strange) results were achieved when I used a combination of noise and other mathematical functions. In a future post, I&#39;ll document some of these combinations. </p>
<p>But for now, I&#39;d like to mention two personal breakthroughs. First, I realized that you could use a function to warp its own domain. Take noise function <code>N</code>, and define a new, warped noise function as follows:</p>
<pre><code class="hljs language-javascript"><span class="hljs-title function_">NW</span>(p) = <span class="hljs-title function_">N</span>(<span class="hljs-title function_">domainWarp</span>(p, N, N, maxDist))
</code></pre>
<p>Here, <code>N</code> itself determines how much its domain should be warped (both in terms of angle and distance). A feedback effect is achieved, which made me think: why only do this for one iteration? This is the second breakthrough. Why not do this recursively?</p>
<p>So, by going another step we get:</p>
<pre><code class="hljs language-javascript"><span class="hljs-title class_">NW2</span>(p) = <span class="hljs-title function_">N</span>(<span class="hljs-title function_">domainWarp</span>(p, <span class="hljs-variable constant_">NW</span>, <span class="hljs-variable constant_">NW</span>, maxDist))
</code></pre>
<p>There are endless variations to this. You might want to use <code>NW</code> as the noise being warped for the second iteration. You might also not want to keep using <code>N</code> as the only noise source: other functions can be introduced and applied in any way you might like. </p>
<p>Here are a few more images produced with variations of this technique: </p>
<p><img src="/img/dw/recursive2.jpg" alt="recursive 2"></p>
<p>Many layers of noise and domain warping are here combined, and color is introduced.</p>
<p><img src="/img/dw/recursive3.jpg" alt="recursive 3"></p>
<p>I do not even remember what&#39;s going on here.</p>
<p><img src="/img/dw/recursive1.jpg" alt="recursive 1"></p>
<p>And these &quot;glass pearls&quot; are particularly interesting to me. No physics simulations are going on here, no light interactions. The basic pattern is just a sine function combined with some low-frequency Perlin noise. The domain of this pattern is then warped using a grid of fuzzy circles (brighter close to their centers, darker close to the edges). With a few recursions, the sine wave is rotated and scaled multiple times, and hence seem to adopt the shape of the &quot;pearls&quot;.</p>
<p>In a future post, I&#39;ll describe some more of my results. By introducing fractal noise (sometimes called fractal Brownian motion), ridged noise, and more complex function interactions, I rendered images that looked like photographs of microscopic beings or extraterrestrial terrains. </p>
<p>More soon.</p>
` } }/>
    </Post>
  );
};

export default Post2;

