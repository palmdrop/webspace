import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

import { AbstractRenderScene } from "../../AbstractRenderScene";
import { VoidCallback } from "../../core";
import { domainWarp, geometryWarp, twistWarp } from '../../geometry/warp/warp';

import { ASSETHANDLER, dataTextureToEnvironmentMap } from '../../systems/AssetHandler';

import { random } from '../../../utils/Random';

import noiseTexturePath from '../../../assets/noise/rgb/rgb-noise.jpg';
import normalTexturePath from '../../../assets/normal/normal-texture1.jpg';
import hdriPath from '../../../assets/hdri/decor_shop_4k.hdr';
import { FullscreenQuadRenderer } from '../../render/FullscreenQuadRenderer';
import { createWarpGradientShader } from '../../shaders/gradient/WarpGradientShader';

export class SolarChromeRenderScene extends AbstractRenderScene {
  private controls? : TrackballControls;

  private object : THREE.Object3D;

  private rotationSpeed : number;
  private rotationVelocity : THREE.Vector2;
  private rotationAcceleration : THREE.Vector2;
  private rotationFriction : number;

  private backgroundRenderer : FullscreenQuadRenderer;
  private backgroundColors : THREE.Color[];
  private background : THREE.Texture;

  constructor( canvas : HTMLCanvasElement, onLoad? : VoidCallback ) {
    super( canvas, onLoad );

    const controls = new TrackballControls( this.camera,
      canvas
    );

    controls.rotateSpeed = 1;
    controls.dynamicDampingFactor = 0.15;

    this.controls = controls;

    this.rotationSpeed = 0.00002;
    this.rotationVelocity = new THREE.Vector2();
    this.rotationAcceleration = new THREE.Vector2();
    this.rotationFriction = 0.1;

    const backgroundMaterial = new THREE.ShaderMaterial( createWarpGradientShader( 3 ) );
    this.backgroundRenderer = new FullscreenQuadRenderer(
      this.renderer,
      backgroundMaterial,
      new THREE.WebGLRenderTarget( canvas.width, canvas.height, {

      })
    );

    this.backgroundColors = [
      /*new THREE.Color( '30ffdf' ),
      new THREE.Color( '#32ff33' ),
      new THREE.Color( '#af30ff' ),
      */
      new THREE.Color( 'blue' ),
      new THREE.Color( 'brown' ),
      new THREE.Color( 'white' ),
    ];

    backgroundMaterial.uniforms[ 'colors' ].value = this.backgroundColors;
    backgroundMaterial.uniforms[ 'frequency' ].value = 0.5;
    backgroundMaterial.uniforms[ 'contrast' ].value = 1.9;
    backgroundMaterial.uniforms[ 'brightness' ].value = 2.0;

    this.resizeables.push( this.backgroundRenderer );

    this.background = this.backgroundRenderer.renderTarget.texture;

    this.object = this.populateScene();
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

    // enable the physically correct lighting model
    renderer.physicallyCorrectLights = true;

    return renderer;
  }

  private populateScene() {
    this.scene.background = new THREE.Color( '#976cb8' );

    const geometry = new THREE.SphereBufferGeometry( 1.0, 128, 128 );

    const maxFrequency = new THREE.Vector3( 0.2 );
    const frequency = new THREE.Vector3( 
      random( 0.05, maxFrequency.x ),
      random( 0.05, maxFrequency.y ),
      random( 0.05, maxFrequency.z )
    );

    geometryWarp( 
      geometry,

      frequency, // Frequency
      ( maxFrequency.length() - frequency.length() ) * random( 10.0, 13.0 ) + 0.2, // Amount
      3,  // Octaves
      random( 1.7, 2.5 ), // Lacunarity
      random( 0.4, 0.6 ), // Persistance

      [
        { 
          warpFunction : domainWarp,
        }, 
        {
          warpFunction : twistWarp,
          args : {
            twistAmount : new THREE.Vector3( 
              1.2 * Math.random(), 
              1.2 * Math.random(), 
              1.2 * Math.random() 
            ),
            falloff : random( 0.8, 1.0 ),
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

    ASSETHANDLER.loadHDR( hdriPath, ( hdri ) => {
      material.envMap = dataTextureToEnvironmentMap( this.renderer, hdri );
      material.envMapIntensity = 0.9;

      material.needsUpdate = true;
    });

    const mesh = new THREE.Mesh(
      geometry,
      material
    );

    mesh.scale.set( 1.5, 2.0, 1.5 );

    mesh.rotation.order = 'XYZ';

    // Set camera to appropriate distance from object
    const boundingBox = new THREE.Box3().setFromObject( mesh );
    const maxSize = Math.max(
      boundingBox.max.x - boundingBox.min.x,
      boundingBox.max.y - boundingBox.min.y,
      boundingBox.max.z - boundingBox.min.z,
    );

    this.camera.position.set( 0, 0, maxSize / 2.0 + 4 );

    this.object = mesh;

    this.scene.add( mesh );
    this.scene.background = this.background;

    const directionalLight = new THREE.DirectionalLight(
      this.backgroundColors[ 2 ],
      0.5
    );

    directionalLight.position.set( 0, 10, 10 );
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 512;
    directionalLight.shadow.mapSize.height = 512;
    directionalLight.shadow.bias = -0.01;

    const ambientLight = new THREE.AmbientLight( 'white', 0.4 );

    //const hemisphereLight = new THREE.HemisphereLight( 'blue', 'brown', 5 );
    const hemisphereLight = new THREE.HemisphereLight( 
      this.backgroundColors[ 0 ],
      this.backgroundColors[ 1 ],
    5 );

    this.scene.add( directionalLight, hemisphereLight, ambientLight );

    ASSETHANDLER.onLoad( undefined, () => {
      material.needsUpdate = true;
      this.onLoad?.();
    });

    return mesh;
  }

  rotate( deltaX : number, deltaY : number ) {
    this.rotationAcceleration.y += this.rotationSpeed * deltaX;
    this.rotationAcceleration.x += this.rotationSpeed * deltaY;
  }

  update(delta: number, now: number): void {
    this.controls?.update();

    this.object.rotation.y += delta * 0.14;

    this.object.rotation.x += this.rotationVelocity.x;
    this.object.rotation.y += this.rotationVelocity.y;

    this.rotationVelocity.add( this.rotationAcceleration );
    this.rotationAcceleration.multiplyScalar( 1.0 - this.rotationFriction );
    this.rotationVelocity.multiplyScalar( 1.0 - this.rotationFriction );
  }

  resize() {
    super.resize();

    this.backgroundRenderer.render();
    this.renderer.setRenderTarget( null );
  }
}