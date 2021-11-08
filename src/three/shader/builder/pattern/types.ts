import { BinaryOperation, Function, GLSL, Trigonometry } from '../../core';

export enum PointVariable {
  samplePoint = 'samplePoint',
  origin = 'origin',
}

export type FunctionWithName = {
  name : string,
  func : Function
}

export type Domain = 'uv' | 'vertex' | 'view';

export type Modification = {
  kind : 'add' | 'mult' | 'pow' | 'mod',
  argument : number,
}

export type SourceKind = 'noise' | 'trig' | 'combined' | 'warped';
export type RootSource = {
  kind : SourceKind
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
  kind : string,
  source : Source,
  warp : DomainWarp,
}

// TODO add support for composite source! source made up of multiple sources, warped, combined, multed etc
export type Source = NoiseSource | TrigSource | CombinedSource | WarpedSource;

export type DomainWarp = {
  sources : {
    x : Source,
    y : Source,
    z : Source,
  },
  amount? : THREE.Vector3,
  iterations? : number,

  inputVariable : PointVariable,
}

export type ColorMode = 'rgb' | 'hsb';

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

  colorSettings? : ColorSettings
}
