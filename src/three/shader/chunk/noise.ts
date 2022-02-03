import { ShaderChunk } from '../core';

// https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83

export const random2dChunk : ShaderChunk = {

  content: `

    float random2d(vec2 n) { 
      return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }

    `,
  
  functionSignatures: {
    'random2d': {
      parameters: [ [ 'vec2', 'n' ] ],
      returnType: 'float',
    }
  }
};

export const simplex2dChunk : ShaderChunk = {

  content: `

  // Simplex 2D noise
  //
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

  float simplex2d(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
            -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  `,

  functionSignatures: {
    'simplex2d': {
      parameters: [ [ 'vec2', 'v' ] ],
      returnType: 'float',
    }
  }
};

export const simplex3dChunk : ShaderChunk = {

  content: `
    //	Simplex 3D Noise 
    //	by Ian McEwan, Ashima Arts
    //
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

    float simplex3d(vec3 v){ 
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 =   v - i + dot(i, C.xxx) ;

    // Other corners
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );

      //  x0 = x0 - 0. + 0.0 * C 
      vec3 x1 = x0 - i1 + 1.0 * C.xxx;
      vec3 x2 = x0 - i2 + 2.0 * C.xxx;
      vec3 x3 = x0 - 1. + 3.0 * C.xxx;

    // Permutations
      i = mod(i, 289.0 ); 
      vec4 p = permute( permute( permute( 
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
              + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    // Gradients
    // ( N*N points uniformly over a square, mapped onto an octahedron.)
      float n_ = 1.0/7.0; // N=7
      vec3  ns = n_ * D.wyz - D.xzx;

      vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );

      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);

    //Normalise gradients
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;

    // Mix final noise value
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      float n = 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                    dot(p2,x2), dot(p3,x3) ) );

      n = ( n + 1.0 ) / 2.0;
      return clamp( n, 0.0, 1.0 );
    }

    `,

  functionSignatures: {
    'simplex3d': {
      parameters: [ [ 'vec3', 'v' ] ],
      returnType: 'float',
    }
  }
};

export const genericNoise3dChunk : ShaderChunk = {
  content: `
//	<https://www.shadertoy.com/view/4dS3Wd>
//	By Morgan McGuire @morgan3d, http://graphicscodex.com
//
float hash(float n) { return fract(sin(n) * 1e4); }
float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }

// This one has non-ideal tiling properties that I'm still tuning
float noise3d(vec3 x) {
	const vec3 step = vec3(110, 241, 171);

	vec3 i = floor(x);
	vec3 f = fract(x);
 
	// For performance, compute the base input to a 1D hash from the integer part of the argument and the 
	// incremental change to the 1D based on the 3D -> 1D wrapping
    float n = dot(i, step);

	vec3 u = f * f * (3.0 - 2.0 * f);
	return mix(mix(mix( hash(n + dot(step, vec3(0, 0, 0))), hash(n + dot(step, vec3(1, 0, 0))), u.x),
                   mix( hash(n + dot(step, vec3(0, 1, 0))), hash(n + dot(step, vec3(1, 1, 0))), u.x), u.y),
               mix(mix( hash(n + dot(step, vec3(0, 0, 1))), hash(n + dot(step, vec3(1, 0, 1))), u.x),
                   mix( hash(n + dot(step, vec3(0, 1, 1))), hash(n + dot(step, vec3(1, 1, 1))), u.x), u.y), u.z);
}
  `,

  functionSignatures: {
    'noise3d': {
      parameters: [ [ 'vec3', 'x' ] ],
      returnType: 'float',
    }
  }
};

// Adapted from https://www.shadertoy.com/view/flSGDK
export const voronoi3dChunk : ShaderChunk = {
  content: `
float hash(float x) { return fract(x + 1.3215f * 1.8152f); }

float hash3(vec3 a) { return fract((hash(a.z * 42.8883f) + hash(a.y * 36.9125f) + hash(a.x * 65.4321f)) * 291.1257f); }

vec3 rehash3(float x) { return vec3(hash(((x + 0.5283f) * 59.3829f) * 274.3487f), hash(((x + 0.8192f) * 83.6621f) * 345.3871f), hash(((x + 0.2157f) * 36.6521f) * 458.3971f)); }

float sqr(float x) {return x*x;}
float fastdist(vec3 a, vec3 b) { return sqr(b.x - a.x) + sqr(b.y - a.y) + sqr(b.z - a.z); }

float eval(float x, float y, float z) {
    vec4 p[27];
    for (int _x = -1; _x < 2; _x++) for (int _y = -1; _y < 2; _y++) for(int _z = -1; _z < 2; _z++) {
        vec3 _p = vec3(floor(x), floor(y), floor(z)) + vec3(_x, _y, _z);
        float h = hash3(_p);
        p[(_x + 1) + ((_y + 1) * 3) + ((_z + 1) * 3 * 3)] = vec4((rehash3(h) + _p).xyz, h);
    }
    float m = 9999.9999f;
    //float w = 0.0f;
    for (int i = 0; i < 27; i++) {
        float d = fastdist(vec3(x, y, z), p[i].xyz);
        if(d < m) { 
          m = d; 
          // w = p[i].w; 
        }
    }
    // return vec2(m, w);
    return m;
}

float voronoi3d( vec3 p )
{
    // vec2 n = eval( p.x, p.y, p.z );
    float n = eval( p.x, p.y, p.z );
    // return 1.0 - sqrt( n.x );
    return sqrt(n);
}
  
  `,

  functionSignatures: {
    'voronoi3d': {
      parameters: [ [ 'vec3', 'p' ] ],
      returnType: 'float'
    }
  }
};