import React from 'react';
import Card from '../Card';

import './GlassCard.scss';

type Props = {
  children : React.ReactChild | React.ReactChild[] | Element[]
};

// TODO: backdrop-blur is not supported by default in firefox... find alternative
const GlassCard = ( { children } : Props ) : JSX.Element => {
  return (
    <Card additionalClasses="glass-card">
      { children }
    </Card>
  );
};

export default GlassCard;
