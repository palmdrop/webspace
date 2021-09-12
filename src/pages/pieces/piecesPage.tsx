import React from 'react'
import { useSelector } from 'react-redux';
import FadedHeader from '../../components/header/faded/FadedHeader';
import Paragraph from '../../components/paragraph/Paragraph';
import { selectActivePiece } from '../../state/slices/uiSlice';
import { pieces } from './content';
import { PiecesList } from './piecesList/PiecesList';

import { ReactComponent as Obstacle } from '../../assets/svg/obstacle4.svg';

import { introduction } from './content';

import './piecesPage.scss';
import Header from '../../components/header/Header';
import { PageRoute } from '../../App';
import HomeBar from '../../components/navigation/home/HomeBar';

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

const PiecesPage = () : JSX.Element => {
  const activePieceIndex = useSelector( selectActivePiece );

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
    );
  }

  return (
    <div className="pieces-page" >
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
      />

      <aside className="pieces-page__aside">
        <HomeBar />
      </aside>
    </div>
  )
}

export default PiecesPage;