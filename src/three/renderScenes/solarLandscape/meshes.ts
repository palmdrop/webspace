import * as THREE from 'three';
import { random, randomElement } from "../../../utils/random";
import { setVertexColors } from '../../geometry/color/color';
import { textureFromSmoothGeometry } from '../../material/textureFromVertices';
import { SolarChromeGeometryPrefab, SolarChromeMaterialPrefab, FoldedStoneGeometryPrefab, TwistedTorusGeometryPrefab, CurledTubeGeometryPrefab, SoftMaterialPrefab, RoughMetalMaterialPrefab, GlowingMaterialPrefab, DirtyMetalMaterialPrefab, MarbleGeometryPrefab } from '../../prefabs/prefabs';
import { varyColorHSL } from '../../utils/color';
import { getNoise3D } from '../../utils/noise';

const materialPrefabs = [
  SolarChromeMaterialPrefab,
  SoftMaterialPrefab,
  RoughMetalMaterialPrefab,
  DirtyMetalMaterialPrefab
];

const geometryPrefabs = [
  // SolarChromeGeometryPrefab,
  MarbleGeometryPrefab,
  FoldedStoneGeometryPrefab,
  TwistedTorusGeometryPrefab,
  CurledTubeGeometryPrefab,
];


export const createMeshes = ( colors : THREE.Color[] ) => {
  const geometries : THREE.BufferGeometry[] = [];
  const materials : THREE.MeshStandardMaterial[] = [];
  const meshes : THREE.Group = new THREE.Group();

  for( let i = 0; i < 6; i++ ) {
    const geometry = randomElement( geometryPrefabs )( {} );
    const material = randomElement( materialPrefabs )( { 
      geometry : geometry,
      color : new THREE.Color( 'white' )
    });

    material.dithering = true;
    material.vertexColors = true;

    const frequency = 
      new THREE.Vector3(
        0.2 + 1.0 * Math.pow( Math.random(), 3.5 ),
        0.2 + 1.0 * Math.pow( Math.random(), 3.5 ),
        0.2 + 1.0 * Math.pow( Math.random(), 3.5 ),
      );

    const warp = 0.8;
    const rf = random( 0.2, 0.8 );
    const gf = random( 0.2, 0.8 );
    const bf = random( 0.2, 0.8 );
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

    material.normalScale.multiplyScalar( 0.3 );

    geometries.push( geometry );
    materials.push( material );

    const numberOfInstances = Math.floor( random( 20, 33 ) );
    const mesh = new THREE.InstancedMesh(
      geometry,
      material,
      numberOfInstances
    );

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const minScale = 0.3;
    const maxScale = 1.3;

    const range = {
      x : 7,
      y : 7,
      z : 1
    };

    for( let i = 0; i < numberOfInstances; i++ ) {
      const scale = new THREE.Vector3(
        random( minScale, maxScale ),
        random( minScale, maxScale ),
        random( minScale, maxScale ),
      );

      const position = new THREE.Vector3(
        random( -range.x, range.x ),
        random( -range.y, range.y ),
        random( -range.z, range.z ),
      );

      const f = 0.02;
      const minRotation = -Math.PI;
      const maxRotation = Math.PI;
      const rotation = new THREE.Euler(
        getNoise3D( position, { x : 100, y : 0, z : 0 }, f, minRotation, maxRotation ),
        getNoise3D( position, { x : 0, y : 100, z : 0 }, f, minRotation, maxRotation ),
        getNoise3D( position, { x : 0, y : 0, z : 100 }, f, minRotation, maxRotation ),
      );

      const matrix = new THREE.Matrix4().compose( 
        position,
        new THREE.Quaternion().setFromEuler( rotation ),
        scale
      );

      const hueVariation = getNoise3D( position, undefined, f, -0.2, 0.2 );

      const color = varyColorHSL( 
        randomElement( colors ),
        // random( -0.1, 0.1 ),
        hueVariation,
        Math.pow( random( -0.1, 0.5 ), 2.0 ),
        random( -0.5, 0.7 )
      );

      mesh.setMatrixAt( i, matrix );
      mesh.setColorAt( i, color );

    }

    meshes.add( mesh );
  }

  return {
    meshes,
    geometries,
    materials
  }
}