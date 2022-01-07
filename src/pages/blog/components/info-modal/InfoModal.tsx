/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react';
import Button from '../../../../components/input/button/Button';
import Modal from '../../../../components/modal/Modal';
import SoftDisk from '../../../../components/ornamental/disk/soft/SoftDisk';
import Paragraph from '../../../../components/paragraph/Paragraph';
import Title from '../../../../components/title/Title';

import { ReactComponent as CloseIcon } from '../../../../assets/svg/close.svg';

import './InfoModal.scss';
import { PageRoute } from '../../../../App';
import { Link } from 'react-router-dom';

const InfoModal = () => {
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
          A blog by palmdrop. Intended to be my more or less polished thought-dump. Posts may vary in length, quality and content. 
        </Paragraph>
        <Paragraph>
          I believe in learning in public, and I want to rid myself of the fear of criticism. I also want to force myself to think. Therefore this blog. At least it was a good attempt?
        </Paragraph>
        <Paragraph>
          <Link 
            to={PageRoute.self}
            className='about-link'
          >More about me.</Link>
        </Paragraph>
      </Modal>
    </div>
  );
};

export default InfoModal;
