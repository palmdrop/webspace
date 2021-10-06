import React, { useState } from 'react';
import useUUID from '../../../hooks/useUUID';

import './TextInputArea.scss';

type Props = {
  label? : string | JSX.Element,
  name : string,
  defaultValue? : string,
  onChange? : ( value : string ) => void,
}

const TextInputArea = ( { label, name, defaultValue, onChange } : Props ) => {
  const uuid = useUUID();
  const [ value, setValue ] = useState( defaultValue ?? "" );

  const handleChange = ( event : React.ChangeEvent<HTMLTextAreaElement> ) => {
    event.preventDefault();
    const value = event.target.value;
    setValue( value );
    onChange?.( value );
  }

  return (
    <div className="text-input-area">
      { label && (
        <label
          className="text-input-area__label"
          htmlFor={ uuid }
        >
          { label }
        </label>
      ) }
      <textarea
        className="text-input-area__input"
        id={ uuid }
        value={ value }
        name={ name }
        onChange={ handleChange }
      >
      </textarea>
    </div>
  )
}

export default TextInputArea