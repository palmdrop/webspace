import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

import { AbstractRenderScene } from "../../AbstractRenderScene";
import { VoidCallback } from "../../core";
import { FoldedStoneGeometryPrefab, SolarChromeGeometryPrefab } from '../../prefabs/geometries';
import { FullscreenQuadRenderer } from '../../render/FullscreenQuadRenderer';
import { buildPatternShader } from '../../shader/builder/pattern/patternShaderBuilder';
import { DomainWarp, PointVariable, Source } from '../../shader/builder/pattern/types';
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

    const objectSize = 100;

    this.camera.far = objectSize * 100;
    this.camera.position.z = objectSize * 1.4;

    const renderTarget = new THREE.WebGLRenderTarget( canvas.width, canvas.height, {
    });

    /*const source1 : Source = {
      kind : 'noise',
      frequency : new THREE.Vector3( 0.1, 0.1, 0.1 ),
      amplitude : 1.5,
      octaves : 4,
      lacunarity : 2.5,
      persistance : 0.3,
      pow : 4.0,
      ridge : 0.5,
    };*/


    const source2 : Source = {
      kind : 'noise',
      frequency : new THREE.Vector3( 0.004, 0.004, 0.003 ),
      amplitude : 1.0,
      octaves : 2,
      lacunarity : 3.2,
      persistance : 0.7,
      pow : 1.0,
      ridge : 0.6,
    };


    const source3 : Source = {
      kind : 'noise',
      frequency : new THREE.Vector3( 0.1, 0.01, 0.01 ),
      amplitude : 1.0,
      octaves : 3,
      lacunarity : 3.2,
      persistance : 0.7,
      pow : 3.0,
      ridge : 0.6,
    };

    const source4 : Source = {
      kind : 'trig',
      types : {
        x : 'sin',
        y : 'cos',
        z : 'sin',
      },
      frequency : new THREE.Vector3( 0.01, 0.01, 0.01 ),
      combinationOperation : 'add',
      pow : 1.0,
    };

    const source1 : Source = {
      kind : 'combined',
      sources : [ source2, source3 ],
      operation : 'add',
      multipliers : [ 0.5, 0.5 ],
      postModifications : [
        {
          kind : 'pow',
          argument : 4.0
        },
        {
          kind : 'mult',
          argument : 2.0,
        }
      ]
    }

    const domainWarp : DomainWarp = {
      sources : { 
        x : source4,
        y : source2,
        z : source3,
      },
      amount : new THREE.Vector3( 10.0, 10.0, 20.0 ),
      iterations : 3,
      inputVariable : PointVariable.samplePoint,
    }

    const warpedSource : Source = {
      kind : 'warped',
      source : source1,
      warp : domainWarp
    }

    // TODO combine shader material with physical material!? allow lighting
    this.shaderMaterial = new THREE.ShaderMaterial(
      buildPatternShader( {
        domain : 'view',
        scale : 3.0,
        mainSource : warpedSource,

        domainWarp : {
          sources : { 
            x : source4,
            y : source2,
            z : source3,
          },
          amount : new THREE.Vector3( 100.0, 100.0, 20.0 ),
          iterations : 3,
          inputVariable : PointVariable.samplePoint,
        },
        timeOffset : new THREE.Vector3( 20.0, -20.0, 20, ),
      }) 
    );

    this.shaderMaterial.side = THREE.DoubleSide;

    this.fullscreenRenderer = new FullscreenQuadRenderer( this.renderer, this.shaderMaterial, renderTarget );

    const object = new THREE.Mesh(
      new THREE.BoxBufferGeometry( 5.0, 5.0, 5.0 ),
      // new THREE.SphereBufferGeometry( 1.0, 100, 100, 100 ),
      // FoldedStoneGeometryPrefab({}),
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
    this.fullscreenRenderer.render();
    this.renderer.setRenderTarget( null );
    super.render( delta, now );

  }

  resize( width? : number, height? : number, force? : boolean ) : void {
    super.resize( width, height, force );

    setUniform( 'viewport', new THREE.Vector2( this.canvas.width, this.canvas.height ), this.shaderMaterial );
  }
}