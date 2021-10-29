import { useHistory } from 'react-router';

import { FallbackProps } from 'react-error-boundary';

import { PageRoute } from '../../App';
import GlassCard from '../../components/cards/glass/GlassCard';
import Button from '../../components/input/button/Button';
import Paragraph from '../../components/paragraph/Paragraph';

import { ReactComponent as Obstacle } from '../../assets/svg/obstacle2.svg';

import './pageDidNotLoadPage.scss';
import SoftDisk from '../../components/ornamental/disk/soft/SoftDisk';

const PageDidNotLoadPage = ( { error, resetErrorBoundary } : FallbackProps ) : JSX.Element => {
  const onRetry = () => {
    resetErrorBoundary();
    window.location.reload();
  }

  return (
    <div className="page-did-not-load-page">
      <main>
        <header>
          Something went wrong!
          <SoftDisk />
          <SoftDisk />
        </header>
        <div>
          <Paragraph>
            The internet is unpredictable. Something went wrong along the way. Try again.
          </Paragraph>
          <GlassCard>
            <Button
              onClick={ onRetry }
            >
              Reload Page
            </Button>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}

export default PageDidNotLoadPage;