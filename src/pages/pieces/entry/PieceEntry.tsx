import { Link } from 'react-router-dom';
import { PageRoute } from '../../../App';
import Button from '../../../components/input/button/Button';
import LazyImage from '../../../components/media/image/LazyImage';
import Bar from '../../../components/ornamental/bars/Bar';
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
      { 
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
      }
      <Link
        className="piece-entry__link"
        to={ `${ baseRoute }/${ nameToPath( piece.name ) }` }
      >
        <>
          { `${ index + 1 }. ${ piece.name }` }

          { piece.image && (
            <LazyImage 
              src={ piece.image }
              alt={ '' }
              height={ 200 }
              placeholder={ <div></div> }
            />
          )}
        </>
      </Link>

      <Bar 
        direction='horizontal'
        variant='inset' 
      />
    </div>
  );
};
