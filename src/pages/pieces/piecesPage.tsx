import React, { Suspense } from 'react'

import {
  Switch,
  Route,
  useHistory
} from "react-router-dom";

import { useSelector } from 'react-redux';

import { selectActivePiece } from '../../state/slices/uiSlice';

import { PageRoute } from '../../App';
import { PageProps } from '../PageWrapper';

import Header from '../../components/header/Header';
import HomeBar from '../../components/navigation/home/HomeBar';
import FadedHeader from '../../components/header/faded/FadedHeader';
import Paragraph from '../../components/paragraph/Paragraph';
import GradientBackground from '../../components/ornamental/gradient/GradientBackground';

import { PieceData, pieces } from './content';
import { PiecesList } from './piecesList/PiecesList';
import { introduction } from './content';

import { ReactComponent as Obstacle } from '../../assets/svg/obstacle4.svg';

import './piecesPage.scss';
import { PieceWrapper } from './pieces/pieces';

const InformationDisplay = ( { title, paragraphs } : { title : string, paragraphs: string[] } ) : JSX.Element => {
  return (
    <main className="information-display">
      <FadedHeader
        title={ title } 
      >
        <Obstacle className="faded-header__obstacle" />
      </FadedHeader>
      { paragraphs.map( paragraph => (
        <Paragraph>
          { paragraph }
        </Paragraph>
      ))}
    </main>
  )
}

const PiecesPage = ( { route } : PageProps ) : JSX.Element => {
  const activePieceIndex = useSelector( selectActivePiece );
  const history = useHistory();

  const handlePieceClick = ( piece : PieceData, event : React.MouseEvent ) : void => {
    history.push( `${ route }/${ piece.index + 1 }` );
  }

  const getMainContent = () : JSX.Element => {
    let title : string;
    let paragraphs : string[];

    if( activePieceIndex !== null ) {
      const activePiece = pieces[ activePieceIndex ];
      title = activePiece.name;
      paragraphs = activePiece.description;
    } else {
      title = introduction.title;
      paragraphs = introduction.description;
    }

    return (
      <InformationDisplay
        title={ title } 
        paragraphs={ paragraphs }
      />
    )
  }

  return (
    <div className="pieces-page" >
      <Suspense fallback={ null }>
        <Switch>
          { /* Piece routes */ }
          { pieces.map( piece => {
            return (
              <Route
                key={ piece.index }
                path={ `${ route }/${ piece.index + 1 }` as string }
              >
                <PieceWrapper
                  PieceComponent={ piece.Component } 
                  backgroundColorTheme={ piece.colorTheme }
                />
              </Route>
            )
          })}

          { /* Default route */ }
          <Route
            key={ route }
            path={ route } 
          >
            <Header 
              mainTitle="OBSCURED"
              firstSubtitle="by Anton Hildingsson"
              mainLevel={ 3 }
              subLevel={ 5 }
              linkTo={ PageRoute.root }
            />

            <main>
              { getMainContent() }
            </main>

            <PiecesList 
              pieces={ pieces }
              onPieceClick={ handlePieceClick }
            />

            <aside className="pieces-page__aside">
              <HomeBar />
            </aside>

          </Route>
        </Switch>
      </Suspense>
    </div>
  )
}

export default PiecesPage;