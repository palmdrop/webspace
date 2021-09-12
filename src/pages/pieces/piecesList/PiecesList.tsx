import React, { useRef, useState } from "react";
import Button from "../../../components/input/button/Button";
import { useAnimationFrame } from "../../../hooks/useAnimationFrame";
import { useMousePosition } from "../../../hooks/useMousePosition";
import { setActivePiece } from "../../../state/slices/uiSlice";
import { useAppDispatch } from "../../../state/store/hooks";
import { insideRect } from "../../../utils/geometry";
import { Piece } from "../content";

import './PiecesList.scss';

const scrollSpeed = 400.0;
const scrollFriction = 0.016;
const scrollEdgeDamping = 30;
const scrollThresholdSpeed = 1.0;

const scrollMaxSpeed = 1500.0;

const mousePlateau = 0.4;
const mouseScrollSpeed = 0.04;

export const PieceEntry = ( { piece } : { piece : Piece } ) : JSX.Element => {
  const dispatch = useAppDispatch();

  const handleHover = ( event : React.MouseEvent ) => {

    dispatch( setActivePiece( piece.index ) );
  }

  const handleLeave = ( event : React.MouseEvent ) => {
    dispatch( setActivePiece( null ) );
  }

  const handleClick = ( event : React.MouseEvent ) => {
    
  }


  return (
    <div className="piece-entry"
      onMouseEnter={ handleHover }
      onMouseLeave={ handleLeave }
    >
      <div className="piece-entry__tags">
        { piece.tags.map( tag => (
          <Button 
            key={ `${ tag }` }
          >
            { tag }
          </Button>
        ))}
      </div>
      <Button
        onClick={ handleClick }
      >
        { `${ piece.index + 1 }. ${ piece.name }` }
      </Button>
    </div>
  )
}

export const PiecesList = ( { pieces } : { pieces : Piece[] } ) : JSX.Element => {
  const mainContainerRef = useRef<HTMLDivElement>( null );
  const scrollVelocity = useRef( 0 );
  const scrollAcceleration = useRef( 0 );
  const [ scrollAmount, setScrollAmount ] = useState( window.innerWidth / 3.0 );

  const mousePosition = useMousePosition( mainContainerRef.current );

  const [ pieceEntries, ] = useState<JSX.Element[]>( () => 
    pieces.map( piece => (
      <PieceEntry 
        key={ `${ piece.name }-${ piece.index }` }
        piece={ piece } 
      />
    ))
  );

  const handleScroll = ( event : React.WheelEvent<HTMLDivElement> ) => {
    scrollAcceleration.current = scrollSpeed * Math.sign( -event.deltaY );
  }

  useAnimationFrame( ( delta, now ) => {
    const applyAcceleration = () => {
      scrollVelocity.current += scrollAcceleration.current;        
    }

    const resetAcceleration = () => {
      scrollAcceleration.current = 0.0;
    }

    setScrollAmount( scrollAmount => {
      if( !mainContainerRef.current ) return scrollAmount;

      const windowWidth = window.innerWidth;
      const containerRect = mainContainerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const scrollEdgeOffset = window.innerWidth / 3.0;
      
      const leftOffset = Math.max( scrollAmount - scrollEdgeOffset, 0.0 );
      const rightOffset = Math.max( ( -scrollAmount + windowWidth - containerWidth ) - scrollEdgeOffset, 0.0 );

      if( !scrollAcceleration.current && insideRect( mousePosition, containerRect ) ) {

        if( mousePosition.x < ( windowWidth * ( 1.0 - mousePlateau ) / 2.0 ) ) {

          const amount = 1.0 - leftOffset / scrollEdgeOffset;

          const mouseOffset = mousePosition.x - ( windowWidth * ( 1.0 - mousePlateau ) / 2.0 );
          scrollVelocity.current -= amount * amount * mouseScrollSpeed * mouseOffset;

        } else if( mousePosition.x > ( windowWidth - windowWidth * ( 1.0 - mousePlateau ) / 2.0 ) ) {
          const amount = 1.0 - rightOffset / scrollEdgeOffset;
          
          const mouseOffset = mousePosition.x - ( windowWidth - windowWidth * ( 1.0 - mousePlateau ) / 2.0 );
          scrollVelocity.current -= amount * mouseScrollSpeed * mouseOffset;
        }
      }

      if( leftOffset > 0.0 ) {
        scrollVelocity.current -= leftOffset * scrollSpeed * delta / scrollEdgeDamping;

        if( scrollAcceleration.current < 0.0 ) {
          applyAcceleration();
        }

      } else if( containerWidth && rightOffset > 0.0 ) {
        scrollVelocity.current += rightOffset * scrollSpeed * delta / scrollEdgeDamping;

        if( scrollAcceleration.current > 0.0 ) {
          applyAcceleration();
        }
      } else if( scrollAcceleration.current !== 0 ) {
        applyAcceleration();
      }

      resetAcceleration();

      if( Math.abs( scrollVelocity.current ) < scrollThresholdSpeed ) {
        scrollVelocity.current = 0.0;
        return scrollAmount;
      }

      scrollVelocity.current *= 1.0 - scrollFriction;

      if( scrollVelocity.current > scrollMaxSpeed ) scrollVelocity.current = scrollMaxSpeed;
      if( scrollVelocity.current < -scrollMaxSpeed ) scrollVelocity.current = -scrollMaxSpeed;

      return scrollAmount + delta * scrollVelocity.current;
    })
  });

  return (
    <div 
      className="pieces-list"
      onWheel={ handleScroll }
    >

      <div 
        ref={ mainContainerRef }
        style={ {
          left: `${ scrollAmount }px`
        }}
      >
        { pieceEntries }
      </div>
    </div>
  )
}
