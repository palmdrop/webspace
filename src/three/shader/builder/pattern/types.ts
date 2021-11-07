import { BinaryOperation, GLSL, Trigonometry } from '../../core';

export enum PointVariable {
  samplePoint = 'samplePoint',
  origin = 'origin',
}

export type Domain = 'uv' | 'vertex' | 'view';

export type NoiseSource = {
  kind : string,
  frequency : THREE.Vector3,
  amplitude? : number,
  pow? : number,
  octaves? : number,
  persistance? : number,
  lacunarity? : number,
  ridge? : number,
}

export type TrigSource = {
  kind : string,
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

export type CustomSource = {
  glsl : GLSL,
}

export type Source = NoiseSource | TrigSource;

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

export type PatternShaderSettings = {
  domain : Domain,
  scale? : number,
  timeOffset? : THREE.Vector3,

  mainSource : Source,
  domainWarp? : DomainWarp,
}
