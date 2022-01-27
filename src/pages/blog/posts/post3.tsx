import Post from '../components/post/Post';
import '../../../styles/highlighting/smog.scss';
import image from '../../../assets/posts/characteristics-of-modified-noise.jpg';

const metadata = {
  'title': 'Characteristics of Modified Noise',
  'keywords': [
    'genart',
    'noise',
    'perlin',
    'simplex',
    'procedural'
  ],
  'date': '2022-01-12',
  'image': '../../../assets/posts/characteristics-of-modified-noise.jpg',
  'id': 3
};

const Post3 = () => {
  return (
    <Post 
      metadata={ metadata }
      image={ image }
    >
      <div 
        className="post__content"
        dangerouslySetInnerHTML={ { __html: `<p>[OLD POST] Regular gradient noise, such as Perlin and Simplex noise, is extremely useful for procedurally generating textures, flowfields, heightmaps, etc. But a texture or heightmap created using plain noise is rarely that interesting. Often, noise is modified or used in unique, creative ways.</p>
<hr>
<p>Frankly, regular noise is boring. Not very visually pleasing. Repetitive. Not even Ken Perlin used Perlin noise without changing it in various ways. This blog post describes some of the ways I&#39;ve been altering the noise functions I work with to achieve more interesting results. In my next post, I will document how I&#39;ve used the techniques from this post and <a target="_blank" href="https://palmdrop.zone/blog/my-take-on-domain-warping" rel="noopener noreferrer" title="my previous post - https://palmdrop.zone/blog/my-take-on-domain-warping">my previous post</a> to create quite interesting generative art pieces. </p>
<p>These are the techniques I&#39;ll cover in this post, roughly in order of increasing enchantment:  </p>
<ul>
<li>Stretched noise</li>
<li>Modulo noise</li>
<li>Powered noise </li>
<li>Noise combinations</li>
<li>Ridged noise</li>
<li>Fractal noise (fractal Brownian motion)</li>
<li>Dynamic fractal noise</li>
</ul>
<blockquote>
<p>Note: I&#39;m no expert. I will not cover the mathematics of gradient noise. I&#39;m merely documenting my explorations. </p>
</blockquote>
<h3 id="setup">Setup</h3>
<p>In this post, I&#39;ll often compare 1D and 2D representations of various noise variations. Like this:</p>
<p><img src="/img/cmn/perlin-comparison.jpg" alt="1D Perlin noise"> </p>
<p>That was Perlin noise. I&#39;d like to note that I mostly use <a target="_blank" href="https://en.wikipedia.org/wiki/Simplex_noise" rel="noopener noreferrer" title="Simplex noise - https://en.wikipedia.org/wiki/Simplex_noise">Simplex noise</a> instead, to avoid the directional artifacts that emerge when the frequency of Perlin noise is increased. Simplex noise does not suffer from the same artifacts and has some additional benefits (which I will not cover here). </p>
<p>Below you&#39;ll see a comparison of high-frequency Perlin noise vs high-frequency simplex noise. A clear differenc, no? </p>
<p><img src="/img/cmn/perlin2D-high.jpg" alt="2D perlin noise with high frequency">
<img src="/img/cmn/simplex2D-high.jpg" alt="2d simplex noise with high frequency"></p>
<p>Also, unless I say otherwise, assume the output of the noise is in the range of 0.0 to 1.0.</p>
<p>Let&#39;s get into some variations. </p>
<h2 id="stretched-noise">Stretched Noise</h2>
<p>Extremely easy to achieve. Could be used as the basis of a wood or carpet texture, with some creativity. This effect is achieved by having different frequency values for the x and y directions (and z, if you&#39;re working in three dimensions). This is a type of domain warping.</p>
<p><img src="/img/cmn/simplex2D-stretched.jpg" alt="stretched simplex noise"></p>
<p>Before introducing some simple pseudo-code, let me familiarize you with my syntax. In this post, I&#39;ll heavily use lambda expressions. My syntax is the same as the <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions" rel="noopener noreferrer" title="one used in Javascript - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions">one used in Javascript</a>, i.e <code>func = (x,y) =&gt; x + y</code> defines a function <code>func</code> which takes two arguments and adds them together.</p>
<p>Moving on.</p>
<p>Suppose we have a noise function <code>N</code> which takes a two-dimensional point/vector <code>p</code> as its input. To stretch the noise, we&#39;ll scale the <code>x</code> and <code>y</code> components of <code>p</code> using two scaling values, <code>sx</code> and <code>sy</code>.</p>
<pre><code class="hljs language-javascript"><span class="hljs-variable constant_">N2</span> = <span class="hljs-function">(<span class="hljs-params">p</span>) =&gt;</span> <span class="hljs-title function_">N</span>(<span class="hljs-title function_">vec2</span>(p.<span class="hljs-property">x</span> * sx, p.<span class="hljs-property">y</span> * sy))
</code></pre>
<p>One issue with this is that you can only scale along the axes, not in an arbitrary direction. This could be solved with some additional vector math, or by rotating the entire domain with some angle. However, I&#39;ll not cover that here.</p>
<p>Instead, on to more interesting stuff.</p>
<h2 id="modulus-noise">Modulus noise</h2>
<p>Not that groundbreaking. The idea is that we apply a modulus operator to the output of the noise function. With a modulus value of 0.5, the output will effectively &quot;wrap around&quot; if it exceeds 0.5. However, the new output will be in the range of 0.0 to 0.5. Therefore, I always use a modulus value of 1.0 and increase the amplitude of the noise function to get the same effect. E.g, scale with 2.0 and wrap at 1.0, and the result will be equal to a wrap at 0.5, with the exception that the output range remains 0.0 to 1.0.</p>
<p>If we have a noise function <code>N</code> and a multiplier <code>k</code>, we might then define a new noise function like this:</p>
<pre><code class="hljs language-javascript"><span class="hljs-variable constant_">N2</span> = <span class="hljs-function">(<span class="hljs-params">p</span>) =&gt;</span> <span class="hljs-title function_">mod</span>(<span class="hljs-title function_">N</span>(p) * k, <span class="hljs-number">1.0</span>)
</code></pre>
<p>An additional benefit with this method is that if <code>k</code> is an integer value, the modified noise function will &quot;wrap around&quot; <code>k</code> times. Easy to control. </p>
<p>Here&#39;s an example:</p>
<p><img src="/img/cmn/simplex2D-modded.jpg" alt="Modded simplex noise"></p>
<p>Some of you might see the similarity to metaballs. The math is completely different, but the visual result is quite similar. </p>
<h2 id="powered-noise">Powered noise</h2>
<p>Again, quite simple -- just apply the pow operator to the noise output. As long as the noise is in the range of 0.0 and 1.0, this operation will preserve that range. If <code>f(x)</code> is a straight line with an angle of 45 degrees, one can visualize the effect as follows:</p>
<p><img src="/img/cmn/graphs.jpg" alt="Pow visualization"></p>
<p>And these are the same operations applied to noise:</p>
<p><img src="/img/cmn/simplex2D-pow-high.jpg" alt="High powered simplex noise">
<img src="/img/cmn/simplex2D-pow-low.jpg" alt="Low powered simplex noise"></p>
<p>Not that fascinating, but useful. You might want to use noise to generate random islands (say, every value above 0.5 is land, the rest is water). A bigger exponent will produce smaller islands, a smaller exponent will produce bigger islands.</p>
<p>Below is some simple pseudo-code using an exponent <code>k</code>:</p>
<pre><code class="hljs language-javascript"><span class="hljs-variable constant_">N2</span> = <span class="hljs-function">(<span class="hljs-params">p</span>) =&gt;</span> <span class="hljs-title function_">pow</span>(<span class="hljs-title function_">N</span>(p), k)
</code></pre>
<p>The more interesting results appear when you understand that <code>k</code> doesn&#39;t have to be constant -- <code>k</code> can be scaled using another noise function. The effect now varies across space.</p>
<p><img src="/img/cmn/simplex2D-pow-variable.jpg" alt="Variable powered simplex noise"></p>
<p>High-frequency noise is used as the base, low-frequency noise as the exponent scaling function. If <code>k</code> is our exponent and <code>S</code> is the scaling function, we get this pseudo code:</p>
<pre><code class="hljs language-javascript"><span class="hljs-variable constant_">N2</span> = <span class="hljs-function">(<span class="hljs-params">p</span>) =&gt;</span> <span class="hljs-title function_">pow</span>(<span class="hljs-title function_">N</span>(p), k * <span class="hljs-title function_">S</span>(p))
</code></pre>
<p>Perhaps you could use this to create a set of archipelagos.</p>
<h2 id="noise-combinations">Noise combinations</h2>
<p>The result of multiple noise functions can easily be combined using regular binary operators, such as adding, multiplying, subtracting, or dividing (although dividing might cause unpredictable output intervals and division with zero problems). </p>
<p>One simple way to combine two noise functions is to multiply the results together. This produces something similar to powered noise, but with a less organic feel. Here&#39;s low-frequency noise and high-frequency noise combined.</p>
<p><img src="/img/cmn/simplex2D-combined.jpg" alt="Combined simplex noise"></p>
<p>If we have two noise functions <code>N1</code> and <code>N2</code> they can be combined as follows:</p>
<pre><code class="hljs language-javascript"><span class="hljs-variable constant_">N3</span> = <span class="hljs-function">(<span class="hljs-params">p</span>) =&gt;</span> <span class="hljs-title function_">N1</span>(p) * <span class="hljs-title function_">N2</span>(p)
</code></pre>
<p>Adding or subtracting could be done as well. When adding multiple noise functions together, while changing the amplitude and frequency, one gets something called fractal noise. More on that later.</p>
<h2 id="ridged-noise">Ridged noise</h2>
<p>Ridged noise is often used to create mountainous terrain (especially when combined with fractal noise). One creates ridged noise by &quot;inverting&quot; all noise values that exceeds some threshold. However, we invert around said threshold. Not clear? This means that as soon as the slope reaches a certain point, it&#39;s forced to immediately start going down again, which causes a sharp spike. This will become more clear when you read the pseudo-code.</p>
<p>Here&#39;s 1D ridged noise, which should communicate the idea: </p>
<p><img src="/img/cmn/simplex1D-ridged.jpg" alt="1D ridged simplex noise"></p>
<p>While regular noise might be useful for generating smooth hills, this type of noise is more suited for generating mountainous terrain (or generally sharp textures). </p>
<p>How to calculate a ridged noise value? Say <code>t</code> is our threshold and <code>n</code> is the value we&#39;d like to apply the operation to. Then, if <code>n &gt; t</code> we calculate how much <code>n</code> exceeds <code>t</code> with, i.e <code>n - t</code>. We then subtract this value from the threshold. The resulting expression becomes <code>t - (n - t)</code> (which of course could be simplified, but I prefer it this way since it clearly communicates the idea). </p>
<p>This only works if <code>t</code> is no less than 0.5 (for noise functions returning values between 0.0 and 1.0). If <code>t</code> is smaller, the operation might return a negative value. My solution to this is to simply invert negative values. This might still cause issues if <code>t</code> is even smaller: by negating the result, the new value could once again be greater than <code>t</code>. If that case, the operation could be applied continuously until the result is in the range of 0.0 and <code>t</code>.</p>
<p>This is my solution in pseudo code, using a noise function <code>N</code> and a threshold <code>t</code>:</p>
<pre><code class="hljs language-javascript"><span class="hljs-variable constant_">N2</span> = <span class="hljs-function">(<span class="hljs-params">p</span>) =&gt;</span> 
    n = <span class="hljs-title function_">N</span>(p)
    <span class="hljs-keyword">while</span> n &gt; t
          n = t - (n - t)
          <span class="hljs-keyword">if</span> n &lt; <span class="hljs-number">0</span>
            n = -n
    <span class="hljs-keyword">return</span> n / t
</code></pre>
<p>The last division makes sure the return value is in the range of 0.0 and 1.0. </p>
<p>However, I recommend constraining <code>t</code> to a range of 0.5 to 1.0, to prevent strange visual effects with downwards spikes as well as upwards (unless this is what you want).</p>
<p>Anyway, here&#39;s 2D ridged simplex noise. </p>
<p><img src="/img/cmn/simplex2D-ridged-high.jpg" alt="2D ridged simplex noise"></p>
<p>Ridged noise can also be combined with powered noise, to amplify the &quot;ridges&quot;. Here are two examples:</p>
<p><img src="/img/cmn/simplex2D-ridged-pow.jpg" alt="2D ridged simplex noise">
<img src="/img/cmn/simplex2D-ridged-pow2.jpg" alt="2D ridged simplex noise"></p>
<h2 id="frequency-modulation">Frequency modulation</h2>
<p>This is a type of domain warping. Normally, the frequency of a noise function is constant, but here, a second function scales the frequency differently depending on the position. </p>
<p>Consider a noise function <code>N</code> and a scaling function <code>S</code>. We get</p>
<pre><code class="hljs language-javascript"><span class="hljs-variable constant_">N2</span> = <span class="hljs-function">(<span class="hljs-params">p</span>) =&gt;</span> <span class="hljs-title function_">N</span>(p * <span class="hljs-title function_">S</span>(p))
</code></pre>
<p>One thing to note about this is that positions far away from origo will be affected more than positions closer to the origo. E.g, if <code>p</code> is at a distance of 2.0 from origo, multiplying by 3.0 will translate it to a distance of 6.0 from origo. However, if <code>p</code> is at a distance of 10.0 from origo, multiplying with 3.0 will translate to a distance of 30.0. A change of 4.0 versus 20.0 units. The effect is hence more acute farther from origo. </p>
<p><img src="/img/cmn/simplex2D-frequency-mod.jpg" alt="2D frequency modulated simplex noise"></p>
<p>Frequency modulation is a bit hard to work with since the effect is different depending on the distance from origo. But I&#39;ve successfully used it in the past, to a limited extent. <a target="_blank" href="https://www.instagram.com/p/CApnNi9n0nF/" rel="noopener noreferrer" title="This old Instagram post - https://www.instagram.com/p/CApnNi9n0nF/">This old Instagram post</a> uses this technique (here, origo is in the center of the image).</p>
<h2 id="fractal-noise-fractal-brownian-motion">Fractal noise (fractal Brownian motion)</h2>
<p>Once again, Inigo Quilez has a great <a target="_blank" href="https://www.iquilezles.org/www/articles/fbm/fbm.htm" rel="noopener noreferrer" title="blog post - https://www.iquilezles.org/www/articles/fbm/fbm.htm">blog post</a> on the subject, which goes into a lot more detail than I will. I recommend reading it.</p>
<p>Just let me summarize: Fractal noise is many layers of noise, or octaves, added together. For each octave, the frequency is typically increased and the amplitude decreased. This way, each subsequent octave has less influence over the overall output but provides more fine detail. </p>
<p>The &quot;lacunarity&quot; of fractal noise is the frequency multiplier. For each new octave, we multiply the base frequency with this value. The &quot;persistence&quot; is the same thing, but for amplitude. </p>
<p>Say we have a list of noise functions <code>LN</code>, a base frequency of <code>f</code>, a lacunarity of <code>L</code> and a persistance of <code>P</code>, this is how I typically create fractal noise:</p>
<pre><code class="hljs language-javascript"><span class="hljs-variable constant_">N2</span> = <span class="hljs-function">(<span class="hljs-params">p</span>) =&gt;</span>
    sum = <span class="hljs-number">0.0</span>
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> [<span class="hljs-number">0.</span>.. (<span class="hljs-variable constant_">LN</span>.<span class="hljs-property">length</span> - <span class="hljs-number">1</span>)] 
        N = <span class="hljs-variable constant_">LN</span>[i]
        frequency = f * <span class="hljs-title function_">pow</span>(L, i)
        amplitude = <span class="hljs-number">1.0</span> * <span class="hljs-title function_">pow</span>(P, i)
        sum += <span class="hljs-title function_">N</span>(p * frequency) * amplitude
    <span class="hljs-keyword">return</span> sum
</code></pre>
<p>Here, we iterate over the indices of <code>LN</code> and retrieve each noise function. Then we calculate the frequency and amplitude of the current octave. E.g, if <code>L = 2.0</code>, the first iteration we get <code>frequency = f * 2.0^0 = f * 1.0</code>, the second we get <code>frequency = f * 2.0^1.0 = f * 2.0</code>, the third we get <code>frequency = f * 2.0^2 = f * 4.0</code> and so on. A common value for <code>L</code> is 2.0 and a common value for <code>P</code> is 0.5. That means that for each iteration, the frequency doubles, and the amplitude is halved. This ensures that the details are increased while the influence over the general shape is reduced. Here are some examples in 1D and 2D:</p>
<p><img src="/img/cmn/fractal-noise1D.jpg" alt="1D fractal noise">
<img src="/img/cmn/fractal-noise2D.jpg" alt="2D fractal noise"></p>
<p>The first one already is a lot more mountain-like than regular noise. However, we can combine fractal noise with ridged noise to amplify the effect. Simply use the same method as the one described above, but let <code>LN</code> be a list of ridged noise functions. </p>
<p><img src="/img/cmn/ridged-fractal-noise1D.jpg" alt="1D ridged fractal noise">
<img src="/img/cmn/ridged-fractal-noise2D.jpg" alt="2D ridged fractal noise"></p>
<p>The 2D example doesn&#39;t look very mountain-like, but when rendered in 3D one can embody the true mountain essence. I once again urge you to read <a target="_blank" href="https://www.iquilezles.org/www/articles/fbm/fbm.htm" rel="noopener noreferrer" title="Inigo Quilez post - https://www.iquilezles.org/www/articles/fbm/fbm.htm">Inigo Quilez post</a>.</p>
<p>An additional note: a side effect of combining noise functions in this way is that the return values no longer will be in the range of 0 to 1.0. I often calculate the maximum value possible and divide by this to normalize the results. </p>
<p>In my next post, I&#39;ll go through some exciting results I&#39;ve achieved when combining fractal noise and domain warping. </p>
<h2 id="dynamic-fractal-noise">Dynamic fractal noise</h2>
<p>This is a variation on regular fractal noise. Perhaps there is a name for this already. The idea is that the lacunarity and persistence don&#39;t have to be the same everywhere. With regular fractal noise, the level of detail is constant, which will make the terrain equally rough in all places. But if we vary the persistence, some areas would be more smooth and others rougher. The lacunarity could also be varied, however, this creates almost the same effect as frequency modulation (essentially, you create layers of frequency-modulated noise).</p>
<p>Let&#39;s take the same code as with regular fractal noise, but introduce a scaling noise <code>S</code> which will be used to vary the persistence. We get</p>
<pre><code class="hljs language-javascript"><span class="hljs-variable constant_">N2</span> = <span class="hljs-function">(<span class="hljs-params">p</span>) =&gt;</span>
    sum = <span class="hljs-number">0.0</span>
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> [<span class="hljs-number">0</span> ... <span class="hljs-variable constant_">LN</span>.<span class="hljs-property">length</span>] 
        N = <span class="hljs-variable constant_">LN</span>[i]
        frequency = f * <span class="hljs-title function_">pow</span>(L, i)
        amplitude = <span class="hljs-number">1.0</span> * <span class="hljs-title function_">pow</span>(P * <span class="hljs-title function_">S</span>(p), i)
        sum += <span class="hljs-title function_">N</span>(p * frequency) * amplitude
    <span class="hljs-keyword">return</span> sum
</code></pre>
<p>The only difference is the line that calculates the amplitude. One thing worth noting is that the areas with less detail will often have lower general amplitude since the amplitude of all octaves is scaled equally. It&#39;s of course also possible to have different scaling functions for different octaves.</p>
<p>Anyway, here&#39;s 1D dynamic fractal noise. Note that the lower area is a lot smoother than the peaks. This is also clearly visible in the 2D representation.</p>
<p><img src="/img/cmn/dynamic-fractal-noise1D.jpg" alt="1D dynamic fractal noise">
<img src="/img/cmn/dynamic-fractal-noise2D.jpg" alt="2D dynamic fractal noise"></p>
<p>Using all these techniques, combined with domain warping, I&#39;ve managed to create extremely interesting shapes and textures. I&#39;ll make a complete post detailing some of these configurations and the output they produced soon. Until then, here&#39;s one of my favorites:</p>
<p><img src="/img/cmn/showcase.jpg" alt="Bridge"></p>
<p>Stay safe.</p>
` } }
      />
    </Post>
  );
};

export default Post3;

