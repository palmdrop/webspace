import { v4 as uuidv4 } from 'uuid';

export const generateUUID = () => uuidv4();

export const noop = () => { return; };

export const nameToPath = ( name : string ) => {
  return name.replaceAll( ' ', '-' ).trim().toLowerCase();
};
