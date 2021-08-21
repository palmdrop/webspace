import './Title.scss';

type Props = {
  level : number,
  text : string,
};

const Title = ( { level, text } : Props ) : JSX.Element => {
  const getClasses = () : string => {
    return 'title';
  }

  const createHeadingElement = () : JSX.Element => {
    switch( level ) {
      case 1:  return <h1 className={ getClasses() }> { text } </h1>;
      case 2:  return <h2 className={ getClasses() }> { text } </h2>;
      case 3:  return <h3 className={ getClasses() }> { text } </h3>;
      case 4:  return <h4 className={ getClasses() }> { text } </h4>;
      default: return <h5 className={ getClasses() }> { text } </h5>;
    }
  }

  return createHeadingElement();
}

export default Title
