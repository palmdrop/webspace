import * as THREE from 'three';
import { random } from '../../../utils/random';
import { FullscreenQuadRenderer } from '../../render/FullscreenQuadRenderer';
import { createWarpGradientShader } from '../../shaders/gradient/WarpGradientShader';


export const createBackground = ( renderer : THREE.WebGLRenderer ) => {
  const backgroundMaterial = new THREE.ShaderMaterial( createWarpGradientShader( 3 ) );
  const dimensions = renderer.getSize( new THREE.Vector2() );
  const backgroundRenderer = new FullscreenQuadRenderer(
    renderer,
    backgroundMaterial,
    new THREE.WebGLRenderTarget( dimensions.x, dimensions.y, {
    })
  );
  const background = backgroundRenderer.renderTarget.texture;

  const backgroundColors = [
    new THREE.Color().setHSL( Math.random(), 0.4, random( 0.15, 0.6 ) ),
    new THREE.Color().setHSL( Math.random(), 0.5, random( 0.15, 0.6 ) ),
    new THREE.Color().setHSL( Math.random(), 0.4, random( 0.15, 0.6 ) ),
  ];

  backgroundMaterial.uniforms[ 'colors' ].value = backgroundColors;
  backgroundMaterial.uniforms[ 'frequency' ].value = 2.0;
  backgroundMaterial.uniforms[ 'contrast' ].value = 1.0;
  backgroundMaterial.uniforms[ 'brightness' ].value = 1.2;

  backgroundRenderer.render()
  

  return {
    background,
    backgroundRenderer,
    backgroundColors
  }
}