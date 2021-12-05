import Button from '../../../components/input/button/Button';
import LazyImage from '../../../components/media/image/LazyImage';
import Bar from '../../../components/ornamental/bars/Bar';
import { setActivePiece } from '../../../state/slices/uiSlice';
import { useAppDispatch } from '../../../state/store/hooks';
import { PieceData, PieceNavigationFunction } from '../pieces/pieces';

import './PieceEntry.scss';

type EntryProps = {
  piece : PieceData,
  index : number,
  onClick : PieceNavigationFunction
}

export const PieceEntry = ( { piece, index, onClick } : EntryProps ) : JSX.Element => {
  const dispatch = useAppDispatch();

  const handleHover = () => {
    dispatch( setActivePiece( index ) );
  };

  const handleLeave = () => {
    dispatch( setActivePiece( null ) );
  };

  const handleClick = ( event : React.MouseEvent ) => {
    onClick( piece, index, event );
  }

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
      <Button
        onClick={ handleClick }
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
      </Button>

      <Bar 
        direction='horizontal'
        variant='inset' 
      />
    </div>
  );
};
