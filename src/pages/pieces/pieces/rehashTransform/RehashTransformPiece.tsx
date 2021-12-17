import { useCallback, useMemo, useState } from 'react';
import AnimationCanvas from '../../../../components/canvas/AnimationCanvas';
import { RehashTransformRenderScene } from '../../../../three/renderScenes/rehashTransform/RehashTransformRenderScene';
import { PieceProps } from '../pieces';

import '../pieces.scss';
import './RehashTransformPiece.scss';

export default ( { onLoad } : PieceProps ) => {
  const [ renderScene, setRenderScene ] = useState<RehashTransformRenderScene | undefined>();

  const renderSceneCallback = useCallback( ( renderScene : RehashTransformRenderScene ) => {
    setRenderScene( renderScene );
  }, [] );

  const onImageSelected = ( event : React.ChangeEvent<HTMLInputElement> ) => {
    if( !event.target.files ) return;

    const imageData = event.target.files[ 0 ];
    if ( !imageData ) return;

    const reader = new FileReader();
    reader.readAsDataURL( imageData );
    reader.onloadend = () => {
      renderScene?.updateTexture( reader.result as string );
    };
  };


  const canvasElement = useMemo( () => (
    <AnimationCanvas 
      renderSceneConstructor={ RehashTransformRenderScene }
      renderSceneCallback={ renderSceneCallback }
      onLoad={ onLoad }
    />
  ), [ renderSceneCallback, onLoad ] );

  return (
    <div className="piece">
      { canvasElement }
      <div className='piece__settings-panel'>
        <label
          htmlFor="image_chooser"
        >
          Choose image
        </label>
        <input 
          type="file"
          accept="image/png, image/jpg, image/jpeg"
          name="user[image]"
          multiple={ false }
          id="image_chooser"
          onChange={ onImageSelected } 
        />
      </div>
    </div>
  );
};