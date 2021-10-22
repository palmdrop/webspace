import React from 'react'
import { ReactComponent as Star } from '../../../assets/svg/star.svg';

import './StarLoader.scss'

const StarLoader = () : JSX.Element => {
  return (
    <div className="star-loader">
      <Star className="star-loader__star" />
    </div>
  )
}

export default StarLoader

