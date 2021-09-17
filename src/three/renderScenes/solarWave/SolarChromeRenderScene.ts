import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

import { makeNoise3D } from 'fast-simplex-noise';

import { AbstractRenderScene } from "../../AbstractRenderScene";
import { VoidCallback } from "../../core";

const noise = makeNoise3D();
type Position = { x : number, y : number, z : number };
const getNoise = ( 
  position : Position, 
  offset : Position, 
  frequency : number, 
  min : number = -0.3, 
  max : number = 0.3 
) => {
  return min + ( max - min ) * noise( 
    position.x * frequency + offset.x, 
    position.y * frequency + offset.y, 
    position.z * frequency + offset.z );
}

export class SolarChromeRenderScene extends AbstractRenderScene {
  private controls? : TrackballControls;

  constructor( canvas : HTMLCanvasElement, onLoad? : VoidCallback ) {
    super( canvas, onLoad );

    const controls = new TrackballControls( this.camera,
      canvas
    );

    controls.rotateSpeed = 1;
    controls.dynamicDampingFactor = 0.15;

    this.controls = controls;


    this.populateScene();

    onLoad?.();
  }

  protected createRenderer() {
    const renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        powerPreference: 'high-performance',
        antialias: false,
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
    this.scene.background = new THREE.Color( '#632356' );

    const xOffset = new THREE.Vector3( 100.0, 31.0, 51.0 );
    const yOffset = new THREE.Vector3( -31.0, 0.0, 3.0 );
    const zOffset = new THREE.Vector3( 38.0, -25.0, 10.0 );

    const sphereGeometry = new THREE.SphereBufferGeometry( 1.0, 128, 128 );

    const positionAttribute = sphereGeometry.attributes.position;
    let frequency = 0.7;
    let stretch = 0.1;
    const iterations = 3;
    
    const averagePosition = new THREE.Vector3();
    for(let k = 0; k < iterations; k++) {
      for(let i = 0; i < positionAttribute.count; i++ ) {
        let x = positionAttribute.getX( i );
        let y = positionAttribute.getY( i );
        let z = positionAttribute.getZ( i );

        let nx = x + getNoise( { x, y, z }, xOffset, frequency, -stretch, stretch );
        let ny = y + getNoise( { x, y, z }, yOffset, frequency, -stretch, stretch );
        let nz = z + getNoise( { x, y, z }, zOffset, frequency, -stretch, stretch );

        positionAttribute.setXYZ( i, nx, ny, nz );

        if(k === iterations - 1 ) {
          averagePosition.x += nx;
          averagePosition.y += ny;
          averagePosition.z += nz;
        }
      }
      frequency *= 2.0;
      stretch *= -0.6;
    }

    averagePosition.divideScalar( positionAttribute.count );

    sphereGeometry.computeVertexNormals();

    sphereGeometry.translate( -averagePosition.x, -averagePosition.y, -averagePosition.z );

    const sphereMaterial = new THREE.MeshStandardMaterial( {
      color: 'white',
      roughness: 0.0,
      metalness: 0.4,
      side: THREE.DoubleSide
    })
    //const sphereMaterial = new THREE.MeshNormalMaterial();

    const sphereMesh = new THREE.Mesh(
      sphereGeometry,
      sphereMaterial
    );

    sphereMesh.scale.set( 1.0, 2.3, 1.0 );

    sphereMesh.castShadow = true;
    sphereMesh.receiveShadow = true;


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

    this.scene.add( sphereMesh, plane );

    const directionalLight = new THREE.DirectionalLight(
      'white', 3.0
    );

    directionalLight.position.set( 0, 3, 2 );
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 48;
    directionalLight.shadow.mapSize.height = 48;
    directionalLight.shadow.bias = -0.01;

    const ambientLight = new THREE.AmbientLight( 'white', 1.0 );

    const hemisphereLight = new THREE.HemisphereLight( 'blue', 'brown', 5 );

    this.scene.add( directionalLight, hemisphereLight, ambientLight );

    // this._createPostProcessing();
  }

  update(delta: number, now: number): void {
    this.controls?.update();
  }
}