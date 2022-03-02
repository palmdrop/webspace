import { Link } from 'react-router-dom';
import { PageRoute } from '../../../App';
import Button from '../../../components/input/button/Button';
import LazyImage from '../../../components/media/image/LazyImage';
import Bar from '../../../components/ornamental/bars/Bar';
import Paragraph from '../../../components/paragraph/Paragraph';
import { setActivePiece } from '../../../state/slices/uiSlice';
import { useAppDispatch } from '../../../state/store/hooks';
import { nameToPath } from '../../../utils/general';
import { PieceData } from '../pieces/pieces';

import './PieceEntry.scss';

type EntryProps = {
  piece : PieceData,
  baseRoute : PageRoute,
  index : number,
}

export const PieceEntry = ( { piece, baseRoute, index } : EntryProps ) : JSX.Element => {
  const linkPath = `${ baseRoute }/${ nameToPath( piece.name ) }`;

  const dispatch = useAppDispatch();

  const handleHover = () => {
    dispatch( setActivePiece( index ) );
  };

  const handleLeave = () => {
    dispatch( setActivePiece( null ) );
  };

  return (
    <div className="piece-entry"
      onMouseEnter={ handleHover }
      onMouseLeave={ handleLeave }
    >
      { /*
        <div className="piece-entry__tags">
          { piece.tags.map( ( tag, index ) => {
            let tagText = tag;
            if( index !== piece.tags.length - 1 ) {
              tagText += ',';
            }

            return (
              <Button 
                key={ `${ tag }` }
              >
                { tagText }
              </Button>
            );
          } )}
        </div>
        */ }
      <div
        className="piece-entry__container"
      >
        <div>
          <Link to={ linkPath }>
            <h2>{ `${ index + 1 }. ${ piece.name }` }</h2>
          </Link> 
          { typeof piece.description[ 0 ] === 'string' ? (
            <Paragraph>
              { piece.description[ 0 ] }
            </Paragraph>
          ) : (
            piece.description[ 0 ]
          )}
        </div>

        { piece.image && (
          <Link to={ linkPath }>
            <LazyImage 
              src={ piece.image }
              alt={ '' }
              height={ 230 }
              placeholder={ <div></div> }
            />
          </Link>
        )}
      </div>

      <Bar 
        direction='horizontal'
        variant='inset' 
      />
    </div>
  );
};
