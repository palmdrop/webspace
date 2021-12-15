import * as THREE from 'three';
import { random } from '../../../utils/random';
import { ImprintGeometryPrefab } from '../../prefabs/geometries';

export const createObject = ( material : THREE.Material, size : number ) : {
  mesh : THREE.Mesh,
  updateMesh : ( mesh : THREE.Mesh, time : number, delta : number ) => void,
} => {
  const geometry = ImprintGeometryPrefab( {} );

  const numberOfInstances = Math.floor( random( 40, 100 ) );

  const instancedObject = new THREE.InstancedMesh(
    geometry,
    material,
    numberOfInstances
  );

  const xSpeed = random( -0.2, 0.2 );
  const ySpeed = random( -0.2, 0.2 );
  const zSpeed = random( -0.2, 0.2 );

  const xRotation = random( -0.3, 0.3 );
  const yRotation = random( -0.3, 0.3 );
  const zRotation = random( -0.3, 0.3 );

  const xScale = random( -0.1, 0.1 );
  const yScale = random( -0.1, 0.1 );
  const zScale = random( -0.1, 0.1 );
  
  const updateMesh = ( mesh : THREE.Mesh, time : number, delta : number ) => {
    const positionSum = new THREE.Vector3();
    const position = new THREE.Vector3();
    
    for( let i = 0; i < numberOfInstances; i++ ) {

      const rotation = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(
          time * xSpeed + xRotation * i,
          time * ySpeed + yRotation * i,
          time * zSpeed + zRotation * i,
        )
      );

      position.add( new THREE.Vector3( 1.5, 0.0, 0.0 ).applyQuaternion( rotation ) );

      positionSum.add( position );

      const scale = new THREE.Vector3(
        size + xScale * i, 
        size + yScale * i,
        size + zScale * i
      );

      const matrix = new THREE.Matrix4().compose(
        position,
        rotation,
        scale
      );

      ( mesh as THREE.InstancedMesh ).setMatrixAt( i, matrix );
    }

    const averagePosition = positionSum.divideScalar( numberOfInstances );

    mesh.position.copy( averagePosition.multiplyScalar( -1 ) );

    ( mesh as THREE.InstancedMesh ).instanceMatrix.needsUpdate = true;
  };

  updateMesh( instancedObject, 0, 0 );

  return {
    mesh: instancedObject,
    updateMesh,
  };
};