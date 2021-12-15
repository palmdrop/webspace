import { PageProps } from '../PageWrapper';
import { useNavBar } from '../../components/navigation/navbar/NavBar';
import MainHeader from './header/MainHeader';
import MainFooter from './footer/MainFooter';
import Paragraph from '../../components/paragraph/Paragraph';

import PieceWrapper from '../pieces/wrapper/PieceWrapper';
import { FeaturedPieceIndex } from '../pieces/pieces/pieces';

import { description } from './content';

import './mainPage.scss';

const MainPage = ( { route } : PageProps ) : JSX.Element => {
  const navBar = useNavBar( route );

  return (
    <div  
      className="main-page"
    >
      <MainHeader />

      <div className="main-page__info">
        { description.map( ( paragraph, index ) => (
          <Paragraph key={ `description-${ index }` }>
            { paragraph }
          </Paragraph>
        ) )}
      </div>

      { navBar }

      <PieceWrapper 
        pieceIndex={ FeaturedPieceIndex }
      />

      <MainFooter />
    </div>
  );
};

export default MainPage;
