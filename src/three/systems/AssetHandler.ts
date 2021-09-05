import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

type ProgressCallback = 
    ( path : string | null, numberOfAssetsLoaded : number, numberOfAssetsToLoad : number ) => void;

type LoadedCallback = () => void;

type LoadMethod = ( path : string ) => any;

type TextureLoadCallback = ( texture : THREE.Texture ) => void;

class AssetHandler {
    loadManager: THREE.LoadingManager;
    textureLoader: THREE.TextureLoader;
    gltfLoader: GLTFLoader;
    rgbeLoader: RGBELoader;
    cache: Map<string, any>;
    toLoad: number;
    loaded: number;
    onProgress: ProgressCallback | null;

    constructor() {
        this.loadManager = new THREE.LoadingManager();

        this.textureLoader = new THREE.TextureLoader( this.loadManager );
        this.gltfLoader = new GLTFLoader();
        this.rgbeLoader = new RGBELoader();
        this.rgbeLoader.setDataType( THREE.UnsignedByteType );

        // Asset cache
        this.cache = new Map<string, any>();

        // Number of assets left to load
        this.toLoad = 0;

        // Number of assets loaded
        this.loaded = 0;

        // On progress callback
        this.onProgress = null;
    }


    onLoad( onProgress? : ProgressCallback, onLoad? : LoadedCallback ) {
        if( onLoad ) this.loadManager.onLoad = onLoad;
        if( onProgress ) this.onProgress = onProgress;

        if( this.toLoad === this.loaded ) {
            onLoad && onLoad();
            onProgress && onProgress( null, 0, 0 );
        }

        return this;
    }

    _loaded( path : string ) {
        this.loaded++;
        this.onProgress && this.onProgress( path, this.loaded, this.toLoad );
    }

    _load( path : string, method : LoadMethod ) {
        // If asset is already loaded, return cached instance
        if( this.cache.has(path) ) {
            return this.cache.get( path );
        }

        // Increment number of assets to load
        this.toLoad++;

        // Otherwise, load asset
        const asset = method( path );

        // And add the asset to the cache
        this.cache.set( path, asset );

        // And return the final asset
        return asset;
    }

    loadTexture( path : string, useSRGB : boolean, callback? : TextureLoadCallback ) : THREE.Texture {
        return this._load(path, (p) => { 
            const texture = this.textureLoader.load(p, texture => {
                callback && callback( texture );
                this._loaded( path );
            });
            if( useSRGB ) texture.encoding = THREE.sRGBEncoding;
            return texture;
        });
    }

    /*async loadGLTF(path) {
        return this._load(path, async (p) => {
            const model = await this.gltfLoader.loadAsync(p);

            this._loaded(path);

            return model;
        });
    }*/

    loadHDR( renderer : THREE.WebGLRenderer, path : string, onLoad : TextureLoadCallback ) {
        const pmremGenerator = new THREE.PMREMGenerator( renderer );
        pmremGenerator.compileCubemapShader();

        return this._load( path, p => {
            return this.rgbeLoader.load( p, ( texture ) => {
                const envMap = pmremGenerator.fromEquirectangular( texture ).texture;
                onLoad( envMap );
                this._loaded( path );
            });
        });
    }

    /* loadImageHDRI(renderer, path, onLoad) {
        return this._load(path, (p) => {
            const texture = this.textureLoader.load(p, () => {
                const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
                rt.fromEquirectangularTexture(renderer, texture);

                onLoad && onLoad(rt.texture);

                return rt.texture;
            });
            this._loaded(path);
            return texture;
        });
    } */
};

const ASSETHANDLER = new AssetHandler();

export {
    ASSETHANDLER
}
