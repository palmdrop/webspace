import { random } from 'lodash';
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

import { AbstractRenderScene } from "../../AbstractRenderScene";
import { VoidCallback } from "../../core";
import { CurledTubeGeometryPrefab, FoldedStoneGeometryPrefab, SolarChromeGeometryPrefab, SolarChromeGeometryPrefab2 } from '../../prefabs/geometries';
import { FullscreenQuadRenderer } from '../../render/FullscreenQuadRenderer';
import { buildPatternShader } from '../../shader/builder/pattern/patternShaderBuilder';
import { setUniform } from '../../shader/core';
import { shaderSettings1 } from './shaderConfigurations';


export class IteratedStaticRenderScene extends AbstractRenderScene {
  private controls? : TrackballControls;
  private fullscreenRenderer : FullscreenQuadRenderer;
  private shaderMaterial : THREE.ShaderMaterial;

  constructor( canvas : HTMLCanvasElement, onLoad? : VoidCallback ) {
    super( canvas, onLoad );

    this.controls = new TrackballControls( this.camera, canvas );

    const objectSize = 100;

    this.camera.far = objectSize * 100;
    this.camera.position.z = objectSize * 1.4;

    const renderTarget = new THREE.WebGLRenderTarget( canvas.width, canvas.height, {
    });

    this.shaderMaterial = new THREE.ShaderMaterial( 
      buildPatternShader( shaderSettings1 )
    )

    this.shaderMaterial.side = THREE.DoubleSide;

    this.fullscreenRenderer = new FullscreenQuadRenderer( this.renderer, this.shaderMaterial, renderTarget );

    const object = new THREE.Mesh(
      new THREE.BoxBufferGeometry( 5.0, 5.0, 5.0 ),
      // new THREE.SphereBufferGeometry( 1.0, 100, 100, 100 ),
      // FoldedStoneGeometryPrefab({}),
      // SolarChromeGeometryPrefab2({}),
      // CurledTubeGeometryPrefab({}),
      this.shaderMaterial
    );

    object.scale.set( objectSize, objectSize, objectSize );

    this.scene.add( object );

    this.scene.background = renderTarget.texture;

    this.resizeables.push( this.fullscreenRenderer );
    onLoad?.();
  }

  update( delta : number, now : number ) : void {
    this.controls?.update();
    setUniform( 'time', now, this.shaderMaterial );
  }

  render( delta : number, now : number ) {
    setUniform( 'brightness', 0.7, this.shaderMaterial );
    this.fullscreenRenderer.render();
    this.renderer.setRenderTarget( null );
    setUniform( 'brightness', 1.0, this.shaderMaterial );
    super.render( delta, now );

  }

  resize( width? : number, height? : number, force? : boolean ) : void {
    super.resize( width, height, force );

    setUniform( 'viewport', new THREE.Vector2( this.canvas.width, this.canvas.height ), this.shaderMaterial );
  }
}