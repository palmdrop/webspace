import React, { useState } from 'react'
import Button from '../../../../components/input/button/Button';
import Modal from '../../../../components/modal/Modal'
import SoftDisk from '../../../../components/ornamental/disk/soft/SoftDisk';
import Paragraph from '../../../../components/paragraph/Paragraph';
import Title from '../../../../components/title/Title';

import { ReactComponent as CloseIcon } from '../../../../assets/svg/close.svg';

import './InfoModal.scss'

const InfoModal = ( { } ) => {
  const [ active, setActive ] = useState<boolean>( false );

  return (
    <div className="info-modal">
      <SoftDisk />
      <Button
        onClick={ () => setActive( !active ) }
      >
        ?
      </Button>
      <Modal
        open={ active }
        onChangeCompleted={ ( isOpen : boolean ) => setActive( isOpen ) }
        transitionTime={ 300 }
      >
        <Button 
          additionalClasses="info-modal__close-button" 
          onClick={() => setActive( false )}
        >
          <CloseIcon className="info-modal__close-icon" />
        </Button>
        <Title
          level={ 1 }
          text="[navigating] mind fog"
        />
        <Paragraph>
          By Palmdrop. I'm a person living on the internet, trying my best to occassionally think about things, and write my thoughts down. 
          This blog is a slightly polished thought-dump. I write mostly for myself. My thoughts tend to revolve around art, culture, the internet, 
          and politics. Welcome.
        </Paragraph>
      </Modal>
    </div>
  )
}

export default InfoModal
