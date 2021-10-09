import instagramSVG from './svg/instagram.svg';
import githubSVG from './svg/github.svg';
import mailSVG from './svg/email.svg';

export type IconData = {
  src: string,
  alt: string,
  link: string,
};

export const instagramIconData : IconData = {
  src: instagramSVG,
  alt: 'instagram',
  link: 'https://instagram.com/palmdrop/',
}


export const githubIconData : IconData = {
    src: githubSVG,
    alt: 'github',
    link: 'https://github.com/palmdrop/',
}

export const mailIconData : IconData = {
  src: mailSVG,
  alt: 'mail',
  link: 'mailto:anton@exlex.se'
}
