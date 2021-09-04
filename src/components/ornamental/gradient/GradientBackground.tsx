import { ColorScheme, selectColorScheme } from '../../../state/slices/uiSlice';
import { useAppSelector } from '../../../state/store/hooks';

import './GradientBackground.scss';

const GradientBackground = () : JSX.Element => {
  const activeColorScheme = useAppSelector( selectColorScheme );

  return (
    <div className="gradient-background">
    { Object.values( ColorScheme ).map( colorScheme => (
        <div 
          key={ colorScheme }
          className={ 
            `gradient-background__${ colorScheme } ${ activeColorScheme === colorScheme ? 'gradient-background--active' : '' }` 
          }
        />
      )
    )}
    </div>
  )
}

export default GradientBackground;