type ShaderVariable<T> = {
  name : string,
  value : T,
}

type ShaderChunk<T> = {
  content : string,
  use : ( args : T ) => string,
}