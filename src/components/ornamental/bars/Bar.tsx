import './Bar.scss';

type Props = {
  direction : 'vertical' | 'horizontal',
  variant : 'inset' | 'extrude'
};

const Bar = ( { direction, variant } : Props ) => {
  return (
    <div className={ `bar ${ direction } bar--${ variant }` } />
  )
}

export default Bar;
