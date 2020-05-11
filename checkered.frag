#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

// Definitions
#define ColorA vec3(0.5, 0.5, 0.5)
#define ColorB vec3(0.8, 0.8, 0.8)
#define BoxSize 64.0
#define SpeedX 10.0
#define SpeedY 20.0

float Edge(float Origin, float Position, float Size) {
	// Assuming this function only gets called outside of the slice
	// we only need to find a smooth edge that's defined as the
	// inverted distance from the edge

	// First we find a relative position of a pixel
	float Relation = Position - Origin;
	float Result;

	// Finding the distance from the edge and inverting it
	if (Relation > 0.0) Result = 1.0 - (Relation - Size);
	else Result = 1.0 + Relation;

	// Clamping the value to it doesn't go below 0
	return clamp(Result, 0.0, 1.0);
}

// Returns the left (or bottom for Y) position
// that repeats itself periodically each Size
float Left(float Input, float Size) {
	return floor(Input/Size) * Size;
}

// True every second slice of a certain Size
bool EachSecond(float Input, float Size) {
	if (mod(Input/Size, 2.0) > 1.0)
		return true;
	else return false;
}

void main(void) {
	float Result = 0.0;

	// Move position with time
	vec2 Position = vec2(
		gl_FragCoord.x + u_time * SpeedX,
		gl_FragCoord.y + u_time * SpeedY
	);

	/*
		We find if current pixel's position is inside the slice
		and if it's not - we smooth the edges of slices using Edge()

		We do this once verticaly and once horizontaly, and then
		negative-overlap the results to get the checkered pattern
	*/

	// Vertical slices
	if (EachSecond(Position.y, BoxSize)) {
		Result += Edge(	// Slice below
			Left(Position.y, BoxSize) - BoxSize,
			Position.y,
			BoxSize
		);
		Result += Edge(	// Slice above
			Left(Position.y, BoxSize) + BoxSize,
			Position.y,
			BoxSize
		);
	} else Result += 1.0;

	// Horizontal slices
	if (EachSecond(Position.x, BoxSize)) {
		Result -= Edge(	// Left slice
			Left(Position.x, BoxSize) - BoxSize,
			Position.x,
			BoxSize
		);
		Result -= Edge(	// Right slice
			Left(Position.x, BoxSize) + BoxSize,
			Position.x,
			BoxSize
		);
	} else Result -= 1.0;

	// The absolute will be the checkered pattern
	Result = abs(Result);

	// Apply colors to the pattern and output
	gl_FragColor = vec4(
		mix(ColorA, ColorB, Result),
		1.0
	);
}
