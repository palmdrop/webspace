import { useState } from 'react'
import { useHistory } from 'react-router';
import { PageRoute } from '../../App';
import GlassCard from '../../components/cards/glass/GlassCard';
import Button from '../../components/input/button/Button';
import { NavEntry } from '../../components/navigation/navbar/NavBar';
import Paragraph from '../../components/paragraph/Paragraph';

import { ReactComponent as Obstacle } from '../../assets/svg/obstacle1.svg';

import './notFoundPage.scss';


const NotFoundPage = () : JSX.Element => {
  const history = useHistory();
  const [ homeNavEntry ] = useState<NavEntry>( () => { return { 
    text : "Return Home", 
    route : PageRoute.root
  }});

  const onGoBack = () => {
    history.goBack();
  }

  const onReturnHome = () => {
    history.replace( PageRoute.root );
  }

  return (
    <div className="not-found-page">
      <main>
        <header>
          404 Page Not Found
          <Obstacle className="not-found-page__obstacle" />
        </header>
        <Paragraph>
          This page does not exist (yet).
          Perhaps it should.
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

export default NotFoundPage;