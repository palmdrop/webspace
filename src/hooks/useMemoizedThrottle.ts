import { useMemo } from 'react';
import throttle from 'lodash.throttle';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useMemoizedThrottle = <T extends ( ...args : any[] ) => any>( 
  callback : T,
  wait : number,
  dependencyList : React.DependencyList,
) => useMemo( 
    () => throttle( callback, wait ), 
    [ ...dependencyList, callback, wait ]
  );