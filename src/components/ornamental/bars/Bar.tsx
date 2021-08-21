import './Bar.scss';

type Props = {
  variant : 'inset' | 'extrude'
};

const Bar = ( { variant } : Props ) => {
  return (
    <div className={ `bar bar--${variant}` } />
  )
}

export default Bar;
