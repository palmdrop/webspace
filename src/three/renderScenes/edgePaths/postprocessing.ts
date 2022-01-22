import * as THREE from 'three';
import * as dat from 'dat.gui';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

import { SobelOperatorShader } from 'three/examples/jsm/shaders/SobelOperatorShader.js';
import { DotScreenShader } from 'three/examples/jsm/shaders/DotScreenShader';
import { ColorCorrectionShader } from 'three/examples/jsm/shaders/ColorCorrectionShader';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader';

import { buildPatternShader } from '../../shader/builder/pattern/patternShaderBuilder';
import makeShader from './shader';
import { KawaseBlurPass } from '../../effects/kawaseBlur/KawaseBlurPass';
import { addUniformSlider } from '../../shader/core';
// import { ColorCorrectionShader } from '../../shader/shaders/color/ColorCorrectionShader';

export const getPostprocessing = (
  renderer : THREE.WebGLRenderer,
  scene : THREE.Scene,
  camera : THREE.PerspectiveCamera | THREE.OrthographicCamera,

  backgroundScene : THREE.Scene,
  gui : dat.GUI
) => {
  // Background composer
  const size = renderer.getSize( new THREE.Vector2() );
  const backgroundRenderTarget = new THREE.WebGLRenderTarget( size.x, size.y, {
  } );

  const backgroundComposer = new EffectComposer( renderer, backgroundRenderTarget );

  const backgroundRenderPass = new RenderPass( backgroundScene, camera );
  backgroundComposer.addPass( backgroundRenderPass );

  const kawaseBlurPass = new KawaseBlurPass( { renderer, kernels: [ 1, 1, 2, 3 ] } );
  backgroundComposer.addPass( kawaseBlurPass );

  const colorCorrectionPass = new ShaderPass( ColorCorrectionShader );
  colorCorrectionPass.uniforms[ 'powRGB' ].value.set( 1.04, 1.04, 1.04 );
  colorCorrectionPass.uniforms[ 'addRGB' ].value.set( -0.0015, -0.0015, -0.0015 );

  const copyPass = new ShaderPass( CopyShader );

  backgroundComposer.addPass( colorCorrectionPass );
  
  // Copy pass required to make feedback loop happy
  backgroundComposer.addPass( copyPass );

  backgroundComposer.renderToScreen = false;

  scene.background = backgroundRenderTarget.texture;

  // Main composer
  const composer = new EffectComposer( renderer, );

  const renderPass = new RenderPass( scene, camera );
  composer.addPass( renderPass );

  // TOOD: Try diff sizes, 10, 100, 1000, diff in x and y
  /*
  const sobelPass = new ShaderPass( SobelOperatorShader );
  sobelPass.uniforms[ 'resolution' ].value.x = 100; // Math.pow( 10, Math.floor( Math.random() * 3 + 1.0 ) );
  sobelPass.uniforms[ 'resolution' ].value.y = 100; // Math.pow( 10, Math.floor( Math.random() * 3 + 1.0 ) );
  composer.addPass( sobelPass );
  */

  const shader = buildPatternShader( makeShader() );
  shader.uniforms[ 'frequency' ].value = 1.0;
  // shader.uniforms[ 'tMask' ].value = backgroundRenderTarget.texture;

  const shaderPass = new ShaderPass( shader );
  composer.addPass( shaderPass );
  composer.renderToScreen = true;

  // GUI
  const feedbackFolder = gui.addFolder( 'feedback' );

  feedbackFolder.add(
    { pow: colorCorrectionPass.uniforms[ 'powRGB' ].value.x },
    'pow',
    0.9,
    1.5,
    0.00001,
  ).onChange( value => {
    colorCorrectionPass.uniforms[ 'powRGB' ].value.set( value, value, value );
  } );

  feedbackFolder.add(
    { add: colorCorrectionPass.uniforms[ 'addRGB' ].value.x },
    'add',
    -0.03,
    0.03,
    0.00001,
  ).onChange( value => {
    colorCorrectionPass.uniforms[ 'addRGB' ].value.set( value, value, value );
  } );


  /*
  colorCorrectionPass.uniforms[ 'powRGB' ].value.set( 1.04, 1.04, 1.04 );
  colorCorrectionPass.uniforms[ 'addRGB' ].value.set( -0.0015, -0.0015, -0.0015 );
  */




  return { composer, backgroundComposer, shaderPass };
};