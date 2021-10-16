import { useMemo } from "react";
import debounce from "lodash.debounce";

export const useMemoizedDebounce = <T extends ( ...args : any[] ) => any>( 
  callback : T,
  wait : number,
  dependencyList : React.DependencyList,
) => useMemo( 
  () => debounce( callback, wait ), 
  [ ...dependencyList, callback, wait ]
);