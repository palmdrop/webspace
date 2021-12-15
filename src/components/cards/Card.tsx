import './Card.scss';

type Props = {
  additionalClasses ?: string,
  children : React.ReactChild | React.ReactChild[] | Element[]
};

const Card = ( { additionalClasses = '', children } : Props ) => {
  return (
    <div 
      className={ `card ${ additionalClasses }` }>
      { children } 
    </div>
  );
};

export default Card;
