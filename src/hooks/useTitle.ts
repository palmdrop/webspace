import { useEffect } from 'react';

const PAGE_TITLE = process.env.REACT_APP_PAGE_TITLE;

export const useTitle = ( title : string | undefined ) => {
  useEffect( () => {
    if( !title ) return;

    const fullTitle = PAGE_TITLE ? `${ title } - ${ PAGE_TITLE }` : title;

    const previousTitle = document.title;
    document.title = fullTitle;

    return () => {
      document.title = previousTitle;
    };
  }, [ title ] );
};
