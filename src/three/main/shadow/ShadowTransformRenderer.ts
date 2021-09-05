import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { KawaseBlurPass } from '../../effects/kawaseBlur/KawaseBlurPass';

import { CopyShader } from 'three/examples/jsm/shaders/CopyShader';
import { ShadowTransformShader } from '../../shaders/shadow/ShadowTransformShader';

export class ShadowTransformRenderer {
  private composer : EffectComposer;
  private shadowTransformPass : ShaderPass;
  private kawaseBlurPass : typeof KawaseBlurPass;

  renderTarget : THREE.WebGLRenderTarget;

  constructor( 
    scene : THREE.Scene, 
    camera : THREE.Camera,
    renderer : THREE.WebGLRenderer,
    //blurKernels : number[] = [ 1, 1, 2, 3, 5, 7 ],
    blurKernels : number[] = [ 1, 2 ],
    renderTarget? : THREE.WebGLRenderTarget | undefined | null
  ) {

    if( renderTarget ) {
      this.renderTarget = renderTarget;
    } else {
      this.renderTarget = new THREE.WebGLRenderTarget( 
        renderer.domElement.width, renderer.domElement.height, {
        }
      );
    }

    this.composer = new EffectComposer( renderer, this.renderTarget );

    const renderPass = new RenderPass( scene, camera );

    this.kawaseBlurPass = new KawaseBlurPass( { renderer, kernels: blurKernels } );

    this.shadowTransformPass = new ShaderPass( ShadowTransformShader );

    const copyPass = new ShaderPass( CopyShader );

    this.composer.addPass( renderPass );
    this.composer.addPass( this.kawaseBlurPass );
    this.composer.addPass( this.shadowTransformPass );
    this.composer.addPass( copyPass );

    this.composer.renderToScreen = false;
  }

  render( delta : number, now : number ) {
    this.composer.render( delta );
  }

  setBlurKernels( blurKernels : number[] ) {
    this.kawaseBlurPass.setKernels( blurKernels );
  }

  setUniform( name : string, value : any ) {
    this.shadowTransformPass.uniforms[ name ].value = value;
  }

  setSize( width: number, height : number ) {
    this.composer.setSize( width, height );

    this.shadowTransformPass.uniforms[ 'viewport' ].value.set(
      width, height
    )
  }

}