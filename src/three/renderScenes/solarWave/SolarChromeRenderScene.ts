import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

import { AbstractRenderScene } from "../../AbstractRenderScene";
import { VoidCallback } from "../../core";
import { domainWarp, geometryWarp, twistWarp } from '../../geometry/warp/warp';

import { ASSETHANDLER } from '../../systems/AssetHandler';

import { random } from '../../../utils/Random';

import noiseTexturePath from '../../../assets/noise/rgb/rgb-noise.jpg';
import normalTexturePath from '../../../assets/normal/normal-texture1.jpg';
import hdriPath from '../../../assets/hdri/decor_shop_4k.hdr';

export class SolarChromeRenderScene extends AbstractRenderScene {
  private controls? : TrackballControls;

  private object? : THREE.Object3D;

  private materials? : THREE.Material[];
  private geometries? : THREE.BufferGeometry[];

  constructor( canvas : HTMLCanvasElement, onLoad? : VoidCallback ) {
    super( canvas, onLoad );

    const controls = new TrackballControls( this.camera,
      canvas
    );

    controls.rotateSpeed = 1;
    controls.dynamicDampingFactor = 0.15;

    this.controls = controls;

    this.materials = [];
    this.geometries = [];

    this.populateScene();
  }

  protected createRenderer() {
    const renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        powerPreference: 'high-performance',
        antialias: true,
        depth: true,
        stencil: false,
        alpha: true
    });

    // SHADOWS
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // COLOR AND LIGHTING
    // if( this.useSRGB ) renderer.outputEncoding = THREE.sRGBEncoding;

    // enable the physically correct lighting model
    renderer.physicallyCorrectLights = true;

    return renderer;
  }

  private populateScene() {
    this.camera.position.set( 0, 0, 8 );

    this.scene.background = new THREE.Color( '#632356' );

    const geometry = new THREE.SphereBufferGeometry( 1.0, 128, 128 );

    geometryWarp( 
      geometry,

      //0.7,
      new THREE.Vector3( 0.1, 0.1, 0.1 ), // Frequency
      0.5, // Amount
      3,  // Octaves
      2.0, // Lacunarity
      0.6, // Persistance

      [
        { 
          warpFunction : domainWarp,
        }, 
        {
          warpFunction : twistWarp,
          args : {
            twistAmount : new THREE.Vector3( 1.0 * Math.random(), 1.0 * Math.random(), 1.0 * Math.random() ),
            falloff : random( 0.8, 1.2 ),
            anchor : new THREE.Vector3( 0.0 )
          }
        }
      ],

      true,
    );

    //TODO generate 4-5 shapes,then use geometri instancing to generate A LOT of shapes in the scene! change rotation, scale (stretch, morph) and ofc position

    const material = 
      new THREE.MeshStandardMaterial( {
        color: 'white',
        roughness: 0.3,
        metalness: 0.7,

        side: THREE.DoubleSide
      })

    ASSETHANDLER.loadTexture( normalTexturePath, false, ( texture ) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.minFilter = THREE.NearestFilter;
      texture.magFilter = THREE.LinearFilter;

      texture.repeat.set( 10.0, 10.0 );

      material.normalMap = texture;
      material.normalScale = new THREE.Vector2( 0.1 );
    });

    ASSETHANDLER.loadHDR( this.renderer, hdriPath, ( hdri ) => {
      material.envMap = hdri;
      material.envMapIntensity = 0.9;
    });

    const mesh = new THREE.Mesh(
      geometry,
      material
    );

    mesh.scale.set( 1.5, 2.0, 1.5 );

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    this.object = mesh;


    const plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry( 1.0, 1.0 ),
      new THREE.MeshStandardMaterial( {
        color: 'gray'
      })
    );

    plane.receiveShadow = true;
    plane.castShadow = true;

    plane.scale.set( 40, 40, 1.0 );
    plane.position.set( 0, 0, -6 );

    this.scene.add( mesh, plane );

    const directionalLight = new THREE.DirectionalLight(
      'white', 2.5
    );

    directionalLight.position.set( 0, 10, 10 );
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 512;
    directionalLight.shadow.mapSize.height = 512;
    directionalLight.shadow.bias = -0.01;

    const ambientLight = new THREE.AmbientLight( 'white', 0.7 );

    const hemisphereLight = new THREE.HemisphereLight( 'blue', 'brown', 5 );

    this.scene.add( directionalLight, hemisphereLight, ambientLight );

    ASSETHANDLER.onLoad( undefined, () => {
      material.needsUpdate = true;
      this.onLoad?.();
    });
  }

  update(delta: number, now: number): void {
    this.controls?.update();
    if( this.object ) {
      this.object.rotation.y += delta * 0.2;
    }
  }
}