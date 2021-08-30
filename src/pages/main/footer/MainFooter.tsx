import SharpDisk from '../../../components/ornamental/disk/sharp/SharpDisk';

import instagramIcon from '../../../assets/svg/instagram.svg';
import githubIcon from '../../../assets/svg/github.svg';
import mailIcon from '../../../assets/svg/email.svg';

import './MainFooter.scss';
import ExternalLink from '../../../components/link/ExternalLink';

type IconEntry = {
  src: string,
  alt: string,
  link: string,
};

const icons: IconEntry[] = [
  {
    src: instagramIcon,
    alt: 'instagram',
    link: 'https://instagram.com/palmdrop/',
  },
  {
    src: githubIcon,
    alt: 'github',
    link: 'https://github.com/palmdrop/',
  },
  {
    src: mailIcon,
    alt: 'mail',
    link: 'mailto:anton@exlex.se'
  }
];

const MainFooter = (): JSX.Element => {
  return (
    <footer className="main-footer">
      {icons.map(({ src, alt, link }, index) => (
        <ExternalLink 
          key={`${alt}-${index}`}
          link={ link }
        >
          <SharpDisk
          >
            <img src={src} alt={alt} />
          </SharpDisk>
        </ExternalLink>
      ))}
    </footer>
  );
}

export default MainFooter;