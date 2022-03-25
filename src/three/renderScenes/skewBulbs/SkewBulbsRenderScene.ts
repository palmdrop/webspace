import * as THREE from 'three';

import { AbstractRenderScene } from '../../AbstractRenderScene';
import { VoidCallback } from '../../core';
import { FullscreenQuadRenderer } from '../../render/FullscreenQuadRenderer';
import { buildPatternShader } from '../../shader/builder/pattern/patternShaderBuilder';
import { setUniform } from '../../shader/core';

import { random, randomElement } from '../../../utils/random';
import substrate from './substrate';

const substrates = [
  substrate
];

export class SkewLinesRenderScene extends AbstractRenderScene {
  private normalMapQuadRenderer : FullscreenQuadRenderer;
  private normalMapRenderTarget : THREE.WebGLRenderTarget;
  private normalMapShader : THREE.Shader;

  private diffuseMapQuadRenderer : FullscreenQuadRenderer;
  private diffuseMapRenderTarget : THREE.WebGLRenderTarget;
  private diffuseMapShader : THREE.Shader;

  private lightRig : THREE.Object3D;

  private orthographicCamera : THREE.OrthographicCamera;

  constructor( canvas : HTMLCanvasElement, onLoad ?: VoidCallback ) {
    super( canvas, onLoad );

    this.orthographicCamera = new THREE.OrthographicCamera(
      -0.5, 0.5,
      0.5, -0.5,
      0, 1000
    );

    this.setCaptureFrameResolutionMultiplier( 2.0 );

    const shaderSettings = randomElement( substrates )();

    this.normalMapShader = buildPatternShader( 
      shaderSettings
    );

    this.diffuseMapShader = buildPatternShader( 
      { ...shaderSettings, normalMapConverterSettings: undefined }
    );

    this.normalMapRenderTarget = new THREE.WebGLRenderTarget(
      canvas.width, canvas.height, {}
    );

    this.diffuseMapRenderTarget = new THREE.WebGLRenderTarget(
      canvas.width, canvas.height, {}
    );

    this.normalMapQuadRenderer = new FullscreenQuadRenderer(
      this.renderer, 
      new THREE.ShaderMaterial( this.normalMapShader ),
      this.normalMapRenderTarget
    );

    this.diffuseMapQuadRenderer = new FullscreenQuadRenderer(
      this.renderer, 
      new THREE.ShaderMaterial( this.diffuseMapShader ),
      this.diffuseMapRenderTarget
    );

    //

    this.scene.background = new THREE.Color( 'black' );

    const plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry( 1.0, 1.0 ),
      new THREE.MeshStandardMaterial( {
        normalMap: this.normalMapRenderTarget.texture,
        map: this.diffuseMapRenderTarget.texture,
        color: 'grey',
        metalness: random( 0.3, 0.7 ),
        roughness: 0.3,
        dithering: true
      } )
    );

    const ambientLight = new THREE.AmbientLight(
      'white',
      10
    );

    const lightColors = Array( 3 ).fill( 1 ).map( () => {
      return new THREE.Color( 'red' )
        .setHSL(
          Math.random(),
          0.3,
          random( 0.7, 1.0 )
        );
    } );

    const lightStrength = 1.0;
    const lightDistance = 20.5;
    const lightFalloff = 1.0;

    const radius = 0.5;
    const rigDistance = 1.0;

    this.lightRig = new THREE.Object3D();
    lightColors.forEach( ( color, i ) => {
      const light = new THREE.PointLight(
        color,
        lightStrength,
        lightDistance,
        lightFalloff
      );
      const angle = i * Math.PI * 2 / ( lightColors.length );
      const x = radius * Math.sin( angle );
      const y = radius * Math.cos( angle );

      light.position.set( x, y, 0 );

      this.lightRig.add( light );
    } );

    this.lightRig.position.set( 0, 0, rigDistance );

    this.scene.add( 
      plane, 
      this.lightRig,
      ambientLight 
    );


    // 

    this.resizeables.push( 
      this.normalMapQuadRenderer,
      this.normalMapRenderTarget,

      this.diffuseMapQuadRenderer,
      this.diffuseMapRenderTarget,
    );

    onLoad?.();
  }

  resize( width ?: number, height ?: number ) : void {
    super.resize( width, height );
    setUniform( 'viewport', new THREE.Vector2( this.canvas.width, this.canvas.height ), this.normalMapShader );
    setUniform( 'viewport', new THREE.Vector2( this.canvas.width, this.canvas.height ), this.diffuseMapShader );
  }


  update( delta : number, now : number ) : void {
    setUniform( 'time', now, this.normalMapShader );
    setUniform( 'time', now, this.diffuseMapShader );

    this.lightRig.rotation.z += delta * 0.5;
  }

  render( delta : number, now : number ) : void {
    this.normalMapQuadRenderer.render();
    this.diffuseMapQuadRenderer.render();

    this.renderer.setRenderTarget( null );
    this.renderer.render( this.scene, this.orthographicCamera );
  }
  
}