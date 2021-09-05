import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from '../effects/unrealBloom/UnrealBloomPass';

import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'

import { VoidCallback } from "../core";
import { AbstractRenderScene } from '../AbstractRenderScene';
import { ShadowTransformRenderer } from './shadow/ShadowTransformRenderer';

import { ASSETHANDLER } from '../systems/AssetHandler';

import t1 from '../../assets/texture/t2.png';
import t2 from '../../assets/texture/t3.png';
import t3 from '../../assets/texture/t1.png';
import { random, randomElement } from '../../utils/Random';

type ObjectData = {
  object : THREE.Object3D,
  rotationSpeed : THREE.Vector3
};

export class MainRenderScene extends AbstractRenderScene {
  private controls : TrackballControls;

  private shadowTransformRenderer : ShadowTransformRenderer;

  private sceneContent : THREE.Group;
  private lights : THREE.Object3D;

  private materials : THREE.Material[];
  private geometries : THREE.BufferGeometry[];

  private objects : ObjectData[];

  constructor( canvas : HTMLCanvasElement, onLoad? : VoidCallback ) {
    super( canvas );

    this.controls = new TrackballControls(
      this.camera,
      this.canvas
    );

    this.controls.rotateSpeed = 1;
    this.controls.dynamicDampingFactor = 0.15;

    this.composer = this.createPostProcessing();

    this.shadowTransformRenderer = new ShadowTransformRenderer(
      this.scene, this.camera, this.renderer,
    );

    this.scene.background = this.shadowTransformRenderer.renderTarget.texture;

    this.sceneContent = new THREE.Group();
    this.lights = new THREE.Group();

    this.materials = [];
    this.geometries = [];
    this.objects = [];

    this.populateScene();

    onLoad && onLoad();
  }

  private createPostProcessing() : EffectComposer {
    const renderTarget = new THREE.WebGLRenderTarget(
      this.canvas.width, this.canvas.height, {
        //type: THREE.FloatType
      }
    );

    const composer = new EffectComposer( 
      this.renderer, 
      //renderTarget 
    );
    const renderPass = new RenderPass( this.scene, this.camera );

    const bloomPass = new UnrealBloomPass( this.renderer.getSize( new THREE.Vector2() ), 0.4, 1.0, 0.8 );

    composer.addPass( renderPass );
    //composer.addPass( bloomPass );

    return composer;
  }

  private createLights() : void {
    for( let i = 0; i < 3; i++ ) {
      const pointLight = new THREE.PointLight( '#ffffff', 105, 0, 2.0 );
      pointLight.position.set( 
        random( -2.0, 2.0 ),
        random( -2.0, 2.0 ),
        random( -2.0, 2.0 ),
      );

      //this.lights.add( pointLight );
    }

    const ambientLight = new THREE.AmbientLight('#ff6daa', 4.0 );

    this.lights.add( ambientLight );
  }

  private createMaterials() : void {
    for( let i = 0; i < 3; i++) {
      const color = new THREE.Color().setHSL(
        random( 0, 1 ),
        random( 0.7, 0.9 ),
        random( 0.4, 0.6 ),
      );

      const texture = ASSETHANDLER.loadTexture( 
        randomElement( [ t1, t2, t3 ] ), 
        false 
      );


      const material = new THREE.MeshStandardMaterial( { 
          color: color,
          //transparent: false,
          transparent: true,
          opacity: 0.4,

          metalness: 0.0,
          roughness: random( 0, 1 ),

          //bumpMap: texture,
          //bumpScale: 1.1,
          //roughnessMap: texture,

          alphaMap: texture,

          //blending: THREE.AdditiveBlending,

          side: THREE.DoubleSide,

          depthTest: false,
          depthWrite: false,
      });

      this.materials.push( material );
    }

    /*this.materials.push(
      new THREE.MeshBasicMaterial( {
        color: 'white',
      })
    );*/
  }

  private createGeometries() : void {
    this.geometries.push(
      //new THREE.TetrahedronBufferGeometry( 1.0, 20 ),
      new THREE.SphereBufferGeometry( 1.0, 30, 30, 30 ),
      new THREE.TorusBufferGeometry( 1.0, 0.1, 3, 40 ),
      new THREE.BoxBufferGeometry( 1.0, 1.0, 1.0 ),
    );
  }

  private createObject() : THREE.Object3D {
    const geometry = randomElement( this.geometries );
    const material = randomElement( this.materials );

    const mesh = new THREE.Mesh(
      geometry,
      material
    );

    mesh.scale.set( 
      random( 0.1, 1.8 ),
      random( 0.1, 1.8 ),
      random( 0.1, 1.8 ),
    );
     

    mesh.position.set(
      random( -0.5, 0.5 ),
      random( -0.5, 0.5 ),
      random( -0.0, 0.0 ),
    );

    return mesh;
  }

  private populateScene() : void {
    this.createMaterials();
    this.createGeometries();

    this.camera.position.set(
      0, 0, 5
    );

    this.camera.lookAt( 0, 0, 0 );

    const texture = ASSETHANDLER.loadTexture( t1, false );
    const material = new THREE.MeshStandardMaterial( { 
        color: 'white', 
        transparent: true,
        opacity: 0.8,

        metalness: 0.5,
        roughness: 0.7,

        bumpMap: texture,
        bumpScale: 0.01,
        roughnessMap: texture,

        alphaMap: texture,

        blending: THREE.NormalBlending,

        //side: THREE.DoubleSide
    });

    /*material.onBeforeCompile = ( shader ) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        'gl_FragColor = vec4( outgoingLight, diffuseColor.a );',
        `
        float luminance = outgoingLight.r * 0.3 + outgoingLight.g * 0.59 + outgoingLight.b * 0.11;
        gl_FragColor = vec4( outgoingLight, diffuseColor.a );\n
        //gl_FragColor.a *= 5.0 - pow( gl_FragCoord.z * 5.1, 60.0 );
        gl_FragColor = vec4( outgoingLight, diffuseColor.a * pow( 5.0 * luminance, 20.0 ) );
        `
      );
    };*/


    /*
    const glowMaterial = new THREE.MeshBasicMaterial( {
      color: 'white',
    });

    const glow = new THREE.Mesh(
      new THREE.TorusBufferGeometry( 1.0, 0.1, 10, 20 ),
      glowMaterial
    );

    glow.position.set( -2, 0, 0 );

    this.sceneContent.add( 
      sphere,
      disk,
      glow
    );*/

    for( let i = 0; i < 10; i++ ) {
      const object = this.createObject();
      this.sceneContent.add(
        object
      );
      this.objects.push( { 
        object,
        rotationSpeed: new THREE.Vector3(
          random( -0.1, 0.1 ),
          random( -0.1, 0.1 ),
          random( -0.1, 0.1 ),
        )
      });
    }

    const mainObject = new THREE.Mesh(
      this.geometries[ 0 ],
      this.materials[ 0 ],
    );

    mainObject.scale.set( 
      random( 1.8, 2.2 ),
      random( 1.8, 2.2 ),
      random( 1.8, 2.2 ),
    );

    this.sceneContent.add( mainObject );

    this.scene.add( this.sceneContent );

    this.createLights();
    this.scene.add( this.lights );
  }

  update( delta : number, now : number ) : void {
    this.controls.update();

    //this.lights.rotation.x += 0.4 * delta;
    //this.lights.rotation.y -= 0.6 * delta;

    this.sceneContent.rotation.x += 0.1 * delta;
    this.sceneContent.rotation.y -= 0.08 * delta;

    for( let i = 0; i < this.objects.length; i++ ) {
      const objectData = this.objects[ i ];
      objectData.object.rotation.x += objectData.rotationSpeed.x * delta;
      objectData.object.rotation.y += objectData.rotationSpeed.y * delta;
      objectData.object.rotation.z += objectData.rotationSpeed.z * delta;
    }
  }

  render( delta : number, now : number ) {
    const background = this.scene.background;
    this.scene.background = null;
    this.sceneContent.visible = true;
    this.shadowTransformRenderer.render( delta, now );

    this.scene.background = background;
    this.sceneContent.visible = false;
    super.render( delta, now );
  }

  resize() {
    super.resize();

    this.shadowTransformRenderer.setSize(
      this.canvas.width, this.canvas.height
    );

    this.composer?.setSize( this.canvas.width, this.canvas.height );

  }
}