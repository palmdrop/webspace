import * as THREE from 'three';
import { getNoise3D, Noise } from '../../utils/noise';

type Args = {
  noiseOffset : THREE.Vector3,
  frequency : number,

  maxSpeed : number, // TODO add vector support
  minSpeed : number,

  animationSpeed : number,

  sampleOffsets ?: [ THREE.Vector3, THREE.Vector3, THREE.Vector3 ]
}

export class RandomMovement {
  private noise : Noise;
  private args : Args;

  private sampleOffsets : [ THREE.Vector3, THREE.Vector3, THREE.Vector3 ];

  private tempVector1 : THREE.Vector3;
  private tempVector2 : THREE.Vector3;

  constructor( args : Args ) {
    this.noise = getNoise3D;
    this.args = args;

    this.sampleOffsets = args.sampleOffsets ?? [
      new THREE.Vector3().random().multiplyScalar( 100 ),
      new THREE.Vector3().random().multiplyScalar( 100 ),
      new THREE.Vector3().random().multiplyScalar( 100 )
    ];

    this.tempVector1 = new THREE.Vector3();
    this.tempVector2 = new THREE.Vector3();
  }

  getForce( time : number, vector ?: THREE.Vector3 ) {
    if ( !vector ) vector = new THREE.Vector3();

    const zOffset = time * this.args.animationSpeed;

    for( let i = 0; i < 3; i++ ) {
      this.tempVector2.copy( this.sampleOffsets[ i ] );
      this.tempVector2.z += zOffset;

      const n = this.noise( 
        this.tempVector2,
        this.args.noiseOffset,
        this.args.frequency,
        this.args.minSpeed,
        this.args.maxSpeed,
      );

      switch ( i ) {
        case 0: vector.x = n; break;
        case 1: vector.y = n; break;
        case 2: vector.z = n; break;
      }
    }

    return vector;
  }
}