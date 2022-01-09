import rehashPath from '../../assets/content/about/rehash2.jpg';
import feedPath from '../../assets/content/about/feed1.jpg';
import patternPath from '../../assets/content/about/pattern-shape.jpg';

export type ImageData = {
  src : string,
  alt : string,
  link ?: string,
  width ?: number,
  height ?: number,
  label ?: boolean,
}

type SectionContent = string | ImageData

type Section = {
  title ?: string,
  content : SectionContent[]
}

type LinkData = {
  text : string,
  path : string,
}

export type CreditsSection = {
  title : string,
  entries : LinkData[]
}

export const introduction = `
This is a personal space where I experiment with web design, writing, and generative art. I'd love to see the philosophy of the old Internet combined with the technologies of the new. Scroll down to read more.
`;

export const sections : Section[] = [
  {
    content: [
      {
        src: rehashPath,
        alt: 'Rehash Transform',
        height: 350,
        label: false,
      },
      `
      My name is Anton. I go by "palmdrop" on the web. At the moment, I'm learning design, 3D graphics, and new techniques for creating generative art. I'm trying to write more, and hopefully, this site will be where I dump some of my thoughts and ideas.  It's a space of my own. I think our presence on the Internet is way too limited to the spaces of established corporate platforms. We do not define the bounds of those platforms, we just fill them with filtered content.
      `,
      `
      My goal for this site is to make it a place for interactive generative art, writing, and experimentation.
      `
    ]
  },
  {
    title: 'Generative Art',
    content: [
      `
      I've been working with generative art for many years now. At first, it was a way of learning programming and algorithms. Then, it grew into a more serious artistic expression. I still haven't really found my style or niche. I hope to change that.
      `,
      `
      I find generative art an extremely fascinating medium. It's inherently chance-based and living. Generative art can be interactive, adaptable, and organic. The artist can either cherry-pick certain outputs and present them as standalone pieces, or continuously generate new outputs, making the algorithm itself the artwork. 
      `,
      {
        src: feedPath,
        alt: 'Feedback loop',
        height: 350,
        label: false,
      },
    ]
  },
  {
    title: 'Politics and Philosophy',
    content: [
      `
      Although I'm not particularly well-read, politics and philosophy are important to me. I think we need to be conscious of the underlying ideology when using digital tools and inhabiting digital spaces. I too have a Google, Facebook, and Instagram account, but making these platforms our default -- or only -- experience of the Internet is dangerous. These spaces are not our own. They are formed to best fit a capitalist mode of production. They not only gather our data to best serve us personalized ads, but they also conduct social engineering and subtle behavioral conditioning. This is no secret nor accident. 
      `,
      `
      Transitioning away from this is a slow process, especially for artists. NFT:s seem hot right now, but they have other problems -- environmental, conceptual, and community-related. 
      `,
      `
      A website of one's own invites more pure digital expression and control.
      `,
      {
        src: patternPath,
        alt: '3D Patterns',
        height: 350,
        label: false,
      },
      `
      This site stores none of your information. There are no cookies, analytics, or user data.
      `,
      `
      The images you've seen are some excerpts from my generative explorations.
      `
    ]
  }
];

export const links : LinkData[] = [
  {
    text: 'Instagram',
    path: 'https://instagram.com/palmdrop/',
  },
  {
    text: 'Github',
    path: 'https://github.com/palmdrop',
  },
  {
    text: 'Linktree',
    path: 'https://linktr.ee/palmdrop',
  },
];

export const creditsSections : CreditsSection[] = [
  {
    title: 'Fonts',
    entries: [
      {
        text: 'Syne',
        path: 'https://gitlab.com/bonjour-monde/fonderie/syne-typeface'
      },
      {
        text: 'Quicksand',
        path: 'https://www.fontsquirrel.com/fonts/quicksand'
      }
    ]
  },
  {
    title: 'Tools',
    entries: [
      {
        text: 'React',
        path: 'https://reactjs.org/',
      },
      {
        text: 'Redux',
        path: 'https://redux.js.org/'
      },
      {
        text: 'Three.js',
        path: 'https://threejs.org/'
      },
    ]
  },
  {
    title: 'Inspo',
    entries: [
      {
        text: 'Fuse',
        path: 'https://fuse.blog/'
      },
      {
        text: 'p5Aholic',
        path: 'https://experiments.p5aholic.me/'
      },
      {
        text: 'Crosslucid',
        path: 'https://linktr.ee/crosslucid'
      },
    ]
  },
];