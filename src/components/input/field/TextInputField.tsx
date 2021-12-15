import React, { useState } from 'react';
import useUUID from '../../../hooks/useUUID';

import './TextInputField.scss';

type Props = {
  label ?: string | JSX.Element,
  name : string,
  defaultValue ?: string,
  onChange ?: ( value : string ) => void,
}

const InputField = ( { label, name, defaultValue, onChange } : Props ) : JSX.Element => {
  const uuid = useUUID();
  const [ value, setValue ] = useState( defaultValue ?? '' );

  const handleChange = ( event : React.ChangeEvent<HTMLInputElement> ) => {
    event.preventDefault();
    const value = event.target.value;
    setValue( value );
    onChange?.( value );
  };

  return (
    <div className="text-input-field">
      { label && (
        <label
          className="text-input-field__label"
          htmlFor={ uuid }
        >
          { label }
        </label>
      ) }
      <input 
        className="text-input-field__input"
        type="text"
        id={ uuid }
        value={ value }
        name={ name }
        onChange={ handleChange }
      />
    </div>
  );
};

export default InputField;