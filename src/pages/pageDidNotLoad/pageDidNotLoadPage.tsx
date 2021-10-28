import { useHistory } from 'react-router';

import { FallbackProps } from 'react-error-boundary';

import { PageRoute } from '../../App';
import GlassCard from '../../components/cards/glass/GlassCard';
import Button from '../../components/input/button/Button';
import Paragraph from '../../components/paragraph/Paragraph';

import { ReactComponent as Obstacle } from '../../assets/svg/obstacle1.svg';

import './pageDidNotLoadPage.scss';

const PageDidNotLoadPage = ( { error, resetErrorBoundary } : FallbackProps ) : JSX.Element => {
  const history = useHistory();

  const onGoBack = () => {
    history.goBack();
  }

  const onReturnHome = () => {
    history.replace( PageRoute.root );
  }

  return (
    <div className="page-did-not-load-page">
      <main>
        <header>
          Something went wrong!
          <Obstacle className="page-did-not-load-page__obstacle" />
        </header>
        <Paragraph>
          This page failed to load. 
        </Paragraph>
        <nav>
          <GlassCard>
            <Button 
              onClick={ onReturnHome }
            >
              Home Page
            </Button>
            <Button
              onClick={ onGoBack }
            >
              Last Page
            </Button>
          </GlassCard>
        </nav>
      </main>
    </div>
  );
}

export default PageDidNotLoadPage;