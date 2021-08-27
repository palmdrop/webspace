import './NoiseBackground.scss';

type Props = {
  opacity? : number
}

const NoiseBackground = ( { opacity = 0.3 } : Props ) : JSX.Element => {
  return (
    <div 
      className="noise-background" 
      style={ {
        opacity: opacity
      }}
    />
  )
}

export default NoiseBackground;
