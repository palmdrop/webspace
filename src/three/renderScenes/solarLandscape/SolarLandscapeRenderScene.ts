import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from '../../effects/unrealBloom/UnrealBloomPass';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

import * as dat from 'dat.gui';

import { AbstractRenderScene } from "../../AbstractRenderScene";
import { VoidCallback } from "../../core";

import { ASSETHANDLER, dataTextureToEnvironmentMap } from '../../systems/AssetHandler';

import { random, randomElement } from '../../../utils/random';

import { setVertexColors } from '../../geometry/color/color';
import { FullscreenQuadRenderer } from '../../render/FullscreenQuadRenderer';
import { createWarpGradientShader } from '../../shaders/gradient/WarpGradientShader';
import { clamp } from 'three/src/math/MathUtils';
import { varyColorHSL } from '../../utils/color';
import { SolarChromeGeometryPrefab, SolarChromeMaterialPrefab, SolarLandscapeGeometry1Prefab, SolarLandscapeGeometry2Prefab, SolarLandscapeGeometry3Prefab, SolarLandscapeMaterial1Prefab, SolarLandscapeMaterial2Prefab, SolarLandscapeMaterial3Prefab } from '../../prefabs/prefabs';

import hdriPath from '../../../assets/hdri/decor_shop_4k.hdr';

import { getNoise3D } from '../../utils/noise';
import { textureFromSmoothGeometry } from '../../material/textureFromVertices';

const materialPrefabs = [
  SolarChromeMaterialPrefab,
  SolarLandscapeMaterial1Prefab,
  SolarLandscapeMaterial2Prefab,
  // SolarLandscapeMaterial3Prefab
];

const geometryPrefabs = [
  SolarChromeGeometryPrefab,
  SolarLandscapeGeometry1Prefab,
  SolarLandscapeGeometry2Prefab,
  SolarLandscapeGeometry3Prefab,
];

export class SolarLandscapeRenderScene extends AbstractRenderScene {
  private controls? : TrackballControls;

  private content : THREE.Object3D;
  private materials : THREE.MeshStandardMaterial[];
  private geometries : THREE.BufferGeometry[];

  private rotationSpeed : number;
  private rotationVelocity : THREE.Vector2;
  private rotationAcceleration : THREE.Vector2;
  private rotationFriction : number;

  private directionalLight? : THREE.DirectionalLight;

  private backgroundRenderer : FullscreenQuadRenderer;
  private backgroundColors : THREE.Color[];
  private background : THREE.Texture;

  private minZ : number;
  private maxZ : number;
  private zoomSpeed : number;
  private zoomVelocity : number;

  private zoomFriction : number;
  private zoomLimitThreshold : number;

  private gui : dat.GUI;

  constructor( canvas : HTMLCanvasElement, onLoad? : VoidCallback ) {
    super( canvas, onLoad );

    this.materials = [];
    this.geometries = [];

    this.gui = new dat.GUI();
    this.controls = new TrackballControls( this.camera, this.canvas );

    this.zoomSpeed = 0.12;
    this.zoomVelocity = 0.0;
    this.zoomFriction = 0.07;
    this.zoomLimitThreshold = 0.3;

    this.camera.far = 100;

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
      new THREE.Color().setHSL( Math.random(), 0.4, random( 0.15, 0.6 ) ),
      new THREE.Color().setHSL( Math.random(), 0.5, random( 0.15, 0.6 ) ),
      new THREE.Color().setHSL( Math.random(), 0.4, random( 0.15, 0.6 ) ),
    ];

    backgroundMaterial.uniforms[ 'colors' ].value = this.backgroundColors;
    backgroundMaterial.uniforms[ 'frequency' ].value = 0.9;
    backgroundMaterial.uniforms[ 'contrast' ].value = 1.0;
    backgroundMaterial.uniforms[ 'brightness' ].value = 0.3;

    this.resizeables.push( this.backgroundRenderer );

    this.background = this.backgroundRenderer.renderTarget.texture;

    this.minZ = 0;
    this.maxZ = 0;

    this.content = new THREE.Object3D();
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

    renderer.physicallyCorrectLights = true;
    renderer.toneMapping = THREE.LinearToneMapping;
    renderer.outputEncoding = THREE.GammaEncoding;

    renderer.shadowMap.enabled = true;
    //renderer.shadowMap.type = THREE.VSMShadowMap;

    return renderer;
  }

  private createMeshes() {
    for( let i = 0; i < 5; i++ ) {
      const geometry = randomElement( geometryPrefabs )( {} );
      const material = randomElement( materialPrefabs )( { 
        geometry : geometry,
        color : new THREE.Color( 'gray' )
      });

      material.dithering = true;
      material.vertexColors = true;

      /*material.onBeforeCompile = ( shader ) => {
        console.log( shader.fragmentShader );
        console.log( shader.uniforms );
      }*/


      /*ASSETHANDLER.loadTexture( randomElement( textures ), false, ( texture ) => {
        material.map = texture;
      });*/

      const frequency = 
        new THREE.Vector3(
          0.2 + 0.7 * Math.pow( Math.random(), 2.0 ),
          0.2 + 0.7 * Math.pow( Math.random(), 2.0 ),
          0.2 + 0.7 * Math.pow( Math.random(), 2.0 ),
        );

      const warp = 0.7;
      const rf = random( 0.2, 0.9 );
      const gf = random( 0.2, 0.9 );
      const bf = random( 0.2, 0.9 );
      setVertexColors( geometry, ( i, x, y, z ) => {
        const ox = warp * getNoise3D( { x : x + 103, y, z }, null, frequency, -1.0, 1.0 );
        const oy = warp * getNoise3D( { x, y : y + 131, z }, null, frequency, -1.0, 1.0 );
        const n = getNoise3D( { x: x + ox, y : y + oy, z }, null, frequency, -1.0, 1.0 );
        return { 
          r : 1.0 - rf * n,
          g : 1.0 - gf * ox,
          b : 1.0 - bf * oy 
        }
      });

      const texture = textureFromSmoothGeometry( geometry, ( x, y, z, u, v ) => {
        const ox = warp * getNoise3D( { x : x + 103, y, z }, null, new THREE.Vector3().copy( frequency ).multiplyScalar( 2.0 ), 0.0, 1.0 );
        const oy = warp * getNoise3D( { x, y : y + 131, z }, null, frequency, 0.0, 1.0 );
        const n = getNoise3D( { x: x + ox, y : y + oy, z }, null, frequency, 0.0, 1.0 );

        return new THREE.Color( 
          1.0 - 1.0 * ox, // Ambient occlusion
          0.1 + oy,       // Roughness map
          0.5 + 0.5 * n   // Metalness map
        );
      }, new THREE.Color());

      material.roughnessMap = texture;
      material.metalnessMap = texture;
      material.aoMap = texture;

      material.normalScale.multiplyScalar( 0.5 );

      this.geometries.push( geometry );
      this.materials.push( material );

      const numberOfInstances = Math.floor( random( 20, 50 ) );
      const mesh = new THREE.InstancedMesh(
        geometry,
        material,
        numberOfInstances
      );

      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const minScale = 0.5;
      const maxScale = 1.3;

      const range = 7;
      for( let i = 0; i < numberOfInstances; i++ ) {
        const scale = new THREE.Vector3(
          random( minScale, maxScale ),
          random( minScale, maxScale ),
          random( minScale, maxScale ),
        );

        const position = new THREE.Vector3(
          random( -range, range ),
          random( -range, range ),
          random( -range, range ),
        );

        /*const rotation = new THREE.Euler(
          random( 0, Math.PI * 2 ),
          random( 0, Math.PI * 2 ),
          random( 0, Math.PI * 2 ),
        );*/

        const f = 0.03;
        const minRotation = -Math.PI;
        const maxRotation = Math.PI;
        // const minRotation = 0;
        // const maxRotation = 0;
        const rotation = new THREE.Euler(
          getNoise3D( position, { x : 100, y : 0, z : 0 }, f, minRotation, maxRotation ),
          getNoise3D( position, { x : 0, y : 100, z : 0 }, f, -Math.PI, Math.PI ),
          getNoise3D( position, { x : 0, y : 0, z : 100 }, f, minRotation, maxRotation ),
        );

        const matrix = new THREE.Matrix4().compose( 
          position,
          new THREE.Quaternion().setFromEuler( rotation ),
          scale
        );

        const color = varyColorHSL( 
          randomElement( this.backgroundColors ),
          random( -0.1, 0.1 ),
          random( -0.1, 0.1 ),
          random( -0.2, 0.2 )
        );

        mesh.setMatrixAt( i, matrix );
        mesh.setColorAt( i, color );

      }

      this.content.add( mesh );
    }
  }

  private createLights() {
    const directionalLight = new THREE.DirectionalLight(
      'white',
      3.5
    );

    this.directionalLight = directionalLight;

    directionalLight.position.set( 0, 4, 0.2 );
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1028 * 4;
    directionalLight.shadow.mapSize.height = 1028 * 4;
    directionalLight.shadow.bias = -0.0003;

    directionalLight.shadow.camera.left   = -15;
    directionalLight.shadow.camera.right  = 15;
    directionalLight.shadow.camera.top    = 15;
    directionalLight.shadow.camera.bottom = -15;

    const dirLightFolder = this.gui.addFolder( 'directionalLight' );
    dirLightFolder.add( directionalLight.position, 'x' ).min( -10 ).max( 10 );
    dirLightFolder.add( directionalLight.position, 'y' ).min( -10 ).max( 10 );
    dirLightFolder.add( directionalLight.position, 'z' ).min( -10 ).max( 10 );
    dirLightFolder.add( directionalLight, 'intensity' ).min( 0.0 ).max( 10 );
    dirLightFolder.addColor( { 
      color : { 
        r : directionalLight.color.r * 255,
        g : directionalLight.color.g * 255,
        b : directionalLight.color.b * 255
      } 
    }, 'color' ).onChange( ( { r, g, b } ) => {
      directionalLight.color.setRGB( r / 255.0, g / 255.0, b / 255.0 );
    });
    dirLightFolder.add( directionalLight.shadow, 'bias' ).min( -0.0003 ).max( 0.0003 );

    /*const ambientLight = new THREE.AmbientLight( 'white', 0.1 );

    const ambientLightFolder = this.gui.addFolder( 'ambientLight' );
    ambientLightFolder.add( ambientLight, 'intensity' ).min( 0.0 ).max( 1.0 );
    */

    const hemisphereLight = new THREE.HemisphereLight( 
      this.backgroundColors[ 0 ],
      this.backgroundColors[ 1 ],
    0.2 );

    const hemisphereLightFolder = this.gui.addFolder( 'hemisphereLight' );
    hemisphereLightFolder.add( hemisphereLight, 'intensity' ).min( 0.0 ).max( 2.0 );

    /*const pointLight = new THREE.PointLight( 'white', 5.0 );
    pointLight.position.set( -5, 1, 10 );
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 1028;
    pointLight.shadow.mapSize.height = 1028;
    pointLight.shadow.bias = -0.0003;

    const pointLightFolder = this.gui.addFolder( 'pointLight' );
    pointLightFolder.add( pointLight.position, 'x' ).min( -10 ).max( 10 );
    pointLightFolder.add( pointLight.position, 'y' ).min( -10 ).max( 10 );
    pointLightFolder.add( pointLight.position, 'z' ).min( -10 ).max( 10 );
    pointLightFolder.add( pointLight, 'intensity' ).min( 0.0 ).max( 10 );
    pointLightFolder.addColor( { 
      color : { 
        r : pointLight.color.r * 255,
        g : pointLight.color.g * 255,
        b : pointLight.color.b * 255
      } 
    }, 'color' ).onChange( ( { r, g, b } ) => {
      pointLight.color.setRGB( r / 255.0, g / 255.0, b / 255.0 );
    });
    */


    this.scene.add( directionalLight, hemisphereLight, /* ambientLight */ );
    //this.scene.add( pointLight, hemisphereLight, /* ambientLight */ );
    //this.scene.add( pointLight );
  }

  private createPostProcessing() {
    this.composer = new EffectComposer( this.renderer );
    
    const renderPass = new RenderPass( this.scene, this.camera );
    this.composer.addPass( renderPass );

    /*const bloomPass = new UnrealBloomPass( 
      new THREE.Vector2( this.canvas.width, this.canvas.height ),
      1.2,
      0.05,
      0.5
    );

    const bloomFolder = this.gui.addFolder( 'bloom' );
    bloomFolder.add( bloomPass, 'strength' ).min( 0.0 ).max( 2.0 );
    bloomFolder.add( bloomPass, 'radius' ).min( 0.0 ).max( 2.0 );
    bloomFolder.add( bloomPass, 'threshold' ).min( 0.0 ).max( 1.0 );

    this.composer.addPass( bloomPass );*/
  }

  private populateScene() {
    this.createMeshes();
    this.createLights();
    this.createPostProcessing();

    // Set camera to appropriate distance from object
    const boundingBox = new THREE.Box3().setFromObject( this.content );
    const maxSize = Math.max(
      boundingBox.max.x - boundingBox.min.x,
      boundingBox.max.y - boundingBox.min.y,
      boundingBox.max.z - boundingBox.min.z,
    );

    this.camera.position.set( 0, 0, maxSize / 2.0 + 5 );

    this.minZ = maxSize / 2.0;
    this.maxZ = maxSize / 2.0 + 20;

    this.scene.add( this.content );
    this.scene.background = this.background;

    this.scene.fog = new THREE.Fog( 
      varyColorHSL( this.backgroundColors[0], 0.0, 0.0, -0.25 ),
      this.camera.near, 
      this.camera.far 
    );
    
    const fogFolder = this.gui.addFolder( 'fog' );
    fogFolder.add( this.scene.fog, 'near' ).min( 0.0 ).max( 100 ).onChange( ( near ) => {
    });

    fogFolder.add( this.scene.fog, 'far' ).min( 0.0 ).max( 100 ).onChange( ( far ) => {
      this.camera.far = far;
    });


    ASSETHANDLER.loadHDR( hdriPath, ( hdri ) => {
      this.scene.environment = dataTextureToEnvironmentMap( this.renderer, hdri );
    });

    const envMapIntensity = 0.35;
    const setMaterialEnvMapIntensity = ( intensity : number ) => this.materials.forEach( material => material.envMapIntensity = intensity );
    setMaterialEnvMapIntensity( envMapIntensity );
    this.gui.add( { envMapIntensity : envMapIntensity }, 'envMapIntensity' ).min( 0.0 ).max( 2.0 )
    .onChange( setMaterialEnvMapIntensity );

    this.gui.add( this.renderer, 'toneMappingExposure' ).min( 0.0 ).max( 10.0 );

    ASSETHANDLER.onLoad( undefined, () => {
      this.onLoad?.();
    });

  }

  rotate( deltaX : number, deltaY : number ) {
    this.rotationAcceleration.y += this.rotationSpeed * deltaX;
    this.rotationAcceleration.x += this.rotationSpeed * deltaY;
  }

  zoom( deltaZoom : number ) {

    this.zoomVelocity += deltaZoom * this.zoomSpeed;

  }

  protected beforeRender() {
    super.beforeRender();

    /*if( this.captureNext && this.directionalLight ) {
      this.directionalLight.shadow.mapSize.width *= 2.0;
      this.directionalLight.shadow.mapSize.height *= 2.0;
      this.directionalLight.shadow.needsUpdate = true;
    }*/
  }

  protected afterRender() {
    super.afterRender();

    /*if( this.captureNext && this.directionalLight ) {
      this.directionalLight.shadow.mapSize.width /= 2.0;
      this.directionalLight.shadow.mapSize.height /= 2.0;
      this.directionalLight.shadow.needsUpdate = true;
    }*/
  }

  update(delta : number, now : number): void {
    this.controls?.update();

    //this.content.rotation.y += delta * 0.14;

    //this.content.rotation.x += this.rotationVelocity.x;
    //this.content.rotation.y += this.rotationVelocity.y;

    this.rotationVelocity.add( this.rotationAcceleration );
    this.rotationAcceleration.multiplyScalar( 1.0 - this.rotationFriction );
    this.rotationVelocity.multiplyScalar( 1.0 - this.rotationFriction );


    if( Math.abs( this.zoomVelocity ) > 0.01 ) {
      const thresholdDistance = ( this.maxZ - this.minZ ) * this.zoomLimitThreshold;
      const z = this.camera.position.z;

      let zoomAmount = 1;

      if ( ( z - this.minZ ) < thresholdDistance && this.zoomVelocity < 0 ) {
        zoomAmount = 
          Math.pow( 
            clamp( ( z - this.minZ ) / thresholdDistance, 0.0, 1.0 ),
            1.1
          );
      } else if( ( this.maxZ - z ) < thresholdDistance && this.zoomVelocity > 0 ) {
        zoomAmount = 
          Math.pow( 
            clamp( ( this.maxZ - z ) / thresholdDistance, 0.0, 1.0 ),
            1.1
          );
      }

      //this.camera.position.z = clamp( z + zoomAmount * this.zoomVelocity, this.minZ, this.maxZ );

      this.zoomVelocity *= ( 1.0 - this.zoomFriction );
    }
  }

  resize( width? : number, height? : number ) {
    super.resize( width, height );

    this.backgroundRenderer.render();
    this.renderer.setRenderTarget( null );
  }

  dispose() {
    if( this.gui ) {
      this.gui.destroy();
    }
  }
}