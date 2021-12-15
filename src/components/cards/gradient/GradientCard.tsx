import React from 'react';
import Card from '../Card';

import './GradientCard.scss';

type Props = {
  children : React.ReactChild | React.ReactChild[]
};

const GradientCard = ( { children } : Props ) => {
  return (
    <Card additionalClasses="gradient-card" >
      { children }
    </Card>
  );
};

export default GradientCard;