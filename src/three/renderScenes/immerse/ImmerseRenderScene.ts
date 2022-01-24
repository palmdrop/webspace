import * as THREE from 'three';
import * as dat from 'dat.gui';
import * as TWEEN from '@tweenjs/tween.js';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { AbstractRenderScene } from '../../AbstractRenderScene';
import { VoidCallback } from '../../core';
import { ImmerseGeometryPrefab } from '../../prefabs/geometries';
import { ASSETHANDLER } from '../../systems/AssetHandler';
import { getPostprocessing } from './postprocessing';

// TODO find new, better normal texture
import n1 from '../../../assets/normal/normal-texture1_x4.jpg';
import n2 from '../../../assets/normal/normal-texture2.jpg';
import n3 from '../../../assets/normal/normal-texture3.jpg';
import n4 from '../../../assets/normal/normal-texture4.jpg';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { random, randomElement } from '../../../utils/random';

type MovableObject = THREE.Object3D & {
  velocity ?: THREE.Vector3,
  acceleration ?: THREE.Vector3,
  maxForce ?: number,
  maxSpeed ?: number
};

const normalTextures = [
  n1,
  n2,
  n3,
  n4
];

const tempVector = new THREE.Vector3();


export class EdgePathRenderScene extends AbstractRenderScene {
  private object : MovableObject;

  private mousePosition : THREE.Vector2;
  private tracker : MovableObject;
  
  private shaderPass : ShaderPass;
  private controls ?: TrackballControls;
  private backgroundComposer : EffectComposer;

  private gui : dat.GUI;

  constructor( canvas : HTMLCanvasElement, onLoad : VoidCallback | undefined ) {
    // TODO: 
    /*
      * simple 3d shapes
      * postprocessing pass with warping shader! 3d geometry controls intensity/character of effect
      * think concrete specks of moving patterns, the most pronounced where the shape is
      * a mix of 3d emerging from flat, 2d
      * 
      * TODO: DO I ONLY NEED ONE COMPOSER? SIMPLIFY!
      
      TODO: fast, symmetric movements. Rotating bodies, zooming in and out, etc...
      TODO: make alive by animating add/pow of feedback effect! i.e breathing by animating pow, increasing add to make environment alive! 
      think fast, organic movements. semi-random
    */
    super( canvas, onLoad );

    this.controls = new TrackballControls( this.camera, canvas );
    this.gui = new dat.GUI();

    this.mousePosition = new THREE.Vector2();

    const geometry = 
      ImmerseGeometryPrefab( {
        detail: 128,
        warp: 1.0
      } );

    const material = new THREE.MeshStandardMaterial( {
      color: 'white',
      metalness: 0.6,
      roughness: 0.5,
      dithering: true,
      normalMap: ASSETHANDLER.loadTexture( randomElement( normalTextures ), false ),
      normalScale: new THREE.Vector2(
        random( 0.01, 0.5 ),
        random( 0.01, 0.5 ),
      )
    } );

    this.object = new THREE.Mesh(
      geometry,
      material
    );

    this.object.position.set( 0, 0, 0 );
    this.object.velocity = new THREE.Vector3();
    this.object.acceleration = new THREE.Vector3();
    this.object.maxSpeed = 0.2;
    this.object.maxForce = 0.1;

    this.tracker = new THREE.Mesh(
      ImmerseGeometryPrefab( {
        detail: 10,
        warp: 0.5
      } ),
      material
    );

    this.tracker.position.setFromSpherical( new THREE.Spherical(
      random( 0.04, 0.1 ),
      random( 0.0, Math.PI * 2 ),
      random( 0.0, Math.PI * 2 )
    ) );

    this.tracker.velocity = new THREE.Vector3();
    this.tracker.acceleration = new THREE.Vector3();

    this.tracker.scale.set( 0.4, 0.4, 0.4 );

    const dirLight1 = new THREE.DirectionalLight( '#ff0000', 5.0 );
    dirLight1.position.set( 1, 1, 1 );

    const dirLight2 = new THREE.DirectionalLight( '#00ff00', 5.0 );
    dirLight2.position.set( -1, -1, -2 );

    const ambientLight = new THREE.AmbientLight( 'white', 0.4 );

    this.scene.add( 
      this.object, 
      this.tracker,
      dirLight1, 
      dirLight2, 
      ambientLight 
    );

    // Postprocessing
    const { 
      composer, 
      shaderPass,
      backgroundComposer
    } = getPostprocessing(
      this.renderer, this.scene, this.camera,
      this.gui,
    );

    this.composer = composer;
    this.backgroundComposer = backgroundComposer;
    this.shaderPass = shaderPass;

    this.resizeables.push( this.backgroundComposer );

    this.setCaptureFrameResolutionMultiplier( 4 );

    ASSETHANDLER.onLoad( undefined, () => {
      onLoad?.();
    } );
  }

  update( delta : number, now : number ) : void {
    this.object.visible = true;
    this.tracker.visible = true;
    this.backgroundComposer.render( delta );
    this.backgroundComposer.swapBuffers();
    this.object.visible = false;
    this.tracker.visible = false;

    this.shaderPass.uniforms[ 'time' ].value = now;

    this.controls?.update();

    /*
    this.object.rotation.x += this.rotationSpeed.x;
    this.object.rotation.y += this.rotationSpeed.y;
    this.object.rotation.z += this.rotationSpeed.z;
    */

    // TWEEN.update( delta );
    TWEEN.update();

    this._updateTracker( delta );
  }

  _updateTracker( delta : number ) {
    tempVector.set(
      this.mousePosition.x,
      this.mousePosition.y,
      0.5 
    );
    tempVector.unproject( this.camera );
    tempVector.sub( this.camera.position ).normalize();

    const z = 0.0; // Make changable on zoom?
    const distance = ( z - this.camera.position.z ) / tempVector.z;

    const trackerGoal = this.camera.position.clone()
      .add( tempVector.multiplyScalar( distance ) );

    const diff = tempVector.copy( trackerGoal ).sub( this.tracker.position );
    
    this.tracker.position.lerp( 
      trackerGoal, 
      2.0 * delta
    );

    // TODO add random movement as well!

    this.tracker.rotation.x += diff.x * delta;
    this.tracker.rotation.y += diff.y * delta;
    this.tracker.rotation.z += diff.z * delta;
  }

  onMouseMove( x : number, y : number ) {
    const screenX = ( x / this.canvas.clientWidth ) * 2.0 - 1;
    const screenY = -( y / this.canvas.clientHeight ) * 2.0 + 1;
    this.mousePosition.set( screenX, screenY );
  }

  dispose() {
    this.gui.destroy();
  }
}