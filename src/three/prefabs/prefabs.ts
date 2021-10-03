import * as THREE from 'three';
import { random } from '../../utils/Random';
import { noiseWarp, twistWarp } from '../geometry/warp/warp';
import { generateWarpGeometryPrefab } from './WarpGeometryPrefab';

import { ASSETHANDLER } from '../systems/AssetHandler';
import { textureFromSmoothGeometry } from '../material/textureFromVertices';
import { getNoise3D } from '../utils/noise';

import normalTexturePathX1 from '../../assets/normal/normal-texture1.jpg';
import normalTexturePathX2 from '../../assets/normal/normal-texture1_x2.jpg';
import normalTexturePathX4 from '../../assets/normal/normal-texture1_x4.jpg';

export type Prefab<T, A> = ( args : A ) => T;
export type MaterialPrefab = Prefab<THREE.Material, {}>;
export type GeometryPrefab = Prefab<THREE.BufferGeometry, {}>;

//////////////////
// SOLAR CHROME //
//////////////////
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
        random( 0.15, solarChromeMaxFrequency.x ),
        random( 0.15, solarChromeMaxFrequency.y ),
        random( 0.15, solarChromeMaxFrequency.z )
      );
    },

    // Warp amount
    ( frequency : THREE.Vector3 ) => {
      return ( solarChromeMaxFrequency.length() - frequency.length() ) * random( 6.0, 8.0 ) + 0.1 
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
          falloff : random( 0.5, 1.0 ),
        }
      }
    ]
  )
})();

/*export const SolarChromeMaterialPrefab : Prefab<THREE.MeshStandardMaterial, {}> = () => {
  const material = new THREE.MeshStandardMaterial( {
    color: 'white',
    roughness: random( 0.15, 0.4 ),
    metalness: 0.7,

    side: THREE.DoubleSide,
  });

  material.envMapIntensity = 0.7;

  ASSETHANDLER.loadTexture( solarChromeNormalTexturePath, false, ( texture ) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.LinearFilter;

    texture.repeat.set( 10.0, 10.0 );

    material.normalMap = texture;
    material.normalScale = new THREE.Vector2( 0.1 );
    material.needsUpdate = true;
  });

  return material;
}*/

export const SolarChromeMaterialPrefab : Prefab<THREE.MeshStandardMaterial, { geometry : THREE.BufferGeometry }> = ( { geometry } ) => {
  const material = new THREE.MeshStandardMaterial( {
    color: 'white',
    roughness: random( 0.15, 0.4 ),
    metalness: 0.7,

    side: THREE.DoubleSide,
  });

  const roughnessMap = textureFromSmoothGeometry( 
    geometry,
    ( x, y, z, u, v ) => {
      const n = getNoise3D( { x, y, z }, null, 0.8, 0.5, 1.0 );
      return new THREE.Color( n, n, n )
    },
    new THREE.Color( 'red' )
  );

  const metalnessMap = textureFromSmoothGeometry( 
    geometry,
    ( x, y, z, u, v ) => {
      const n = getNoise3D( { x, y, z }, { x : 100, y : 0, z : 0 }, 1.0, 0.8, 1.0 );
      return new THREE.Color( n, n, n )
    },
    new THREE.Color( 'red' )
  );
  
  material.roughnessMap = roughnessMap;
  material.metalnessMap = metalnessMap;

  material.envMapIntensity = 0.7;

  ASSETHANDLER.loadTexture( normalTexturePathX4, false, ( texture ) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.LinearFilter;

    material.normalMap = texture;
    material.normalScale = new THREE.Vector2( 0.1 );
    material.needsUpdate = true;
  });

  return material;
}

//////////////////////
// SOLAR LANDSCAPES //
//////////////////////
const solarLandscapePrefabDetail = 228;

export const SolarLandscapeGeometry1Prefab : GeometryPrefab = ( () => {
  const solarChromeMaxFrequency = new THREE.Vector3( 0.2 );
  return generateWarpGeometryPrefab(
    // Geometry
    () => {
      const geometry = new THREE.SphereBufferGeometry( 1.0, solarLandscapePrefabDetail, solarLandscapePrefabDetail );

      geometry.applyMatrix4( new THREE.Matrix4().scale(
        new THREE.Vector3( 1.0, 5.0, 1.0 )
      ) );

      return geometry;
    },

    // Frequency
    () => {
      return new THREE.Vector3( 
        random( 0.05, solarChromeMaxFrequency.x ), 
        random( 0.05, solarChromeMaxFrequency.y ),
        random( 0.05, solarChromeMaxFrequency.z )
      );
    },

    // Warp amount
    ( frequency : THREE.Vector3 ) => {
      return random( 0.2, 0.6 );
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

export const SolarLandscapeGeometry2Prefab : GeometryPrefab = ( () => {
  const solarChromeMaxFrequency = new THREE.Vector3( 0.25 );
  return generateWarpGeometryPrefab(
    // Geometry
    () => {
      return new THREE.TorusGeometry( 1.0, random( 0.1, 0.5 ), 128, 128 );
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
      return random( 0.4, 2.0 );
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
          falloff : random( 0.5, 1.0 ),
        }
      }
    ]
  )
})();

export const SolarLandscapeGeometry3Prefab : GeometryPrefab = ( () => {
  const solarChromeMaxFrequency = new THREE.Vector3( 0.15 );
  return generateWarpGeometryPrefab(
    // Geometry
    () => {
      const geometry = 
      new THREE.SphereBufferGeometry( 1.0, solarLandscapePrefabDetail, solarLandscapePrefabDetail );

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
          falloff : random( 0.3, 0.4 ),
        }
      }
    ]
  )
})();

export const SolarLandscapeMaterial1Prefab : Prefab<THREE.MeshStandardMaterial, { color : THREE.Color }> = ( {
  color
} ) => {
  const material = new THREE.MeshStandardMaterial( {
    color: color,
    roughness: random( 0.1, 0.4 ),
    metalness: 0.1,

    side: THREE.DoubleSide,
  });

  material.envMapIntensity = 0.4;

  ASSETHANDLER.loadTexture( normalTexturePathX2, false, ( texture ) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.LinearFilter;

    // texture.repeat.set( 7.0, 7.0 );

    material.normalMap = texture;
    material.normalScale = new THREE.Vector2( random( 0.0, 0.08 ) );
    material.needsUpdate = true;
  });

  return material;
}

export const SolarLandscapeMaterial2Prefab : Prefab<THREE.MeshStandardMaterial, { color : THREE.Color }> = ( {
  color
} ) => {
  const material = new THREE.MeshStandardMaterial( {
    color: color,
    roughness: random( 0.3, 0.5 ),
    metalness: 0.7,

    side: THREE.DoubleSide,
  });
  
  material.envMapIntensity = 0.5;

  ASSETHANDLER.loadTexture( normalTexturePathX2, false, ( texture ) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.LinearFilter;

    // const textureRepeat = random( 5.0, 7.0 );
    // texture.repeat.set( textureRepeat, textureRepeat );

    material.normalMap = texture;
    material.normalScale = new THREE.Vector2( random( 0.2, 0.6 ) );
    material.needsUpdate = true;
  });

  return material;
}

export const SolarLandscapeMaterial3Prefab : Prefab<THREE.MeshStandardMaterial, { color : THREE.Color }> = ( {
  color
} ) => {
  const material = new THREE.MeshStandardMaterial( {
    color: color,
    emissive: color,
    emissiveIntensity: 7.0,
    roughness: random( 0.3, 0.5 ),
    metalness: 0.7,

    side: THREE.DoubleSide,
  });
  
  material.envMapIntensity = 0.5;

  ASSETHANDLER.loadTexture( normalTexturePathX2, false, ( texture ) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.LinearFilter;

    // const textureRepeat = random( 5.0, 7.0 );
    // texture.repeat.set( textureRepeat, textureRepeat );

    material.normalMap = texture;
    material.normalScale = new THREE.Vector2( random( 0.1, 0.5 ) );
    material.needsUpdate = true;
  });

  return material;
}