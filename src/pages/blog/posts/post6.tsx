import Post from '../components/post/Post';
import '../../../styles/highlighting/smog.scss';
import image from '../../../assets/posts/alien-patterns.jpg';

const metadata = {
  'title': 'Alien Patterns',
  'keywords': [
    'genart',
    'noise',
    'perlin',
    'simplex',
    'procedural',
    'patterns'
  ],
  'date': '2022-01-13',
  'image': '../../../assets/posts/alien-patterns.jpg',
  'id': 6
};

const Post6 = () => {
  return (
    <Post 
      metadata={ metadata }
      image={ image }
    >
      <div 
        className="post__content"
        dangerouslySetInnerHTML={ { __html: `<p>[OLD POST] Combining domain warping and modified noise functions can produce extremely detailed and varied alien-like textures and shapes. This post is a peek into how I&#39;ve been using these techniques to create pieces of generative art.</p>
<hr>
<p>In this post, I will shed light on my general process, and showcase some of the pieces I&#39;ve created. Domain warping and modified noise have been prominent tools of mine for a long while now, and I&#39;ve developed a little experimental library with loads of components that I routinely use in my generative works. Most of these components can be found in <a target="_blank" href="https://github.com/palmdrop/sandbox" rel="noopener noreferrer" title="this - https://github.com/palmdrop/sandbox">this</a> repository. The repository, however, is mostly my generative playground and might not e that easy to navigate. I wish you all the luck. I&#39;ll try to link to the appropriate files and packages whenever possible.</p>
<p>Before moving on, please read <a target="_blank" href="https://palmdrop.site/blog/my-take-on-domain-warping" rel="noopener noreferrer" title="my post about domain warping - https://palmdrop.site/blog/my-take-on-domain-warping">my post about domain warping</a> and <a target="_blank" href="https://palmdrop.site/blog/characteristics-of-modified-noise" rel="noopener noreferrer" title="my post about modified noise - https://palmdrop.site/blog/characteristics-of-modified-noise">my post about modified noise</a>. This post heavily builds on the techniques described there.</p>
<p>Below are a few sample images, produced using the process I will describe:</p>
<p><img src="/img/alien/valleys4.jpg" alt="Example 1"></p>
<p><img src="/img/alien/neon5.jpg" alt="Example 2"></p>
<p><img src="/img/alien/brain5.jpg" alt="Example 3"></p>
<p>More samples can be found in the <a target="_blank" href="https://github.com/palmdrop/sandbox/tree/main/output" rel="noopener noreferrer" title="repository - https://github.com/palmdrop/sandbox/tree/main/output">repository</a> or on <a target="_blank" href="https://www.instagram.com/palmdrop/" rel="noopener noreferrer" title="my instagram - https://www.instagram.com/palmdrop/">my instagram</a>.</p>
<p>In this post, I&#39;ll cover the following topics:</p>
<ul>
<li>General process</li>
<li>Texture pieces</li>
<li>Alien shapes</li>
<li>Adding color</li>
</ul>
<p>&quot;General process&quot; will detail the steps I go through when creating images like those above. &quot;Texture pieces&quot; will describe a few specific designs, that I call &quot;patterns&quot;. &quot;Alien shapes&quot; will introduce warped shapes which can be used to mask certain parts of the texture. Finally, I&#39;ll briefly discuss one method for adding color.</p>
<p>In the pseudo-code for this post, I&#39;ll be using a set of functions that are based on my previous posts. In those posts, I mostly dealt with noise functions, however, in this post I will abstract this to any function which takes a two-dimensional point as input and returns a floating-point value between 0.0 and 1.0. Such a function could be referred to as a &quot;heightmap&quot;. </p>
<p>These are the function&#39;s I&#39;ll be using:</p>
<pre><code class="hljs language-javascript"><span class="hljs-title function_">pow</span>(heightmap, exponent)
</code></pre>
<p>See &quot;Powered noise&quot; in <a target="_blank" href="https://palmdrop.site/blog/characteristics-of-modified-noise" rel="noopener noreferrer" title="my previous post - https://palmdrop.site/blog/characteristics-of-modified-noise">my previous post</a>.</p>
<pre><code class="hljs language-javascript"><span class="hljs-title function_">add</span>(heightmap1, heightmap2)
</code></pre>
<p>and</p>
<pre><code class="hljs language-javascript"><span class="hljs-title function_">mult</span>(heightmap1, heightmap2)
</code></pre>
<p>See &quot;Noise combinations&quot;.</p>
<pre><code class="hljs language-javascript"><span class="hljs-title function_">ridge</span>(heightmap, threshold)
</code></pre>
<p>See &quot;Ridged noise&quot;.</p>
<pre><code class="hljs language-javascript"><span class="hljs-title function_">fractal</span>(heightmapList, frequency, lacunarity, persistance)
</code></pre>
<p>See &quot;Fractal noise&quot;.</p>
<pre><code class="hljs language-javascript"><span class="hljs-title function_">dynamicFractal</span>(heightmapList, frequency, lacunarity, persistence, scalingHeightmap)
</code></pre>
<p>I will also assume the existence of a function</p>
<pre><code class="hljs language-javascript"><span class="hljs-title function_">getNoise</span>()
</code></pre>
<p>which returns a new noise function (with a unique seed) every time it&#39;s called. In all examples, this noise will be simplex noise.</p>
<p>I will also be using a <code>warp</code> function which uses the <code>domainWarp</code> function from <a target="_blank" href="https://palmdrop.site/blog/my-take-on-domain-warping" rel="noopener noreferrer" title="my post about domain warping - https://palmdrop.site/blog/my-take-on-domain-warping">my post about domain warping</a>. This function will take a heightmap, warp its domain, and return the new, warped heightmap.</p>
<pre><code class="hljs language-javascript"><span class="hljs-title function_">warp</span>(source, angleFunction, distFunction, maxDist)
    <span class="hljs-keyword">return</span> <span class="hljs-function">(<span class="hljs-params">p</span>) =&gt;</span> 
        <span class="hljs-title function_">source</span>(<span class="hljs-title function_">domainWarp</span>(p, angleFunction, distFunction, maxDist))
</code></pre>
<h2 id="general-process">General process</h2>
<p>The goal of my process is often to achieve a high degree of complexity and variation. To do this, it&#39;s vital to create a sufficiently interesting <code>base pattern</code>, or <code>base</code>. This is what the entire texture will build on.</p>
<p>The <code>base</code> is created using a combination of noise functions, domain-warped noise, and/or <a target="_blank" href="https://github.com/palmdrop/sandbox/blob/main/src/sampling/heightMap/modified/FractalHeightMap.java" rel="noopener noreferrer" title="fractal noise - https://github.com/palmdrop/sandbox/blob/main/src/sampling/heightMap/modified/FractalHeightMap.java">fractal noise</a> (sometimes <a target="_blank" href="https://github.com/palmdrop/sandbox/blob/main/src/sampling/heightMap/modified/DynamicFractalHeightMap.java" rel="noopener noreferrer" title="&quot;dynamic fractal noise&quot; - https://github.com/palmdrop/sandbox/blob/main/src/sampling/heightMap/modified/DynamicFractalHeightMap.java">&quot;dynamic fractal noise&quot;</a>). </p>
<p>Sometimes, the <code>base</code> is warped further using another noise function, a set of shapes, and so on. The result of this is the <code>texture</code>. The <code>texture</code> and the <code>base</code> are sometimes the same. Do not think about that too much.</p>
<p>Afterward, recursive domain warping is applied to the <code>texture</code>. Often, the <code>texture</code> is used to warp itself for 1 to 3 iterations. There are endless variations on how this can be done.</p>
<p>The result of this often produces an interesting black-and-white texture. Color will be discussed in the final part of this post.</p>
<p>All of this will hopefully become more clear when I get into the next section.</p>
<h2 id="texture-pieces">Texture Pieces</h2>
<p>For the sake of example, and because it tends to produce interesting pieces, the textures I&#39;ll go all feature prominent use of ridged noise. Let&#39;s start with the &quot;Fabric texture&quot;.</p>
<h3 id="fabric-pattern">Fabric Pattern</h3>
<p><img src="/img/alien/surface2.jpg" alt="Fabric pattern"></p>
<p>Although not exactly like fabric, this pattern tears in an organic way when zoomed in. This is how it&#39;s made:</p>
<p>The <code>base</code> is fractal noise based on powered ridged noise. This can be created using a function that returns a new modified noise function each time you call it, like this:</p>
<pre><code class="hljs language-javascript"><span class="hljs-variable constant_">RN</span> = <span class="hljs-function">() =&gt;</span> 
    R = <span class="hljs-title function_">ridge</span>(<span class="hljs-title function_">getNoise</span>(), <span class="hljs-number">0.3</span>)
    <span class="hljs-keyword">return</span> <span class="hljs-title function_">pow</span>(R, <span class="hljs-number">0.2</span>)
</code></pre>
<p>This produces ridged noise with amplified ridges. Use the function to create a list <code>LN</code> with nine elements of powered ridged noise. These elements can then be combined using the <code>fractal</code> function described above:</p>
<pre><code class="hljs language-javascript">base = <span class="hljs-title function_">fractal</span>(<span class="hljs-variable constant_">LN</span>, <span class="hljs-number">0.005</span>, <span class="hljs-number">1.8</span>, <span class="hljs-number">0.5</span>)
</code></pre>
<p>This is the result:</p>
<p><img src="/img/alien/fabric-base.jpg" alt="Fabric pattern base"></p>
<p>Next, recursive domain warping is applied. Each iteration, the domain warp is applied to the <code>base</code>, and the result is stored in the <code>texture</code> variable. The <code>iterations</code> variable controls the number of iterations. This is my implementation:</p>
<pre><code class="hljs language-javascript"><span class="hljs-title function_">recursiveWarp</span>(base, iterations)
    texture = base

    <span class="hljs-keyword">for</span>(i <span class="hljs-keyword">in</span> [<span class="hljs-number">0</span>, ...(iterations - <span class="hljs-number">1</span>)])
        texture = <span class="hljs-title function_">warp</span>(base, texture, texture, <span class="hljs-number">50</span>)

    <span class="hljs-keyword">return</span> texture
</code></pre>
<p><code>texture</code> is drawn to the screen. This is done by translating each pixel to a two-dimensional point, which is used as input to <code>texture</code>. The return value, a value between 0.0 and 1.0, is then translated to a greyscale color. </p>
<p>This is one iteration:</p>
<p><img src="/img/alien/fabric-one-iteration.jpg" alt="Fabric one iteration"></p>
<p>And this is two iterations, with increased warp amount (maxDist):</p>
<p><img src="/img/alien/fabric-two-iterations.jpg" alt="Fabric two iterations"></p>
<p>The banner image of this section uses three iterations. Of course, there are endless variations to this. If you want to see my implementation, <a target="_blank" href="https://github.com/palmdrop/sandbox/blob/main/src/sampling/patterns/FabricSurfacePattern.java" rel="noopener noreferrer" title="here&#39;s a link - https://github.com/palmdrop/sandbox/blob/main/src/sampling/patterns/FabricSurfacePattern.java">here&#39;s a link</a>. </p>
<h3 id="navel-pattern">Navel Pattern</h3>
<p><img src="/img/alien/valleys1.jpg" alt="Navel pattern"></p>
<p>The implementation of this pattern is quite similar to the previous one. It&#39;s also based on a list of ridge noise functions, <code>LN</code>, created using the function <code>RN</code>, described previously. However, we also create a scaling heightmap called <code>controller</code> using <code>RN</code>, i.e </p>
<pre><code class="hljs language-javascript">controller = <span class="hljs-title function_">RN</span>()
</code></pre>
<p>Then, a dynamic fractal heightmap is created (instead of a regular fractal one):</p>
<pre><code class="hljs language-javascript">base = <span class="hljs-title function_">dynamicFractal</span>(<span class="hljs-variable constant_">LN</span>, <span class="hljs-number">0.005</span>, <span class="hljs-number">1.8</span>, <span class="hljs-number">0.5</span>, controller)
</code></pre>
<p>The <code>controller</code> varies the persistence of each octave. The resulting <code>base</code> looks like this:</p>
<p><img src="/img/alien/navel-base.jpg" alt="Navel base"></p>
<p>Then, the domain is warped recursively in the same way as the previous pattern:</p>
<pre><code class="hljs language-javascript">texture = <span class="hljs-title function_">recursiveWarp</span>(base, iterations)
</code></pre>
<p>This is one iteration:</p>
<p><img src="/img/alien/navel-one-iteration.jpg" alt="Navel one iteration"></p>
<p>And this is a variation with higher frequency and two iterations: </p>
<p><img src="/img/alien/navel-two-iterations.jpg" alt="Navel two iterations"></p>
<p>Once again, the banner image for this section used three iterations. Three iterations seem to be the sweet spot. A great deal of detail is achieved while preserving structure. </p>
<p>This pattern has an interesting variation. By &quot;inverting&quot; the return value of the <code>controller</code>, we get more detail at the thin black lines instead of the brighter areas.</p>
<pre><code class="hljs language-javascript">controller = <span class="hljs-function">(<span class="hljs-params">p</span>) =&gt;</span>
    N = <span class="hljs-title function_">RN</span>()
    <span class="hljs-keyword">return</span> <span class="hljs-number">1</span> - <span class="hljs-title function_">N</span>(p)
</code></pre>
<p>Using this setup, I created this piece:</p>
<p><img src="/img/alien/valleys3.jpg" alt="Inverted navel piece"></p>
<p>The code for the navel pattern can be found <a target="_blank" href="https://github.com/palmdrop/sandbox/blob/main/src/sampling/patterns/NavelFabricPattern.java" rel="noopener noreferrer" title="here - https://github.com/palmdrop/sandbox/blob/main/src/sampling/patterns/NavelFabricPattern.java">here</a>, and the variation described above can be found <a target="_blank" href="https://github.com/palmdrop/sandbox/blob/main/src/sampling/patterns/WakePattern.java" rel="noopener noreferrer" title="here - https://github.com/palmdrop/sandbox/blob/main/src/sampling/patterns/WakePattern.java">here</a>.</p>
<h3 id="spire-pattern">Spire pattern</h3>
<p><img src="/img/alien/neon2.jpg" alt="Spire pattern"></p>
<p>Again, this pattern builds on the previous one. I do love ridged fractal noise, it provides the perfect foundation for highly varied patterns. In the piece above, I added color using the technique which will be discussed in the last section of this post.</p>
<p>Once more, <code>RN</code> is used to create a <code>controller</code> and a list of eight modified ridged noise functions. These are then combined to create the <code>base</code>, like so:</p>
<pre><code class="hljs language-javascript">base = <span class="hljs-title function_">dynamicFractal</span>(<span class="hljs-variable constant_">LN</span>, <span class="hljs-number">0.003</span>, <span class="hljs-number">2.0</span>, <span class="hljs-number">1.0</span>, controller)
</code></pre>
<p>The slightly altered frequency, lacunarity, and persistence create this:</p>
<p><img src="/img/alien/spire-base.jpg" alt="Spire base"></p>
<p>This <code>base</code> has a lot more fine detail than the previous ones, and the amount of detail varies a lot in different areas. This gives the resulting pattern a great variety of texture characteristics. </p>
<p>Like before, the next step is domain warping. For this pattern, one iteration is usually enough, since we already have a lot of detail. I apply the domain warping slightly differently, which is what gives this pattern a different character than the navel pattern. Instead of letting <code>texture</code> control both the rotation and the amount, only the rotation is varied, while the amount is constant. </p>
<pre><code class="hljs language-javascript">texture = <span class="hljs-title function_">warp</span>(base, base, <span class="hljs-function">(<span class="hljs-params">p</span>) =&gt;</span> <span class="hljs-number">1.0</span>, <span class="hljs-number">100</span>)
</code></pre>
<p>where <code>(p) =&gt; 1.0</code> is a function that takes a point and always returns 1.0. </p>
<p><img src="/img/alien/spire-one-iteration.jpg" alt="Spire one iteration"></p>
<p>The fascinating part about this pattern is the long &quot;spires&quot;, i.e the long sharp lines. However, the result also has a lot of different textures baked in. Take the banner image of this section. You get strange, smooth bulbs:</p>
<p><img src="/img/alien/spire-zoom1.jpg" alt="Spire zoom 1"></p>
<p>You get the curled warp of &quot;typical&quot; domain warping:</p>
<p><img src="/img/alien/spire-zoom2.jpg" alt="Spire zoom 2"></p>
<p>And you get these long, sharp spires that spear the overall pattern:</p>
<p><img src="/img/alien/spire-zoom3.jpg" alt="Spire zoom 3"></p>
<p>Of course, it&#39;s also possible to do multiple iterations of domain warping with this pattern as well, but we might produce a lot of chaos. Just for show, this is the spire pattern with two iterations and an increased amount of warping:</p>
<p><img src="/img/alien/spire-two-iterations.jpg" alt="Spire two iterations"></p>
<p>Like the surface of some planet.</p>
<hr>
<p>These were only a few patterns, all using ridged noise. With other noise functions and other ways of modifying noise, there are of course endless variations to this. Some of which I&#39;ve explored in the past. Many of which I will never find time for.</p>
<h2 id="alien-shapes">Alien shapes</h2>
<p><img src="/img/alien/o6.jpg" alt="Circle"></p>
<p>Domain warping can also be used to produce interesting shapes, that in turn can be used to confine the patterns described above to a specific area. I&#39;ll demonstrate with a simple circle function:</p>
<p><img src="/img/alien/circle.jpg" alt="Circle"></p>
<p>Let&#39;s use one of the previously described patterns to warp the domain of this circle function. This will produce a distorted shape which can then be used to mask a specific part of a pattern. </p>
<p><img src="/img/alien/warped-circle.jpg" alt="Warped circle"></p>
<p>However, the sharp edges produce an unnatural result. I prefer to use a circle function with faded edges instead. Something like this:</p>
<p><img src="/img/alien/faded-circle.jpg" alt="Faded circle"></p>
<p>which produces the following effect when warped using the <code>base</code> of the previously describe spire pattern:</p>
<p><img src="/img/alien/warped-faded-circle.jpg" alt="Warped faded circle"></p>
<p>This is already quite interesting. However, this can be improved further. Take a <code>base</code> pattern and warp the circle shape using it. The warped circle will now blend well together with that base pattern and can be used to confine the final pattern to the area of the shape. </p>
<p>say we have a base pattern <code>P</code>, for example, the base of the spire pattern. We also have a blurred circle function <code>C</code>. We now create a warped circle function, <code>S</code>:</p>
<pre><code class="hljs language-javascript">S = <span class="hljs-title function_">domainWarp</span>(C, P, <span class="hljs-function">(<span class="hljs-params">p</span>) =&gt;</span> <span class="hljs-number">1.0</span>, <span class="hljs-number">50</span>)
</code></pre>
<p>We then combine <code>S</code> with our general base pattern <code>P</code> to mask this area:</p>
<pre><code class="hljs language-javascript">base = <span class="hljs-title function_">mult</span>(S, P)
</code></pre>
<p>Using this as <code>base</code>, we perform the same process as described under &quot;General process&quot;, i.e we distort the base using recursive domain warping. This is a possible result:</p>
<p><img src="/img/alien/warped-faded-circle-two-iterations.jpg" alt="Warped faded circle, two iterations"></p>
<p>An alien hairball. Very cool. I used this technique, with some variations, to produce a series of pieces called &quot;digital objects&quot; or just &quot;objects.&quot; <a target="_blank" href="https://www.instagram.com/p/CF2F_l4HlYu/?utm_source=ig_web_copy_link" rel="noopener noreferrer" title="This - https://www.instagram.com/p/CF2F_l4HlYu/?utm_source=ig_web_copy_link">This</a>, <a target="_blank" href="https://www.instagram.com/p/CF84oDLnxFb/?utm_source=ig_web_copy_link" rel="noopener noreferrer" title="this - https://www.instagram.com/p/CF84oDLnxFb/?utm_source=ig_web_copy_link">this</a> and <a target="_blank" href="https://www.instagram.com/p/CF9eVrJHlQZ/?utm_source=ig_web_copy_link" rel="noopener noreferrer" title="this - https://www.instagram.com/p/CF9eVrJHlQZ/?utm_source=ig_web_copy_link">this</a> are a few examples. </p>
<h2 id="adding-color">Adding color</h2>
<p>Most often, I work in <a target="_blank" href="https://en.wikipedia.org/wiki/HSL_and_HSV" rel="noopener noreferrer" title="HSV space - https://en.wikipedia.org/wiki/HSL_and_HSV">HSV space</a>, which means that I have one channel for controlling hue (the color nuance), one channel for controlling saturation (the richness of the color), and one channel for controlling brightness (which should be self-explanatory). </p>
<p>Imagine having an <code>HSV</code> function that takes three floating-point values, one for hue, one for saturation, and one for brightness, and converts them to an RGB value which can be displayed on the screen. We&#39;ll use three different functions to vary the value of H, S, and V across space: using <code>H</code>, <code>S</code> and <code>V</code> (functions that take a point and returns a value between 0.0 and 1.0) we create a coloring function <code>C</code>:</p>
<pre><code class="hljs language-javascript">C = <span class="hljs-function">(<span class="hljs-params">p</span>) =&gt;</span> 
    <span class="hljs-title function_">HSV</span>(<span class="hljs-title function_">H</span>(p), <span class="hljs-title function_">S</span>(p), <span class="hljs-title function_">V</span>(p))
</code></pre>
<p>Often, brightness, or <code>V</code>, controls most of the general look of the resulting pattern. <code>S</code> can influence the richness of an area, but changes in saturation are not as apparent as changes in brightness. <code>H</code> can really affect the character of the piece.</p>
<p>We now want to apply color to a pattern <code>P</code>. I often let <code>V = P</code>, since this will influence the piece the most. For the sake of simplicity, let <code>S</code> be constant: <code>S = (p) =&gt; 1.0</code>. Now, say we want the hue to be different for different areas of the image. One solution is to let <code>H</code> be some low-frequency noise. However, if <code>H</code> is not somehow related to <code>P</code>, the hue will seem disconnected from the rest of the pattern. And if <code>H = P</code>, then the hue will vary in the same way as the brightness, which is not that interesting. </p>
<p>My solution is this: Say <code>N</code> is a low-frequency noise function. Do not use this for <code>H</code> directly, but first warp <code>N</code> using <code>P</code>. For example:</p>
<pre><code class="hljs language-javascript">H = <span class="hljs-title function_">domainWarp</span>(N, P, <span class="hljs-function">(<span class="hljs-params">p</span>) =&gt;</span> <span class="hljs-number">1.0</span>, <span class="hljs-number">100</span>)
</code></pre>
<p>Now, the color will vary slowly, but also follow the general shape of the pattern. I used this technique when adding color to the banner image for the Spire pattern, and this piece as well:</p>
<p><img src="/img/alien/neon4.jpg" alt="Neon colors"></p>
<hr>
<p>That was all I had to say. Hope this post proves useful. Feel free to scavenge the <a target="_blank" href="https://github.com/palmdrop/sandbox" rel="noopener noreferrer" title="repository - https://github.com/palmdrop/sandbox">repository</a> and steal anything you find useful. Give me credit if you think the code is worth it. </p>
<p>Stay inside.</p>
` } }
      />
    </Post>
  );
};

export default Post6;

