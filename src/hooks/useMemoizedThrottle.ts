import { useMemo } from "react";
import throttle from "lodash.throttle";

export const useMemoizedThrottle = <T extends ( ...args : any[] ) => any>( 
  callback : T,
  wait : number,
  dependencyList : React.DependencyList,
) => useMemo( 
  () => throttle( callback, wait ), 
  [ ...dependencyList, callback, wait ]
);