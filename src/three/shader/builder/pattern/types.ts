import { Operation, GlslFunction, Trigonometry, GLSL, GlslVariables } from '../../core';

export type FunctionWithName = {
  name : string,
  func : GlslFunction,
  globals ?: GlslVariables
  cached ?: boolean
}

export type FunctionCache = Map<any, FunctionWithName>;

export type Domain = 'uv' | 'vertex' | 'view';

export type NoiseFunctionName = 'noise3d' | 'simplex3d';

export type Modification = {
  kind : 'add' | 'mult' | 'pow' | 'mod',
  argument : number | Source,
}

export type SourceKind = 'noise' | 'trig' | 'combined' | 'warped' | 'texture' | 'custom' | 'constant';

export type RootSource = {
  kind : SourceKind,
  uvOverride ?: boolean,
}

export type Amount = number | Source;

export type ConstantSource = RootSource & {
  kind : 'constant'
  value : number
}

export type NoiseSource = RootSource & {
  kind : 'noise',
  frequency : THREE.Vector3,
  amplitude ?: Amount,
  pow ?: Amount,
  octaves ?: number,
  persistance ?: Amount,
  lacunarity ?: Amount,
  ridge ?: Amount,
  normalize ?: boolean,

  noiseFunctionName ?: NoiseFunctionName
}

export type TrigSource = RootSource & {
  kind : 'trig',
  types : { 
    x : Trigonometry,
    y : Trigonometry,
    z : Trigonometry
  },
  frequency ?: THREE.Vector3,
  amplitude ?: THREE.Vector3,
  combinationOperation ?: Exclude<Operation, 'div'>,
  pow ?: number,
  normalize ?: boolean
}

export type CombinedSource = RootSource & {
  kind : 'combined',
  sources : Source[],
  operation : Operation,
  multipliers ?: number[],
  postModifications ?: Modification | Modification[]
}

export type WarpedSource = RootSource & {
  kind : 'warped',
  source : Source,
  warp : DomainWarp,
}

export type TexelToFloatFunction = GlslFunction & {
  parameters : [ [ 'vec4', 'color' ] ],
  returnType : 'float',
  body : string
}

export type TextureSource = RootSource & {
  kind : 'texture',
  name : string,
  texture : THREE.Texture | null,
  repeat ?: THREE.Vector2,
  toFloat ?: TexelToFloatFunction,
}

export type CustomSource = RootSource & {
  kind : 'custom',
  body : GLSL
}

export type Source = ConstantSource | NoiseSource | TrigSource | CombinedSource | WarpedSource | TextureSource | CustomSource;

export type DomainWarp = {
  sources : {
    x : Source,
    y : Source,
    z : Source,
  },
  amount ?: Amount | THREE.Vector3 | [ Amount, Amount, Amount ],
  iterations ?: number,
}

export type ColorMode = 'rgb' | 'hsv';

export type ColorSettings = {
  mode : ColorMode,
  componentModifications ?: {
    x ?: Modification | Modification[],
    y ?: Modification | Modification[],
    z ?: Modification | Modification[],
    a ?: Modification | Modification[],
  }
}

export type Fog = {
  nearColor : THREE.Color,
  farColor : THREE.Color,
  near : number,
  far : number,
  pow ?: number,
  opacity ?: number,
}

export type SoftParticleSettings = {
  depthTexture : THREE.DepthTexture,
  camera : THREE.PerspectiveCamera | THREE.OrthographicCamera,
  pow ?: number,
  falloffRange ?: number,
  smooth ?: boolean,
}

// Settings
export type PatternShaderSettings = {
  domain : Domain,
  scale ?: number,
  timeOffset ?: THREE.Vector3,

  mainSource : Source,
  domainWarp ?: DomainWarp,
  noiseFunction ?: NoiseFunctionName,

  colorSettings ?: ColorSettings,

  mask ?: Source,
  alphaMask ?: Source,
  fog ?: Fog,

  seed ?: number,

  forInstancedMesh ?: boolean,

  softParticleSettings ?: SoftParticleSettings
}
