
import Bar from './Bar';
import './Bars.scss';

type Props = {
  amount: number,
  first?: 'inset' | 'extrude'
}

const Bars = ( { amount, first = 'extrude' } : Props ) : JSX.Element => {

  const createBars = () : JSX.Element[] => {
    const bars : JSX.Element[] = []; 

    for( let i = 0; i < amount; i++ ) {
      const variant = 
        // Will be true on even indexes if first == 'extrude', 
        // and true on odd indexes if first == 'inset'
        ( i % 2 === 0 ) === ( first === 'extrude' ) 
        ? 'extrude' 
        : 'inset';

      bars.push(
        <Bar 
          key={i}
          variant={ variant } 
        />
      );
    }

    return bars;
  };

  return (
    <div className="bars">
      { createBars() }
    </div>
  )
}

export default Bars;
