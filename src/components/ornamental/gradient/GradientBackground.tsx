import { ColorTheme } from '../../../state/slices/uiSlice';

import './GradientBackground.scss';

const GradientBackground = ( { colorTheme } : { colorTheme : ColorTheme } ) : JSX.Element => {
  return (
    <div className="gradient-background">
      { Object.values( ColorTheme ).map( colorScheme => (
        <div 
          key={ colorScheme }
          className={ 
            `gradient-background__${ colorScheme } ${ colorTheme === colorScheme ? 'gradient-background--active' : '' }` 
          }
        />
      )
      )}
    </div>
  );
};

export default GradientBackground;