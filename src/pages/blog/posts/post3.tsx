import Post from '../components/post/Post';
import '../../../styles/highlighting/smog.scss';
import image from '../../../assets/posts/illuminating-horror-of-ai-art.jpg';

const metadata = {
  'title': 'The Illuminating Horror of AI Art',
  'keywords': [
    'words'
  ],
  'date': '2022-04-28',
  'image': '../../../assets/posts/illuminating-horror-of-ai-art.jpg',
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
        dangerouslySetInnerHTML={ { __html: `<p>AI art is often eerie. Beautiful, but eerie, which I think reveals something about the inner mechanisms of today&#39;s AI. The featured image of this post is an artwork by the artist Mario Klingeman.</p>
<hr>
<blockquote>
<p>None of the images in this post are created by me. Most of them originate from established AI artists, free web tools, or artists on the subreddit <a target="_blank" href="https://www.reddit.com/r/aiArt" rel="noopener noreferrer" title="r/aiArt - https://www.reddit.com/r/aiArt">r/aiArt</a>.</p>
</blockquote>
<h1 id="horror-and-ai-art">Horror and AI art</h1>
<p>The recent trend of AI art has produced a lot of unsettling artworks. Patterns, shapes, and features will shift and flow into each other in unreal -- and unhuman -- ways. This characteristic remains even when there&#39;s no semblance of real-world motifs. This produces a confused, dreamlike feeling. Or nightmarish. Even when the artist does not intentionally take advantage of this effect, the uncanny remains.</p>
<p><img src="/img/ai-art/wblut.jpg" alt="&quot;#midjourney&quot; by wblut">
<a target="_blank" href="https://www.instagram.com/p/CcRSLMOtufl/" rel="noopener noreferrer" title="<em>&quot;#midjourney&quot; by wblut</em> - https://www.instagram.com/p/CcRSLMOtufl/"><em>&quot;#midjourney&quot; by wblut</em></a></p>
<p><img src="/img/ai-art/lurks.webp" alt="&quot;What Lurks in the Deep&quot; by u/hector_zepelli">
<a target="_blank" href="https://www.reddit.com/r/aiArt/comments/u2va31/what_lurks_in_the_deep_made_on_nightcafe/" rel="noopener noreferrer" title="<em>&quot;What Lurks in the Deep&quot; by u/hector_zepelli</em> - https://www.reddit.com/r/aiArt/comments/u2va31/what_lurks_in_the_deep_made_on_nightcafe/"><em>&quot;What Lurks in the Deep&quot; by u/hector_zepelli</em></a></p>
<p><img src="/img/ai-art/infinity.webp" alt="&quot;MOMENT OF TIME STRETCHED INTO INFINITY&quot; by u/Torley_">
<a target="_blank" href="https://www.reddit.com/r/aiArt/comments/tyc8j4/moment_of_time_stretched_into_infinity/" rel="noopener noreferrer" title="<em>&quot;MOMENT OF TIME STRETCHED INTO INFINITY&quot; by u/Torley</em> - https://www.reddit.com/r/aiArt/comments/tyc8j4/moment_of_time_stretched_into_infinity/"><em>&quot;MOMENT OF TIME STRETCHED INTO INFINITY&quot; by u/Torley</em></a></p>
<p>AI has true potential as an artistic tool, especially when artists embrace its strange characteristics. But I think such art will always expose something about AI: it&#39;s very much unlike us.</p>
<p>In science fiction and popular science alike, AI has often been portrayed as a conscious being, artificial but capable of reasoning and decision making: a hyper-intelligent agent. This is not the AI of today. Today&#39;s neural nets are the results of strict mathematical processes and do not resemble human minds, or the minds of any other living beings.  Today&#39;s AI is not general. Today&#39;s AI is bound to a strict domain.</p>
<hr>
<p>Some AI tools come eerily to producing photorealistic images and video. Some AI tools perform specific tasks in ways indistinguishable from a human being. Some AI&#39;s pass the Turing test (which mostly tells us that people are easy to fool). Take a look at these images:</p>
<p><img src="/img/ai-art/ai-face6.jpg" alt="AI generated face 1, realistic">
<img src="/img/ai-art/ai-face5.jpg" alt="AI generated face 2, realistic"></p>
<p>These faces are generated using <a target="_blank" href="https://thispersondoesnotexist.com/" rel="noopener noreferrer" title="thispersondoesnotexist.com - https://thispersondoesnotexist.com/">thispersondoesnotexist.com</a>, but could easily be real. If you look closely enough, maybe you can find oddities. Maybe not. It calms me slightly that the AI occasionally slips up. Teeth, glasses, and backgrounds often reveal that something is off. Sometimes, the mistakes are more obvious:</p>
<p><img src="/img/ai-art/ai-face1.jpg" alt="AI generated face 3, flawed">
<img src="/img/ai-art/ai-face2.jpg" alt="AI generated face 4, flawed">
<img src="/img/ai-art/ai-face4.jpg" alt="AI generated face 5, flawed"></p>
<p>I&#39;m not technically proficient enough to tell you <em>why</em> these mistakes occur. The idea behind this post is more philosophical anyway. What these images tell me is that an AI does not understand its narrow domain in the way a human would. Its internal model is psychedelic and strange, unhuman.</p>
<p>This <a target="_blank" href="https://distill.pub/2018/feature-visualization/" rel="noopener noreferrer" title="article - https://distill.pub/2018/feature-visualization/">article</a> tries to visualize the internal models of AI. It&#39;s a rough map. The results show lines growing into patterns growing into parts growing into jumbled messes of features, flowing into each other. Maybe our brains, deep down, work in a similar fashion. But we at least have a spatial understanding of the world around us, we have context.</p>
<p>The article reveals that it&#39;s not always clear <em>what</em> an AI is looking for in an image. Does an AI, trained in identifying buildings, really understand what buildings look like, or does it merely identify abstract patterns, and the vague shape of the skyline? Does it make a distinction between the sky and the architecture? Does it search for other, unknown, semi-related factors? </p>
<p>Even with these new feature visualization techniques, we can&#39;t properly understand how an AI &quot;thinks&quot;. We can study these layers and reason about how it might make its decisions, but we&#39;ll only be making guesses.</p>
<p>If this is not enough, techniques for fooling AI reveal that its thinking is truly alien. <a target="_blank" href="https://www.theverge.com/2017/4/12/15271874/ai-adversarial-images-fooling-attacks-artificial-intelligence" rel="noopener noreferrer" title="This article - https://www.theverge.com/2017/4/12/15271874/ai-adversarial-images-fooling-attacks-artificial-intelligence">This article</a> explains how many AI can be tricked with carefully crafted attacks, sometimes invisible to the human observer, but (apparently) radically altering for the AI. An invisible noise can cause an animal to be confidently classified as a completely different animal. </p>
<p>AI does not think like us. </p>
<p>And AI art helps us see that. AI art shows us features, traits, and objects blended together, merging, one transforming into another -- a dreamy, psychedelic mush filled with things recognize, although barely. We peer into the mind of an unthinking, complicated mathematical beast that does not think like us, and whose thinking is, to a large extent, impossible to map.</p>
<p><img src="/img/ai-art/trial.webp" alt="&quot;Elizabeth Holmes on Trial&quot; by u/Torlkey_">
<a target="_blank" href="https://www.reddit.com/r/aiArt/comments/ttoe7d/elizabeth_holmes_on_trial/" rel="noopener noreferrer" title="<em>&quot;Elizabeth Holmes on Trial&quot; by u/Torlkey_</em> - https://www.reddit.com/r/aiArt/comments/ttoe7d/elizabeth_holmes_on_trial/"><em>&quot;Elizabeth Holmes on Trial&quot; by u/Torlkey_</em></a></p>
<p>Look at the image above. There&#39;s a person, stairs, papers, maybe tablets, lights, and of course, blood. Objects are not clearly separated. There are liminal threshold areas. Of course, this image was created with a lot of artistic freedoms -- it&#39;s not an attempt at producing a photorealistic scene. Still, all this tells me that AI does not understand the boundaries between physical objects, it does not understand the architecture of the room. The AI-generated faces from before tell me the same story -- sometimes hair blends into the background, or a face will merge with a second, nightmarish face in the foreground.</p>
<p>AI vision is alien and unknowable. It&#39;s neural nets that we create but do not understand.</p>
<h1 id="ai-and-the-web">AI and the web</h1>
<p>The web is infused with AI. Search engines, photoshop tools, user data analysis, and all the <em>FEEDS</em>. Sometimes the use of AI is disguised as  &quot;the algorithm&quot;. Using this word may or may not be a conscious choice by social media platforms. &quot;The algorithm&quot; makes it sound like the underlying mechanism is carefully and intentionally designed, not trained and trained on massive datasets until it has grown into a massive, incomprehensible network.</p>
<p>Don&#39;t read this post as a well-formed argument against the use of AI on the web. It&#39;s not. This is me reflecting on the eerie. This is me feeling uneasy about the fact that the same mechanism that creates horrifying, unknowing art also controls what we see and how we interact on the web.</p>
<p>When massive digital media conglomerates use very big data to train these unthinking creatures, no one really knows what tricks the resulting network may use. What psychological hooks does it employ? What content does it promote? We can only analyze and try to figure it out ourselves because the leaders of the massive digital media conglomerates do not know, and the AI can&#39;t tell us.</p>
<hr>
<p>AI has helped us create perfect &quot;push media&quot;: media where you lack control, where you don&#39;t need it, where the &quot;algorithm&quot; decides for you, reads your interactions, and devices the perfect feed for you, optimized to keep you around for as long as possible. </p>
<p>This is contrasted by &quot;pull media&quot;, where you have full control over what content, and in what format, you are exposed to. RSS feeds are an example of pull only media. You subscribe to the feeds you like, and you will see updates <em>only</em> from those feeds, chronologically, sorted, with the ability to unsubscribe whenever you like. Old youtube used to be similar to this.</p>
<p>The Facebook and Twitter of today are a bit of both. The user follows other users, groups, or pages, but the feed is not complete or chronological, and you may be exposed to suggestions, random retweets, and posts by your friend&#39;s aunt&#39;s old high-school teacher. And so on. The &quot;algorithm&quot; tries to guess what you will respond to, and rearranges the feed to be as effective as possible.</p>
<p>Tiktok is almost exclusively push. The &quot;algorithm&quot;, which is AI-driven, will curate your feed based almost only on the videos you linger on or directly interact with. The feed will be tailor-made just for you, without you having to make any conscious decisions. Since the feed is not based on subscriptions or follows, the content is endless. You can scroll indefinitely without a logical end in sight. You will never &quot;catch up&quot; with the newest posts.</p>
<blockquote>
<p>&quot;Just nod or shake your head and we&#39;ll do the rest.&quot;</p>
</blockquote>
<p><a target="_blank" href="https://lemire.me/blog/2021/11/02/stop-spending-so-much-time-being-trolled-by-billionaire-corporations/" rel="noopener noreferrer" title="This article - https://lemire.me/blog/2021/11/02/stop-spending-so-much-time-being-trolled-by-billionaire-corporations/">This article</a> by Daniel Lemire explains push/pull media well, and details some methods for taking back control.</p>
<h1 id="outsourcing-self-awareness-to-ai">&quot;Outsourcing self-awareness to AI&quot;</h1>
<p>This quote comes from <a target="_blank" href="https://towardsdatascience.com/yuval-noah-harari-and-fei-fei-li-on-ai-90d9a8686cc5" rel="noopener noreferrer" title="a conversation with Yuval Noah Harari and Fei-Fei Li - https://towardsdatascience.com/yuval-noah-harari-and-fei-fei-li-on-ai-90d9a8686cc5">a conversation with Yuval Noah Harari and Fei-Fei Li</a>, published in Towards Data Science. </p>
<p>There are lots of stories of AI seemingly understanding things about a person that they haven&#39;t realized themselves. In the conversation linked above, the outlook is fairly optimistic: AI can be used as tools for personal exploration and growth. I agree that this is an exciting possibility, if the technology is used correctly. What scares me is that we instead seem to be outsourcing self-awareness and identity to apps like Tiktok, and by extension, to AI.</p>
<blockquote>
<p><a target="_blank" href="https://www.wired.com/story/tiktok-algorithm-mental-health-psychology/" rel="noopener noreferrer" title="&quot;TikTok can feel as if it’s showing you who you’ve always been.&quot; - https://www.wired.com/story/tiktok-algorithm-mental-health-psychology/">&quot;TikTok can feel as if it’s showing you who you’ve always been.&quot;</a></p>
</blockquote>
<p>The algorithm is statistics. It&#39;s the amalgamation of unfathomable amounts of data. It does not understand you. Insights are superficial and accidental. It&#39;s psychological tricks and averages. It may be extremely useful as exploratory tools, but this is not how it&#39;s used. AI controls how we interact, what <em>content</em> we are exposed to, what we think about the news, each other, and the state of the world. It shapes who we are. A lot of people, for hours each day, engage in an active feedback loop with the algorithm. You will shape its model of you, and it will shape you.</p>
<p>My argument against this is no stronger than that &quot;this makes me feel extremely uneasy&quot;. AI does not know you, it cannot distinguish you in the streams of data, it cannot differentiate between <a target="_blank" href="https://nomegallery.com/exhibitions/failing-to-distinguish-between-a-tractor-trailer-and-the-bright-white-sky/" rel="noopener noreferrer" title="a tractor-trailer and the bright white sky - https://nomegallery.com/exhibitions/failing-to-distinguish-between-a-tractor-trailer-and-the-bright-white-sky/">a tractor-trailer and the bright white sky</a>, <a target="_blank" href="https://www.nature.com/articles/d41586-019-03013-5" rel="noopener noreferrer" title="it&#39;s extremely easy to trick - https://www.nature.com/articles/d41586-019-03013-5">it&#39;s extremely easy to trick</a>, and it&#39;s the source of nightmare art. Look, admire alien shapes and patterns, and understand that this is &quot;thinking&quot; very unlike yours.</p>
` } }
      />
    </Post>
  );
};

export default Post3;

