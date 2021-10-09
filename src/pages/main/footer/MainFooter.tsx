import SharpDisk from '../../../components/ornamental/disk/sharp/SharpDisk';

import ExternalLink from '../../../components/link/ExternalLink';
import { githubIconData, IconData, instagramIconData, mailIconData } from '../../../assets/external-icons';

import './MainFooter.scss';

const icons: IconData[] = [
  instagramIconData,
  githubIconData,
  mailIconData
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