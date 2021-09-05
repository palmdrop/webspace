import * as THREE from 'three';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';

import { AnimationLoop, RenderScene, Resizer } from "./core";
import { SimpleAnimationLoop } from './systems/AnimationLoop';
import { SimpleResizer } from './systems/Resizer';

export abstract class AbstractRenderScene implements RenderScene {
  canvas : HTMLCanvasElement;
  protected loop : AnimationLoop;
  protected resizer : Resizer;

  protected renderer : THREE.WebGLRenderer;
  protected scene : THREE.Scene;
  protected camera : THREE.PerspectiveCamera;

  protected composer? : EffectComposer;

  constructor( canvas : HTMLCanvasElement ) {
    this.canvas = canvas;
    this.loop = this.createLoop();

    this.renderer = this.createRenderer();
    this.scene = this.createScene();
    this.camera = this.createCamera();
    this.resizer = this.createResizer();
  }

  private createLoop() : AnimationLoop {
    return new SimpleAnimationLoop( ( now : number, delta : number ) : void => {
      this.update( now, delta );
      this.render( now, delta );
    });
  }

  private createRenderer() : THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer( {
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });

    renderer.setClearColor( new THREE.Color( '#000000' ), 0.0 );

    renderer.physicallyCorrectLights = true;
    renderer.toneMapping = THREE.LinearToneMapping;

    renderer.setPixelRatio( window.devicePixelRatio );

    return renderer;
  }

  private createScene() : THREE.Scene {
    const scene = new THREE.Scene();

    return scene;
  }

  private createCamera() : THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(
      75,
      this.canvas.width / this.canvas.height,
      0.1,
      50 
    );

    camera.position.set( 0, 0, 6 );

    return camera;
  }

  private createResizer() : Resizer {
    return new SimpleResizer( this.canvas, this.camera, this.renderer );
  }

  render( delta : number, now : number ): void {
    if( this.composer ) {
      this.composer.render( delta );
    } else {
      this.renderer.render( this.scene, this.camera );
    }
  }

  abstract update( delta : number, now : number ): void;

  resize(): void {
    this.resizer.resize( ( width : number, height : number ) => {
      this.composer?.setSize( width, height );
    });
  }

  start(): void {
    this.loop.start();
  }

  stop(): void {
    this.loop.stop();
  }

}