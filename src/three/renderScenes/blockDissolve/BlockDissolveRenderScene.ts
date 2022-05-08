/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as THREE from 'three';

import { AbstractRenderScene } from '../../AbstractRenderScene';
import { VoidCallback } from '../../core';
import { FullscreenQuadRenderer } from '../../render/FullscreenQuadRenderer';
import { buildPatternShader } from '../../shader/builder/pattern/patternShaderBuilder';
import { setUniform } from '../../shader/core';

import { randomElement } from '../../../utils/random';
import { BlockRenderer } from './blockRenderer';

import substrate1 from './substrate1';
import substrate2 from './substrate2';

const substrates = [
  substrate1,
  substrate2
];

export class BlockDissolveRenderScene extends AbstractRenderScene {
  private blockTarget : THREE.WebGLRenderTarget;
  private targetA : THREE.WebGLRenderTarget;
  private targetB : THREE.WebGLRenderTarget;
  private tempMaterial : THREE.ShaderMaterial;
  private finalMaterial : THREE.MeshBasicMaterial;

  private quadRendererA : FullscreenQuadRenderer;
  private quadRendererB : FullscreenQuadRenderer;
  private quadRendererC : FullscreenQuadRenderer;

  private currentQuadRenderer : FullscreenQuadRenderer;

  private blockRenderer : BlockRenderer;

  private substrateShader : THREE.Shader;

  constructor( canvas : HTMLCanvasElement, onLoad ?: VoidCallback ) {
    super( canvas, onLoad );
    this.setCaptureFrameResolutionMultiplier( 1.0 );

    this.substrateShader = buildPatternShader( 
      randomElement( substrates )()
    );

    this.blockTarget = new THREE.WebGLRenderTarget(
      canvas.width, canvas.height, {
        minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
        wrapS: THREE.MirroredRepeatWrapping,
        wrapT: THREE.MirroredRepeatWrapping,
      }
    );

    this.blockRenderer = new BlockRenderer(
      this.renderer,
      this.blockTarget,
      this.canvas
    );


    this.targetA = new THREE.WebGLRenderTarget(
      canvas.width, canvas.height, {
        minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
        wrapS: THREE.MirroredRepeatWrapping,
        wrapT: THREE.MirroredRepeatWrapping,
      }
    );

    this.targetB = new THREE.WebGLRenderTarget(
      canvas.width, canvas.height, {
        minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
        wrapS: THREE.MirroredRepeatWrapping,
        wrapT: THREE.MirroredRepeatWrapping,
      }
    );

    this.tempMaterial = new THREE.ShaderMaterial(
      this.substrateShader
    );

    setUniform( 'tFeedback', this.targetA.texture, this.tempMaterial );
    setUniform( 'tBlock', this.blockTarget.texture, this.tempMaterial );

    this.quadRendererA = new FullscreenQuadRenderer( 
      this.renderer,
      this.tempMaterial,
      this.targetA
    );
    this.quadRendererB = new FullscreenQuadRenderer( 
      this.renderer,
      this.tempMaterial,
      this.targetB
    );

    this.finalMaterial = new THREE.MeshBasicMaterial( {
      map: this.targetB.texture
    } );

    this.quadRendererC = new FullscreenQuadRenderer( 
      this.renderer,
      this.finalMaterial
    );

    this.currentQuadRenderer = this.quadRendererA;

    this.resizeables.push( 
      this.quadRendererA, this.quadRendererB, this.quadRendererC,
      this.blockRenderer, this.blockTarget
    );

    onLoad?.();
  }


  update( delta : number, now : number ) : void {
    setUniform( 'time', now, this.substrateShader );

    this.blockRenderer.update( delta, now );
  }

  render( delta : number, now : number ) : void {
    this.blockRenderer.render();

    this.currentQuadRenderer.render();

    const previous = this.currentQuadRenderer;

    this.currentQuadRenderer = 
      this.currentQuadRenderer === this.quadRendererA 
        ? this.quadRendererB 
        : this.quadRendererA;

    this.finalMaterial.map = this.currentQuadRenderer.renderTarget!.texture;
    setUniform( 'tFeedback', previous.renderTarget!.texture, this.tempMaterial );

    this.quadRendererC.render();
  }
  
}