import React, { Suspense, useCallback, useMemo } from 'react'

import {
  Switch,
  Route,
  useHistory
} from "react-router-dom";

import { PageRoute, RedirectNotFound } from '../../App';
import { PageProps } from '../PageWrapper';

import Header from '../../components/header/Header';
import HomeBar from '../../components/navigation/home/HomeBar';
import FadedHeader from '../../components/header/faded/FadedHeader';
import Paragraph from '../../components/paragraph/Paragraph';

import { PieceNavigationFunction, pieces } from './pieces/pieces';
import PieceWrapper from './wrapper/PieceWrapper';
import { PieceEntry } from './entry/PieceEntry';

import { introduction } from './content';

import { ReactComponent as Obstacle } from '../../assets/svg/obstacle4.svg';

import './piecesPage.scss';

const PiecesPage = ( { route } : PageProps ) : JSX.Element => {
  const history = useHistory();

  const handlePieceNavigation : PieceNavigationFunction = useCallback( ( index : number, event : React.MouseEvent ) : void => {
    history.push( `${ route }/${ index + 1 }` );
  }, [ history, route ] );

  const pieceEntries = useMemo( () => (
    pieces.map( ( piece, index ) => (
      <PieceEntry 
        key={ `${ piece.name }-${ index + 1 }` }
        piece={ piece } 
        index={ index }
        onClick={ handlePieceNavigation }
      />
    )).reverse()
  ), [ handlePieceNavigation ] );

  return (
    <div className="pieces-page" >
      <Suspense fallback={ null }>
        <Switch>
          { /* Piece routes */ }
          { pieces.map( ( piece, index ) => (
            <Route
              key={ index }
              path={ `${ route }/${ index + 1 }` as string }
              exact
            >
              <PieceWrapper
                pieceIndex={ index }
                backgroundColorTheme={ piece.colorTheme }
                showLoadingPage={ true }
                showOverlay={ true }
                handlePieceNavigation={ handlePieceNavigation }
              />
            </Route>
          ))}

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
                title={ introduction.title }
              >
                <Obstacle className="faded-header__obstacle" />
              </FadedHeader>

              { introduction.description.map( paragraph => (
                <Paragraph>
                  { paragraph }
                </Paragraph>
              ))}

              { pieceEntries }
            </main>

            <HomeBar />
          </Route>

          <RedirectNotFound />
        </Switch>
      </Suspense>
    </div>
  )
}

export default PiecesPage;