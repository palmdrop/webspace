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

export const introduction : string = `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
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
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      `,
      `
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      `,
      `
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      `
    ]
  },
  {
    title : "Generative Art",
    content : [
      `
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      `,
      `
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      `,
      `
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      `,
      {
        src : threeDMaterialPath,
        alt : '3D materials',
        height : 350,
      },
    ]
  },
  {
    title : "Politics and Philosophy",
    content : [
      `
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      `,
      `
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      `,
      {
        src : layeredMaterialPath,
        alt : 'Meditation box',
        height : 350,
      },
      `
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
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
];
