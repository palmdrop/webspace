import * as THREE from 'three';
import { random } from '../../utils/random';
import { domainWarp, noiseWarp, twistWarp } from '../geometry/warp/warp';
import { generateWarpGeometryPrefab } from './WarpGeometryPrefab';

import { GeometryPrefab } from './prefabs';

export const SolarChromeGeometryPrefab : GeometryPrefab = ( () => {
  const solarChromeMaxFrequency = new THREE.Vector3( 0.5 );
  return generateWarpGeometryPrefab(
    // Geometry
    () => {
      return new THREE.SphereBufferGeometry( 1.0, 228, 228 );
    },

    // Frequency
    () => {
      return new THREE.Vector3( 
        random( 0.2, solarChromeMaxFrequency.x ),
        random( 0.2, solarChromeMaxFrequency.y ),
        random( 0.2, solarChromeMaxFrequency.z )
      );
    },

    // Warp amount
    ( frequency : THREE.Vector3 ) => {
      return ( solarChromeMaxFrequency.length() - frequency.length() ) * random( 7.0, 9.0 ) + 0.5 
    },

    // Octaves 
    () => {
      return 3
    },

    // Lacunarity
    () => {
      return random( 1.9, 2.5 );
    },

    // Persistance
    () => {
      return random( 0.4, 0.5 );
    },

    // Warp entries
    [
      { 
        warpFunction : noiseWarp,
      }, 
      {
        warpFunction : twistWarp,
        args : {
          twistAmount : new THREE.Vector3( 
            0.8 * Math.random(), 
            0.8 * Math.random(), 
            0.8 * Math.random() 
          ),
          falloff : random( 0.5, 1.0 ),
        }
      }
    ]
  )
})();

export const SolarChromeGeometryPrefab2 : GeometryPrefab = ( () => {
  const solarChromeMaxFrequency = new THREE.Vector3( 0.4 );
  return generateWarpGeometryPrefab(
    // Geometry
    () => {
      const geometry = new THREE.TorusBufferGeometry( 1.0, 0.2, 128 * 4, 128 * 4 )

      geometry.applyMatrix4( new THREE.Matrix4().scale( new THREE.Vector3( 
        random( 1.0, 3.0 ),
        random( 1.0, 3.0 ),
        random( 1.0, 3.0 ),
      )));

      return geometry;
    },

    // Frequency
    () => {
      return new THREE.Vector3( 
        random( 0.3, solarChromeMaxFrequency.x ),
        random( 0.3, solarChromeMaxFrequency.y ),
        random( 0.3, solarChromeMaxFrequency.z )
      );
    },

    // Warp amount
    ( frequency : THREE.Vector3 ) => {
      return random( 0.02, 0.05 )
    },

    // Octaves 
    () => {
      return 3
    },

    // Lacunarity
    () => {
      return random( 2.9, 4.5 );
    },

    // Persistance
    () => {
      return random( 0.8, 0.9 );
    },

    // Warp entries
    [
      { 
        warpFunction : domainWarp,
      }, 
      {
        warpFunction : twistWarp,
        args : {
          twistAmount : new THREE.Vector3( 
            0.8 * Math.random(), 
            0.8 * Math.random(), 
            0.8 * Math.random() 
          ),
          falloff : random( 0.8, 0.8 ),
        }
      }
    ]
  )
})();

const solarLandscapePrefabDetail = 228;
export const FoldedStoneGeometryPrefab : GeometryPrefab = ( () => {
  const solarChromeMaxFrequency = new THREE.Vector3( 0.23 );
  return generateWarpGeometryPrefab(
    // Geometry
    () => {
      const geometry = new THREE.SphereBufferGeometry( 1.0, solarLandscapePrefabDetail, solarLandscapePrefabDetail );

      const stretch = random( 1.1, 1.8 );

      geometry.applyMatrix4( new THREE.Matrix4().scale(
        new THREE.Vector3( 1.0 / stretch, stretch, 1.0 / stretch )
      ) );

      return geometry;
    },

    // Frequency
    () => {
      return new THREE.Vector3( 
        random( 0.075, solarChromeMaxFrequency.x ), 
        random( 0.075, solarChromeMaxFrequency.y ),
        random( 0.075, solarChromeMaxFrequency.z )
      );
    },

    // Warp amount
    ( frequency : THREE.Vector3 ) => {
      return random( 0.3, 0.5 );
    },

    // Octaves 
    () => {
      return 3
    },

    // Lacunarity
    () => {
      return random( 3.5, 5.5 );
    },

    // Persistance
    () => {
      return random( 0.4, 0.5 );
    },

    // Warp entries
    [
      { 
        warpFunction : noiseWarp,
      }, 
      {
        warpFunction : twistWarp,
        args : {
          twistAmount : new THREE.Vector3( 
            0.6 * Math.random(), 
            0.6 * Math.random(), 
            0.6 * Math.random() 
          ),
          falloff : random( 0.5, 1.0 ),
        }
      }
    ]
  )
})();

export const TwistedTorusGeometryPrefab : GeometryPrefab = ( () => {
  const solarChromeMaxFrequency = new THREE.Vector3( 0.30 );
  return generateWarpGeometryPrefab(
    // Geometry
    () => {
      return new THREE.TorusGeometry( 1.0, random( 0.10, 0.3 ), 128, 128 );
    },

    // Frequency
    () => {
      return new THREE.Vector3( 
        random( 0.01, solarChromeMaxFrequency.x ),
        random( 0.01, solarChromeMaxFrequency.y ),
        random( 0.01, solarChromeMaxFrequency.z )
      );
    },

    // Warp amount
    ( frequency : THREE.Vector3 ) => {
      return random( 0.3, 1.5 );
    },

    // Octaves 
    () => {
      return 3
    },

    // Lacunarity
    () => {
      return random( 1.5, 2.5 );
    },

    // Persistance
    () => {
      return random( 0.4, 0.5 );
    },

    // Warp entries
    [
      { 
        warpFunction : noiseWarp,
      }, 
      {
        warpFunction : twistWarp,
        args : {
          twistAmount : new THREE.Vector3( 
            0.8 * Math.random(), 
            0.8 * Math.random(), 
            0.8 * Math.random() 
          ),
          falloff : random( 0.5, 1.2 ),
        }
      }
    ]
  )
})();

export const MarbleGeometryPrefab : GeometryPrefab = ( () => {
  const solarChromeMaxFrequency = new THREE.Vector3( 0.35 );
  return generateWarpGeometryPrefab(
    // Geometry
    () => {
      const geometry = new THREE.SphereBufferGeometry( 1.0, solarLandscapePrefabDetail, solarLandscapePrefabDetail );

      geometry.applyMatrix4( new THREE.Matrix4().scale( new THREE.Vector3(
        random( 0.5, 1.3, ),
        random( 0.5, 1.3, ),
        random( 0.5, 1.3, ),
      )));

      return geometry;
    },

    // Frequency
    () => {
      return new THREE.Vector3( 
        random( 0.01, solarChromeMaxFrequency.x ),
        random( 0.01, solarChromeMaxFrequency.y ),
        random( 0.01, solarChromeMaxFrequency.z )
      );
    },

    // Warp amount
    ( frequency : THREE.Vector3 ) => {
      return random( 0.6, 0.8 );
    },

    // Octaves 
    () => {
      return 3
    },

    // Lacunarity
    () => {
      return random( 1.5, 1.5 );
    },

    // Persistance
    () => {
      return random( 0.3, 0.5 );
    },

    // Warp entries
    [
      { 
        warpFunction : noiseWarp,
      }, 
      {
        warpFunction : twistWarp,
        args : {
          twistAmount : new THREE.Vector3( 
            0.8 * Math.random(), 
            0.8 * Math.random(), 
            0.8 * Math.random() 
          ),
          falloff : random( 1.8, 0.4 ),
        }
      }
    ]
  )
})();

export const CurledTubeGeometryPrefab : GeometryPrefab = ( () => {
  const solarChromeMaxFrequency = new THREE.Vector3( 0.35 );
  return generateWarpGeometryPrefab(
    // Geometry
    () => {
      // const geometry = new THREE.SphereBufferGeometry( 1.0, solarLandscapePrefabDetail, solarLandscapePrefabDetail );
      const startWidth = random( 0.1, 0.2 );
      const endWidth = random( 0.1, 0.2 );
      const geometry = new THREE.CylinderBufferGeometry( startWidth, endWidth, random( 5, 10 ), 128, 128, false );

      /*geometry.applyMatrix4( new THREE.Matrix4().scale( new THREE.Vector3(
        random( 0.5, 1.3, ),
        random( 0.5, 1.3, ),
        random( 0.5, 1.3, ),
      )));*/

      return geometry;
    },

    // Frequency
    () => {
      return new THREE.Vector3( 
        random( 0.11, solarChromeMaxFrequency.x ),
        random( 0.11, solarChromeMaxFrequency.y ),
        random( 0.11, solarChromeMaxFrequency.z )
      );
    },

    // Warp amount
    ( frequency : THREE.Vector3 ) => {
      return random( 1.3, 1.5 );
    },

    // Octaves 
    () => {
      return 3
    },

    // Lacunarity
    () => {
      return random( 1.5, 1.5 );
    },

    // Persistance
    () => {
      return random( 0.3, 0.5 );
    },

    // Warp entries
    [
      { 
        warpFunction : noiseWarp,
      }, 
      {
        warpFunction : twistWarp,
        args : {
          twistAmount : new THREE.Vector3( 
            random( -1.8, 1.8 ),
            random( -0.8, 0.8 ),
            random( -1.8, 1.8 ),
          ),
          falloff : random( 0.3, 0.4 ),
        }
      }
    ]
  )
})();
