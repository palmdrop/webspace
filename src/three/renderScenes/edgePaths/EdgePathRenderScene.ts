import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { AbstractRenderScene } from '../../AbstractRenderScene';
import { VoidCallback } from '../../core';
import { SolarChromeGeometryPrefab } from '../../prefabs/geometries';
import { ASSETHANDLER } from '../../systems/AssetHandler';
import { getPostprocessing } from './postprocessing';

// TODO find new, better normal texture
import n1 from '../../../assets/normal/normal-texture1_x4.jpg';
import n2 from '../../../assets/normal/normal-texture2.jpg';
import n3 from '../../../assets/normal/normal-texture3.jpg';
import n4 from '../../../assets/normal/normal-texture4.jpg';
import { randomElement } from '../../../utils/random';

const normalTextures = [
  n1,
  n2,
  n3,
  n4
];

export class EdgePathRenderScene extends AbstractRenderScene {
  private object : THREE.Object3D;
  
  private shaderPass : ShaderPass;
  private controls ?: TrackballControls;

  constructor( canvas : HTMLCanvasElement, onLoad : VoidCallback | undefined ) {
    // TODO: 
    /*
      * simple 3d shapes
      * postprocessing pass with warping shader! 3d geometry controls intensity/character of effect
      * think concrete specks of moving patterns, the most pronounced where the shape is
      * a mix of 3d emerging from flat, 2d
      
      * combine with recursive pixelation shader
      * or blur shader
      * 
      * TODO: try domain warp ONLY in z-direction! what happens?
      * TODO MAKE SURE I ACTUALLY GOT 3D CONTROL WHEN SAMPLING TEXTURE USING UV!? AM I IN UV MODE?
      * CAN UV MODEL DISTORT IN 3D STILL?
    */
    super( canvas, onLoad );

    this.scene.background = new THREE.Color( 'black' );
    this.controls = new TrackballControls( this.camera, canvas );

    // TODO create clone of object, add to separate scene, create blur background shader, add to background, use for controlling shader
    this.object = new THREE.Mesh(
      // new THREE.BoxBufferGeometry( 3, 3, 3 ),
      SolarChromeGeometryPrefab( {} ),
      // new THREE.MeshBasicMaterial( { color: 'red' } )
      new THREE.MeshStandardMaterial( {
        color: 'white',
        metalness: 0.6,
        roughness: 0.5,
        dithering: true,
        normalMap: ASSETHANDLER.loadTexture( randomElement( normalTextures ), false ),
        normalScale: new THREE.Vector2(
          1.0, 1.0
        )
      } )
    );

    this.object.position.set( 
      0, 0, 0 
    );

    const dirLight1 = new THREE.DirectionalLight( '#ff0000', 1.0 );
    dirLight1.position.set( 1, 1, 1 );

    const dirLight2 = new THREE.DirectionalLight( '#00ff00', 1.0 );
    dirLight2.position.set( -1, -1, -2 );

    const ambientLight = new THREE.AmbientLight( 'white', 0.5 );

    this.scene.add( this.object, dirLight1, dirLight2, ambientLight );

    const { composer, shaderPass } = getPostprocessing(
      this.renderer, this.scene, this.camera
    );

    this.composer = composer;
    this.shaderPass = shaderPass;

    this.setCaptureFrameResolutionMultiplier( 4 );

    onLoad?.();
  }

  update( delta : number, now : number ) : void {
    // throw new Error('Method not implemented.');
    this.shaderPass.uniforms[ 'time' ].value = now;

    this.controls?.update();

    /*
    this.object.rotation.x += delta * 0.5;
    this.object.rotation.y -= delta * 0.3;
    this.object.rotation.z += delta * 0.1;
    */
  }
}