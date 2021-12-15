import { useState } from 'react';
import { generateUUID } from '../utils/general';

const useUUID = () => {
  const [ uuid ] = useState( () => generateUUID() );
  return uuid;
};

export default useUUID;