import React, { useEffect, useRef, useState } from 'react';

import './Modal.scss';

enum State {
  Opening = 'opening',
  Open = 'open',
  Closing = 'closing',
  Closed = 'closed'
}

type Props = {
  open : boolean,
  onChangeCompleted : ( isOpen : boolean ) => void,
  transitionTime ?: number,
  blockEvents ?: boolean,
  children : React.ReactNode,
}

const Modal = ( { 
  open, 
  onChangeCompleted,
  transitionTime = 300,
  blockEvents = true,
  children,
} : Props ) => {
  const rootRef = useRef<HTMLDivElement>( null );
  const timerRef = useRef<NodeJS.Timeout | null>( null );
  const [ state, setState ] = useState<State>( State.Closed );

  const changeState = ( newState : State.Opening | State.Closing ) => {
    setState( newState );

    timerRef.current && clearTimeout( timerRef.current );

    timerRef.current = setTimeout( () => {
      setState( newState === State.Opening ? State.Open : State.Closed );
      onChangeCompleted( newState === State.Opening );
    }, transitionTime );
  };

  useEffect( () => {
    changeState( open ? State.Opening : State.Closing );

    if( open ) {
      const handleKeyPress = ( e : KeyboardEvent ) => {
        if( e.key === 'Escape' ) {
          changeState( State.Closing );
        }
      };

      window.addEventListener( 'keydown', handleKeyPress );

      return () => {
        window.removeEventListener( 'keydown', handleKeyPress );
      };
    }
  }, [ open ] );

  useEffect( () => {
    const onPress = ( event : MouseEvent | TouchEvent ) => {
      // Clicked outside
      if( rootRef && !rootRef.current?.contains( event.target as Node ) ) {
        changeState( State.Closing );
      }
    };

    if( state === State.Open ) {
      window.addEventListener( 'mousedown', onPress );
      window.addEventListener( 'touchstart', onPress );

      return () => {
        window.removeEventListener( 'mousedown', onPress );
        window.removeEventListener( 'touchstart', onPress );
      };
    }
  }, [ state ] );

  return ( <>
    { blockEvents && state === State.Open && <div className="blocker" /> }
    <div 
      ref={ rootRef }
      className={`modal modal--${ state }`}
    >
      { children }
    </div>
  </> );
};

export default Modal;
