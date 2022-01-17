import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { AbstractRenderScene } from '../../AbstractRenderScene';
import { VoidCallback } from '../../core';
import { SolarChromeGeometryPrefab } from '../../prefabs/geometries';
import { getPostprocessing } from './postprocessing';

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
    */
    super( canvas, onLoad );

    this.scene.background = new THREE.Color( 'black' );
    this.controls = new TrackballControls( this.camera, canvas );

    this.object = new THREE.Mesh(
      // new THREE.BoxBufferGeometry( 3, 3, 3 ),
      SolarChromeGeometryPrefab( {} ),
      // new THREE.MeshBasicMaterial( { color: 'red' } )
      new THREE.MeshStandardMaterial( {
        color: 'white',
        metalness: 0.6,
        roughness: 0.5,
        dithering: true,
      } )
    );

    this.object.position.set( 
      0, 0, 0 
    );

    const directionalLight = new THREE.DirectionalLight( 'white', 1.0 );
    directionalLight.position.set( 1, 1, 1 );

    const ambientLight = new THREE.AmbientLight( 'white', 0.5 );

    this.scene.add( this.object, directionalLight, ambientLight );

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