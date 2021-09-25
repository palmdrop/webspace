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

import { PieceNavigationFunction, pieces } from './pieces/pieces';
import { PiecesList } from './list/PiecesList';
import { introduction } from './content';

import { ReactComponent as Obstacle } from '../../assets/svg/obstacle4.svg';

import LazyImage from '../../components/media/image/LazyImage';

import './piecesPage.scss';
import Title from '../../components/title/Title';
import PieceWrapper from './wrapper/PieceWrapper';

type InformationDisplayProps = { 
  title : string, 
  paragraphs : string[], 
  imagePath? : string, 
  topHeader? : boolean 
};

const InformationDisplay = ( { title, paragraphs, imagePath, topHeader = false } : InformationDisplayProps ) => {
  return (
    <main className="information-display">
      { topHeader ? (
        <Title
          level={ 4 }
          text={ title }
        />
      ) : (
        <FadedHeader
          title={ title } 
        >
          <Obstacle className="faded-header__obstacle" />
        </FadedHeader>
      )}
      { paragraphs.map( paragraph => (
        <Paragraph>
          { paragraph }
        </Paragraph>
      ))}
      { imagePath && (
        <LazyImage 
          src={ imagePath }
          alt={ "" }
          height={ 250 }
          placeholder={ <div></div> }
        />
      )}
    </main>
  )
}

const PiecesPage = ( { route } : PageProps ) : JSX.Element => {
  const activePieceIndex = useSelector( selectActivePiece );
  const history = useHistory();

  const handlePieceNavigation : PieceNavigationFunction = ( index : number, event : React.MouseEvent ) : void => {
    history.push( `${ route }/${ index + 1 }` );
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
        imagePath={ 
          activePieceIndex !== null ? pieces[ activePieceIndex ].image : undefined 
        }
        topHeader={ activePieceIndex !== null }
      />
    )
  }

  return (
    <div className="pieces-page" >
      <Suspense fallback={ null }>
        <Switch>
          { /* Piece routes */ }
          { pieces.map( ( piece, index ) => {
            return (
              <Route
                key={ index }
                path={ `${ route }/${ index + 1 }` as string }
              >
                <PieceWrapper
                  pieceIndex={ index }
                  backgroundColorTheme={ piece.colorTheme }
                  showLoadingPage={ true }
                  showOverlay={ true }
                  handlePieceNavigation={ handlePieceNavigation }
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
              onPieceClick={ handlePieceNavigation }
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