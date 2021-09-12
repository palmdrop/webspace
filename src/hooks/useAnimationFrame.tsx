import { useEffect, useRef } from "react"

type AnimationCallback = (
  delta : number,
  now : number
) => void;

export const useAnimationFrame = ( callback : AnimationCallback ) => {
  const animationIdRef = useRef<number>( -1 );
  const previousTimeRef = useRef<number>( 0 );

  const animate = ( time : number ) => {
    // Convert to seconds
    const now = time * 0.001;
    const delta = now - previousTimeRef.current;

    callback( delta, now );

    previousTimeRef.current = now;
    animationIdRef.current = requestAnimationFrame( animate );
  }

  useEffect( () => {
    animationIdRef.current = requestAnimationFrame( animate );
    return () => cancelAnimationFrame( animationIdRef.current );
  }, []);
}