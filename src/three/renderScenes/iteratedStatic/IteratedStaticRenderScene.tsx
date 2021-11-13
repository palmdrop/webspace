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

  private cubeCamera : THREE.CubeCamera;

  private object : THREE.Mesh;

  constructor( canvas : HTMLCanvasElement, onLoad? : VoidCallback ) {
    super( canvas, onLoad );

    this.controls = new TrackballControls( this.camera, canvas );

    const spaceSize = 100;

    this.camera.far = spaceSize * 100;
    this.camera.position.z = spaceSize * 1.4;

    const [ cubeCamera, cubeRenderTarget ] = this._createCubeCamera();
    this.cubeCamera = cubeCamera;

    const renderTarget = new THREE.WebGLRenderTarget( canvas.width, canvas.height, {
    });

    this.shaderMaterial = new THREE.ShaderMaterial( 
      buildPatternShader( shaderSettings1 )
    )

    this.shaderMaterial.side = THREE.DoubleSide;

    this.fullscreenRenderer = new FullscreenQuadRenderer( this.renderer, this.shaderMaterial, renderTarget );

    const space = new THREE.Mesh(
      new THREE.BoxBufferGeometry( 5.0, 5.0, 5.0 ),
      // new THREE.SphereBufferGeometry( 1.0, 100, 100, 100 ),
      this.shaderMaterial
    );

    space.scale.set( spaceSize, spaceSize, spaceSize );

    const object = new THREE.Mesh(
      // FoldedStoneGeometryPrefab({}),
      // CurledTubeGeometryPrefab({}),
      SolarChromeGeometryPrefab2({}),
      new THREE.MeshPhysicalMaterial( {
        color : 'white',
        roughness : 0.1,
        metalness : 0.9,

        clearcoat : 0.5,

        envMap : cubeRenderTarget.texture,
        envMapIntensity : 1.5,
      })
    );

    object.scale.set( spaceSize / 3.0, spaceSize / 3.0, spaceSize / 3.0 );

    this.object = object;

    const light = new THREE.DirectionalLight( 
      new THREE.Color().setHSL( Math.random(), random( 0.5, 1.0 ), random( 0.6, 0.9 ) ),
      4.0
    );

    light.position.set( 0, spaceSize / 2.0 - 2, 0 );

    this.scene.add( space, cubeCamera, object, light );
    // this.scene.background = renderTarget.texture;

    this.resizeables.push( this.fullscreenRenderer );
    onLoad?.();
  }

  _createCubeCamera() : [ THREE.CubeCamera, THREE.WebGLCubeRenderTarget ] {
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 1024, {
      format :THREE.RGBFormat,
      generateMipmaps : true,
      minFilter : THREE.LinearMipMapLinearFilter
    });

    const cubeCamera = new THREE.CubeCamera( 1, 1000, cubeRenderTarget );

    return [ cubeCamera, cubeRenderTarget ];
  }

  update( delta : number, now : number ) : void {
    this.controls?.update();
    setUniform( 'time', now, this.shaderMaterial );

    this.object.visible = false;
    this.cubeCamera.update( this.renderer, this.scene );
    this.object.visible = true;
  }

  render( delta : number, now : number ) {
    ///setUniform( 'brightness', 0.7, this.shaderMaterial );
    // this.fullscreenRenderer.render();
    this.renderer.setRenderTarget( null );
    setUniform( 'brightness', 1.0, this.shaderMaterial );
    super.render( delta, now );

  }

  resize( width? : number, height? : number, force? : boolean ) : void {
    super.resize( width, height, force );

    setUniform( 'viewport', new THREE.Vector2( this.canvas.width, this.canvas.height ), this.shaderMaterial );
  }
}