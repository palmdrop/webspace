import { useEffect, useRef, useState } from "react"

export const useMousePosition = ( domElement : HTMLElement | null ) : { x : number, y : number }=> {
  const mousePosition = useRef( { x : 0, y : 0 } );

  const handleMouseMove = ( event : MouseEvent ) : void => {
    mousePosition.current.x = event.clientX;
    mousePosition.current.y = event.clientY;
  }

  useEffect( () => {
    const target = window;

    target.addEventListener( 'mousemove', handleMouseMove );
    return () => window.removeEventListener( 'mousemove', handleMouseMove );
  }, []);

  return mousePosition.current;
}