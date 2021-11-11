import { BinaryOperation, Function, Trigonometry } from '../../core';

export type FunctionWithName = {
  name : string,
  func : Function
}

export type FunctionCache = Map<any, FunctionWithName>;

export type Domain = 'uv' | 'vertex' | 'view';

export type Modification = {
  kind : 'add' | 'mult' | 'pow' | 'mod',
  argument : number,
}

export type SourceKind = 'noise' | 'trig' | 'combined' | 'warped' | 'texture';

export type RootSource = {
  kind : SourceKind,
  domain? : Domain
}

export type NoiseSource = RootSource & {
  frequency : THREE.Vector3,
  amplitude? : number,
  pow? : number,
  octaves? : number,
  persistance? : number,
  lacunarity? : number,
  ridge? : number,
}

export type TrigSource = RootSource & {
  types : { 
    x : Trigonometry,
    y : Trigonometry,
    z : Trigonometry
  },
  frequency? : THREE.Vector3,
  amplitude? : THREE.Vector3,
  combinationOperation? : Exclude<BinaryOperation, 'div'>,
  pow? : number,
}

export type CombinedSource = RootSource & {
  sources : Source[],
  operation : BinaryOperation,
  multipliers? : number[],
  postModifications? : Modification | Modification[]
}

export type WarpedSource = RootSource & {
  source : Source,
  warp : DomainWarp,
}

export type TextureSource = RootSource & {
  name : string,
  texture : THREE.Texture,
  toFloat? : Function,
}

export type Source = NoiseSource | TrigSource | CombinedSource | WarpedSource | TextureSource;

export type DomainWarp = {
  sources : {
    x : Source,
    y : Source,
    z : Source,
  },
  amount? : THREE.Vector3,
  iterations? : number,
}

export type ColorMode = 'rgb' | 'hsv';

export type ColorSettings = {
  mode : ColorMode,
  componentModifications? : {
    x? : Modification | Modification[],
    y? : Modification | Modification[],
    z? : Modification | Modification[],
    a? : Modification | Modification[],
  }
}

// Settings
export type PatternShaderSettings = {
  domain : Domain,
  scale? : number,
  timeOffset? : THREE.Vector3,

  mainSource : Source,
  domainWarp? : DomainWarp,

  colorSettings? : ColorSettings,

  seed? : number,
}
