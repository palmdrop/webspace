import retroDiamondPath from '../../assets/content/about/retro-diamond.png';
import threeDMaterialPath from '../../assets/content/about/3d-material.png';
import layeredMaterialPath from '../../assets/content/about/layered-material.png';

export type ImageData = {
  src : string,
  alt : string,
  link? : string,
  width? : number,
  height? : number,
}

type SectionContent = string | ImageData

type Section = {
  title? : string,
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

export const introduction : string = `
  This is a personal, exploratory digital place. Here, I experiment with web design, 
  generative art and writing. I'd love to see the philosophy of the old internet 
  merged with the technologies of the new. Scroll down to read more.
`;

export const sections : Section[] = [
  {
    content : [
      {
        src : retroDiamondPath,
        alt : 'Retro Diamond',
        height : 350,
      },
      `
        I love ugly. Ugly is its own aesthetic. Ugly mixed with design is strange and special. In the design of this webspace, I try to
        strike a balance between the ugly and raw, and the beautiful and polished. It should be fun. Hopefully interesting. Constantly growing.
      `,
      `
        My name is Anton Hildingsson. On the internet, I usually go by "Palmdrop". The name means nothing, it's just a symbol. On the Internet,
        my presence is not that strong. The pieces of me I show usually involve generative art, and ocassionally writing. I have limited skills in
        traditional artistic fields, but I do know how to code. Generative art, AI art, NFT:s, whatever, it's all quite mainstream all of a sudden. 
        My work is not different from anything else out there. I guess it's just mine. Hopefully interesting, beautiful or strikingly ugly to some.
      `,
      `
        I do not write that much. I have trouble finding words. This is my attempt at changing that. There's a discrepancy between what I want to 
        do/be and what I actually do/is.
      `
    ]
  },
  {
    title : "Generative Art",
    content : [
      `
        I've been working with generative art for many years now. At first, it was a way of learning programming and algorithms. Then, it developed
        to a more serious artistic expression. I still haven't quite found my "style" or "niesche". This site is one step in changing that.
      `,
      `
        Typically, I've been working with 2D art, which is most generative art. Systems, algorithms, pixel operations, simple lines and shapes combined
        and overlayed at mass to create complex pieces. However, lately, I've started exploring 3D art, which functions quite differently from 2D art.
      `,
      `
        I find generative art a extremely interesting medium, in it's inerhently semi-automatic and chance-based nature. Art that is interactive, adaptable,
        random or changing beyond or only partly influenced by human control is alluring and fascinating to me. Generations can be cherry picked and presented 
        as perfect stand-alone entities, or continuously generated, in which the algorithm itself becomes the art work.
      `,
      {
        src : threeDMaterialPath,
        alt : 'Materials',
        height : 350,
      },
    ]
  },
  {
    title : "Politics and Philosophy",
    content : [
      `
        Although I'm not particularly well-read, politics and philosophy are quite important to me. No space is devoid of them. This place, and
        the Internet as a whole, is no exception. We need to be conscious of the underlying ideology when using tools and inhabiting spaces. 
        I too use Facebook, Google and Instagram, but I also think making these platforms our defaults -- or our only experience of the internet --
        is dangerous and harmful. 
      `,
      `
        These spaces are not our own. They are engineered to best fit a late capitalist mode of production. They are conduct social engineering, subtle
        behavior conditioning. This is no accident or secret. Using these tools, however (unfortunately) necessary and natural, does something to us. 
        Transitioning away is a slow process, especially for artists. NFT:s are a new possibility for creatives, where an Instagram precense and growing a personal
        brand becomes less vital, but the concept of NFT:s and the surrounding culture has its problems, environmental, community related and conceptual. 
      `,
      `
        A website of ones own invites more pure digital expression and control.
      `,
      {
        src : layeredMaterialPath,
        alt : 'Meditation box',
        height : 350,
      },
      `
        Yet, you can find me on major platforms. Github, Instagram, Linkedin, wherever. One has to be pragmatic. Just be conscious. Remember
        what they are and what they do.
      `,
      `
        This site stores none of your information. There are no cookies, agreements or user data, not even logging of traffic. 
      `,
      `
        The images you've seen are some excerpts from my generative explorations.
      `
    ]
  }
];

export const links : LinkData[] = [
  {
    text : "Instagram",
    path : "https://instagram.com/palmdrop/",
  },
  {
    text : "Github",
    path : "https://github.com/palmdrop",
  },
  {
    text : "Linktree",
    path : "https://linktr.ee/palmdrop",
  },
  {
    text : "Surfaces",
    path : "https://palmdrop.github.io/surfaces/"
  }
];

export const creditsSections : CreditsSection[] = [
  {
    title : "Fonts",
    entries : [
      {
        text : "Syne Family",
        path : "https://gitlab.com/bonjour-monde/fonderie/syne-typeface"
      },
      {
        text : "Quicksand",
        path : "https://fonts.google.com/specimen/Quicksand"
      },
    ]
  },
  {
    title : "Tools",
    entries : [
      {
        text : "React",
        path : "https://reactjs.org/",
      },
      {
        text : "Redux",
        path : "https://redux.js.org/"
      },
      {
        text : "Three.js",
        path : "https://threejs.org/"
      },
    ]
  },
  {
    title : "Inspiration",
    entries : [
      {
        text : "Fuse blog",
        path : "https://fuse.blog/"
      },
      {
        text : "p5Aholic",
        path : "https://experiments.p5aholic.me/"
      },
      {
        text : "Crosslucid",
        path : "https://linktr.ee/crosslucid"
      },
    ]
  },
]