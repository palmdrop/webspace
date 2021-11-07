import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

import { AbstractRenderScene } from "../../AbstractRenderScene";
import { VoidCallback } from "../../core";
import { FullscreenQuadRenderer } from '../../render/FullscreenQuadRenderer';
import { buildPatternShader } from '../../shader/builder/pattern/patternShaderBuilder';
import { PointVariable } from '../../shader/builder/pattern/types';
import { setUniform } from '../../shader/core';


export class IteratedStaticRenderScene extends AbstractRenderScene {
  private controls? : TrackballControls;
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

    this.controls = new TrackballControls( this.camera, canvas );

    const cubeSize = 500;

    this.camera.far = cubeSize * 10;
    this.camera.position.z = cubeSize * 1.4;

    const renderTarget = new THREE.WebGLRenderTarget( canvas.width, canvas.height, {
    });

    const source1 = {
      kind : 'noise',
      frequency : new THREE.Vector3( 0.1, 0.1, 0.1 ),
      amplitude : 1.5,
      octaves : 4,
      lacunarity : 2.5,
      persistance : 0.3,
      pow : 4.0,
      ridge : 0.5,
    };

    const source2 = {
      kind : 'noise',
      frequency : new THREE.Vector3( 0.01, 0.01, 0.001 ),
      amplitude : 1.0,
      octaves : 2,
      lacunarity : 3.2,
      persistance : 0.7,
      pow : 1.0,
      ridge : 0.6,
    };

    const source3 = {
      kind : 'trig',
      types : {
        x : 'sin',
        y : 'cos',
        z : 'sin',
      },
      frequency : new THREE.Vector3( 0.05, 0.05, 0.05 ),
      combinationOperation : 'add',
      pow : 2.0,
    };

    // TODO combine shader material with physical material!? allow lighting
    this.shaderMaterial = new THREE.ShaderMaterial(
      buildPatternShader( {
        domain : 'vertex',
        scale : 3.0,
        mainSource : source1,

        domainWarp : {
          sources : { 
            x : source2,
            y : source2,
            z : source3,
          },
          amount : new THREE.Vector3( 100.0, 100.0, 20.0 ),
          iterations : 3,
          inputVariable : PointVariable.samplePoint,
        },

        /*mainSource : {
          kind : 'trig',
          types : {
            x : 'sin',
            y : 'cos',
            z : 'sin',
          },
          frequency : new THREE.Vector3( 10.5, 20.3, 5.1 ),
          combinationOperation : 'add',
          pow : 2.0,
        },
        */
        timeOffset : new THREE.Vector3( 20.0, -20.0, 20, ),
      }) 
    );

    this.shaderMaterial.side = THREE.DoubleSide;

    this.fullscreenRenderer = new FullscreenQuadRenderer( this.renderer, this.shaderMaterial, renderTarget );

    const cube = new THREE.Mesh(
      new THREE.BoxBufferGeometry( cubeSize, cubeSize, cubeSize ),
      this.shaderMaterial
    );

    this.scene.add( cube );

    this.scene.background = renderTarget.texture;

    this.resizeables.push( this.fullscreenRenderer );
    onLoad?.();
  }

  update( delta : number, now : number ) : void {
    this.controls?.update();
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