import React from 'react';
import SoftDisk from '../../ornamental/disk/soft/SoftDisk';

import './SubmitInput.scss';

type Props = {
  text : string,
};

const SubmitInput = ( { text } : Props ) : JSX.Element => {
  return (
    <div className="submit-input">
      <SoftDisk />
      <input 
        type="submit" 
        value={ text }
      />
    </div>
  );
};

export default SubmitInput;