/* Constants */
export const MILLI_SECONDS_PER_SECOND = 1000;

/* Type definitions */
export type VoidCallback = () => void;
export type AnimationCallback = ( delta : number, now : number ) => void;
export type ResizeCallback = ( width : number, height : number ) => void;

export interface AnimationLoop {
  start() : void;
  stop() : void;
}

export interface Resizer {
  resize( callback? : ResizeCallback ) : void;
}


export interface RenderScene extends AnimationLoop {

  canvas : HTMLCanvasElement;
  onLoad? : VoidCallback;

  render( delta : number, now : number ) : void;
  update( delta : number, now : number ) : void;

  resize() : void;
}

export type RenderSceneConstructor<T extends RenderScene> = 
  new( canvas : HTMLCanvasElement, onLoad? : VoidCallback ) => T;
  

/* Helper functions */
export const createRenderScene = <T extends RenderScene>( 
  renderSceneConstructor : RenderSceneConstructor<T>, 
  canvas : HTMLCanvasElement,
  onLoad? : VoidCallback
) : T => {
  return new renderSceneConstructor( canvas, onLoad );
}