import React, { Suspense, useCallback, useMemo } from 'react';

import {
  Switch,
  Route,
  useHistory
} from 'react-router-dom';

import { PageRoute, RedirectNotFound } from '../../App';
import { PageProps } from '../PageWrapper';

import Header from '../../components/header/Header';
import HomeBar from '../../components/navigation/home/HomeBar';
import FadedHeader from '../../components/header/faded/FadedHeader';
import Paragraph from '../../components/paragraph/Paragraph';

import { pieces } from './pieces/pieces';
import PieceWrapper from './wrapper/PieceWrapper';
import { PieceEntry } from './entry/PieceEntry';

import { nameToPath } from '../../utils/general';

import { ReactComponent as Obstacle } from '../../assets/svg/obstacle4.svg';

import './piecesPage.scss';

const PiecesPage = ( { route } : PageProps ) : JSX.Element => {
  const pieceEntries = useMemo( () => (
    pieces.map( ( piece, index ) => (
      <PieceEntry 
        key={ `${ piece.name }-${ index + 1 }` }
        baseRoute={ route }
        piece={ piece } 
        index={ index }
      />
    ) ).reverse()
  ), [] );

  return (
    <div className="pieces-page" >
      <Suspense fallback={ null }>
        <Switch>
          { /* Piece routes */ }
          { pieces.map( ( piece, index ) => (
            <Route
              key={ index }
              path={ `${ route }/${ nameToPath( piece.name ) }` as string }
              exact
            >
              <PieceWrapper
                baseRoute={ route }
                pieceIndex={ index }
                backgroundColorTheme={ piece.colorTheme }
                showLoadingPage={ true }
                showOverlay={ true }
                setPageTitle={ true }
              />
            </Route>
          ) )}

          { /* Default route */ }
          <Route
            key={ route }
            path={ route } 
            exact
          >
            <Header 
              mainTitle="OBSCURED"
              firstSubtitle="Digital art"
              mainLevel={ 3 }
              subLevel={ 5 }
              linkTo={ PageRoute.root }
            />

            <main>
              <FadedHeader
                title="Pieces"
              >
                <Obstacle className="faded-header__obstacle" />
              </FadedHeader>

              <Paragraph>
                This is the place for my experiments with digital and generative art. 
                I present my work as-is -- living and buggy. <em>Most are heavy on the graphics card. 
                Mobile users be warned.</em>
              </Paragraph>

              { pieceEntries }
            </main>

            <HomeBar />
          </Route>

          <RedirectNotFound />
        </Switch>
      </Suspense>
    </div>
  );
};

export default PiecesPage;