import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

import { SobelOperatorShader } from 'three/examples/jsm/shaders/SobelOperatorShader.js';
import { DotScreenShader } from 'three/examples/jsm/shaders/DotScreenShader';
import { buildPatternShader } from '../../shader/builder/pattern/patternShaderBuilder';
import makeShader from './shader';

export const getPostprocessing = (
  renderer : THREE.WebGLRenderer,
  scene : THREE.Scene,
  camera : THREE.PerspectiveCamera | THREE.OrthographicCamera
) => {


  const size = renderer.getSize( new THREE.Vector2() );
  const renderTarget = new THREE.WebGLRenderTarget( size.x, size.y, {

  } );

  const composer = new EffectComposer( renderer, renderTarget );

  const renderPass = new RenderPass( scene, camera );
  composer.addPass( renderPass );

  // TOOD: Try diff sizes, 10, 100, 1000, diff in x and y
  const sobelPass = new ShaderPass( SobelOperatorShader );
  sobelPass.uniforms[ 'resolution' ].value.x = Math.pow( 10, Math.floor( Math.random() * 3 + 1.0 ) );
  sobelPass.uniforms[ 'resolution' ].value.y = Math.pow( 10, Math.floor( Math.random() * 3 + 1.0 ) );
  composer.addPass( sobelPass );

  /*
  const dotScreenShaderPass = new ShaderPass( DotScreenShader );
  dotScreenShaderPass.uniforms[ 'tSize' ].value.set( 256 * 1, 256 * 1 );
  dotScreenShaderPass.uniforms[ 'angle' ].value = 2.3;
  dotScreenShaderPass.uniforms[ 'scale' ].value = 1.4;
  composer.addPass( dotScreenShaderPass );
  */

  const shader = buildPatternShader( makeShader( 'tDiffuse' ) );
  shader.uniforms[ 'frequency' ].value = 1.0;

  const shaderPass = new ShaderPass( shader );
  composer.addPass( shaderPass );


  return { composer, shaderPass };
};