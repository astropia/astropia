const vss = `
precision highp float;

uniform vec2 uResolution;

attribute vec3 position;

varying vec2 vUv;

void main() {
  vec2 uv = 0.5 + 0.5 * position.xy;
  vUv = uv * uResolution / uResolution.x;
  gl_Position = vec4(position, 1.0);
}`

const fss = `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
// uniform vec3 uAng;

varying vec2 vUv;

#define iterations 17
#define formuparam 0.53

#define volsteps 17
#define stepsize 0.08

#define zoom   0.800
#define tile   0.850
#define speed  0.002 

#define brightness 0.002
#define darkmatter 0.300
#define distfading 0.650
#define saturation 0.650

float SCurve (float value) {

    if (value < 0.5)
    {
        return value * value * value * value * value * 16.0; 
    }
    
    value -= 1.0;
    
    return value * value * value * value * value * 16.0 + 1.0;
}

void main()
{
	//get coords and direction
	vec2 uv=vUv;
	vec3 dir=vec3(uv*zoom,1.);
	float time=uTime*speed+.25;

	//mouse rotation
	float a1=.5;
	float a2=.8;
	mat2 rot1=mat2(cos(a1),sin(a1),-sin(a1),cos(a1));
	mat2 rot2=mat2(cos(a2),sin(a2),-sin(a2),cos(a2));
	dir.xz*=rot1;
	dir.xy*=rot2;
	vec3 from=vec3(1.,.5,0.5);
	from+=vec3(-time*2.,-time,-2.);
	from.xz*=rot1;
	from.xy*=rot2;
	
	//volumetric rendering
	float s=0.1,fade=1.;
	vec3 v=vec3(0.);
	for (int r=0; r<volsteps; r++) {
		vec3 p=from+s*dir*.5;
		p = abs(vec3(tile)-mod(p,vec3(tile*2.))); // tiling fold
		float pa,a=pa=0.;
		for (int i=0; i<iterations; i++) { 
			p=abs(p)/dot(p,p)-formuparam; // the magic formula
			a+=abs(length(p)-pa); // absolute sum of average change
			pa=length(p);
		}
		float dm=max(0.,darkmatter-a*a*.001); //dark matter
		a = pow(a, 3.5); // add contrast
		if (r>6) fade*=1.-dm; // dark matter, don't render near
		//v+=vec3(dm,dm*.5,0.);
		v+=fade;
		v+=vec3(1.3 * s*s, s-s*s, s+0.2)*a*brightness*fade; // coloring based on distance
		fade*=distfading; // distance fading
		s+=stepsize;
	}
    
	v=mix(vec3(length(v)),v,saturation); //color adjust
    
    vec4 C = vec4(v*.0001,1.);
    
     	C.r = pow(C.r, 0.35); 
 	 	C.g = pow(C.g, 0.36); 
 	 	C.b = pow(C.b, 0.4); 
 	
    vec4 L = C;   	
    
    	C.r = mix(L.r, SCurve(C.r), 1.0); 
    	C.g = mix(L.g, SCurve(C.g), 0.9); 
    	C.b = mix(L.b, SCurve(C.b), 0.6);     	
    
	gl_FragColor = C;	
	
}`

function draw(gl) {
  const vs = gl.createShader(gl.VERTEX_SHADER)
  gl.shaderSource(vs, vss)
  gl.compileShader(vs)
  const fs = gl.createShader(gl.FRAGMENT_SHADER)
  gl.shaderSource(fs, fss)
  gl.compileShader(fs)

  const program = gl.createProgram()
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)

  gl.useProgram(program)

  const aPostion = gl.getAttribLocation(program, 'position')
  const uResolution = gl.getUniformLocation(program, 'uResolution')
  const uTime = gl.getUniformLocation(program, 'uTime')

  gl.uniform2f(uResolution, window.innerWidth, window.innerHeight)

  const vertices = [-1, 1, 0, -1, -1, 0, 1, -1, 0, 1, 1, 0]
  const vertexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)

  const indices = [0, 1, 2, 0, 2, 3]
  const indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.vertexAttribPointer(aPostion, 3, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(aPostion)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)

  function draw(time) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.uniform1f(uTime, time / 1000)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)

    requestAnimationFrame(draw)
  }

  window.addEventListener('resize', () => {
    gl.uniform2f(uResolution, window.innerWidth, window.innerHeight)
    gl.viewport(0, 0, window.innerWidth, window.innerHeight)
  })

  requestAnimationFrame(draw)
}

;(() => {
  const canvas = document.createElement('canvas')
  canvas.id = 'background'
  canvas.width = innerWidth * 0.8
  canvas.height = innerHeight * 0.8
  canvas.style.width = innerWidth + 'px'
  canvas.style.height = innerHeight + 'px'
  const gl = canvas.getContext('webgl')
  draw(gl)

  document.body.append(canvas)

  window.addEventListener('resize', () => {
    canvas.width = innerWidth * 0.8
    canvas.height = innerHeight * 0.8
    canvas.style.width = innerWidth + 'px'
    canvas.style.height = innerHeight + 'px'
  })
})()