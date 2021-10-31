import * as THREE from 'three';

import { AbstractRenderScene } from "../../AbstractRenderScene";
import { VoidCallback } from "../../core";
import { FullscreenQuadRenderer } from '../../render/FullscreenQuadRenderer';
import { patternShaderBuilder } from '../../shader/builder/pattern/patternShaderBuilder';
import { setUniform } from '../../shader/core';


export class IteratedStaticRenderScene extends AbstractRenderScene {
  /*
    Shader buildler for 
    domain warping
    math functions
    loops
    lihgts, colors
    images/mixers

    combine with 3js shader
    or create texture that can be used with materials

    convert output to normal maps?

    customizable, recursive, loops, transformations, operations, etc

    POSSIBLITY: build API using three js node materials?

  */

  private fullscreenRenderer : FullscreenQuadRenderer;
  private shaderMaterial : THREE.ShaderMaterial;

  constructor( canvas : HTMLCanvasElement, onLoad? : VoidCallback ) {
    super( canvas, onLoad );

    const renderTarget = new THREE.WebGLRenderTarget( canvas.width, canvas.height, {
    });

    this.shaderMaterial = new THREE.ShaderMaterial(
      patternShaderBuilder() 
    );

    this.fullscreenRenderer = new FullscreenQuadRenderer( this.renderer, this.shaderMaterial, renderTarget );

    this.scene.background = renderTarget.texture;

    this.resizeables.push( this.fullscreenRenderer );
    onLoad?.();
  }

  update( delta : number, now : number ) : void {
    setUniform( 'time', now, this.shaderMaterial );
  }

  render( delta : number, now : number ) {
    this.fullscreenRenderer.render();
    this.renderer.setRenderTarget( null );
    super.render( delta, now );

  }

  resize( width? : number, height? : number, force? : boolean ) : void {
    super.resize( width, height, force );

    setUniform( 'viewport', new THREE.Vector2( this.canvas.width, this.canvas.height ), this.shaderMaterial );
  }
}