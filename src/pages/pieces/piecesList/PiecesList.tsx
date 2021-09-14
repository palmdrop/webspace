import React, { useRef, useState } from "react";
import { useHistory } from "react-router";
import Button from "../../../components/input/button/Button";
import { useAnimationFrame } from "../../../hooks/useAnimationFrame";
import { useMousePosition } from "../../../hooks/useMousePosition";
import { setActivePiece } from "../../../state/slices/uiSlice";
import { useAppDispatch } from "../../../state/store/hooks";
import { insideRect } from "../../../utils/geometry";
import { PieceData } from "../pieces/pieces";

import './PiecesList.scss';

type PieceClickCallback = ( piece : PieceData, index : number, event : React.MouseEvent ) => void;

type EntryProps = {
  piece : PieceData,
  index : number,
  onClick : PieceClickCallback
}

export const PieceEntry = ( { piece, index, onClick } : EntryProps ) : JSX.Element => {
  const dispatch = useAppDispatch();

  const handleHover = ( event : React.MouseEvent ) => {
    dispatch( setActivePiece( index ) );
  }

  const handleLeave = ( event : React.MouseEvent ) => {
    dispatch( setActivePiece( null ) );
  }

  const handleClick = ( event : React.MouseEvent ) => {
    onClick( piece, index, event );
  }

  return (
    <div className="piece-entry"
      onMouseEnter={ handleHover }
      onMouseLeave={ handleLeave }
    >
      <div className="piece-entry__tags">
        { piece.tags.map( ( tag, index ) => {
          let tagText = tag;
          if( index !== piece.tags.length - 1 ) {
            tagText += ','
          }

          return (
            <Button 
              key={ `${ tag }` }
            >
              { tagText }
            </Button>
          )
        })}
      </div>
      <Button
        onClick={ handleClick }
      >
        { `${ index + 1 }. ${ piece.name }` }
      </Button>
    </div>
  )
}

const scrollSpeed = 400.0;
const scrollFriction = 0.016;
const scrollEdgeDamping = 30;
const scrollThresholdSpeed = 1.0;

const scrollMaxSpeed = 1500.0;

const mousePlateau = 0.4;
const mouseScrollSpeed = 0.04;

type ListProps = {
  pieces : PieceData[],
  onPieceClick : PieceClickCallback
}

export const PiecesList = ( { pieces, onPieceClick } : ListProps ) : JSX.Element => {
  const mainContainerRef = useRef<HTMLDivElement>( null );
  const scrollVelocity = useRef( 0 );
  const scrollAcceleration = useRef( 0 );
  const [ scrollAmount, setScrollAmount ] = useState( window.innerWidth / 3.0 );

  const mousePosition = useMousePosition( mainContainerRef.current );

  const [ pieceEntries, ] = useState<JSX.Element[]>( () => 
    pieces.map( ( piece, index ) => (
      <PieceEntry 
        key={ `${ piece.name }-${ index + 1 }` }
        piece={ piece } 
        index={ index }
        onClick={ onPieceClick }
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
