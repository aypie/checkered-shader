#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;

#define ColorA vec3(0.5, 0.5, 0.5)
#define ColorB vec3(0.8, 0.8, 0.8)
#define CheckSize 64.0
#define SpeedX 10.0
#define SpeedY 20.0

float Slice(float Position) {
	float Offset = mod(Position, CheckSize * 2.0);
	return
		clamp(1.0 - Offset, 0.0, 1.0) +
		clamp(Offset - (CheckSize - 1.0), 0.0, 1.0);
}

void main(void) {
	vec2 Position = vec2(
		gl_FragCoord.x + u_time * SpeedX,
		gl_FragCoord.y + u_time * SpeedY
	);

	gl_FragColor = vec4(
		mix(
			ColorA, ColorB,
			abs(Slice(Position.x) - Slice(Position.y))
		),
		1.0
	);
}
