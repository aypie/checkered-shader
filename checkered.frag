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

// Returns how much a position is inside a slice of a certain width
// The slice will have a smoothed edge to avoid movement aliasing
float Box(float Origin, float Position, float Size) {
	float Result;

	// First we find a relative position of a pixel
	float Relation = Position - Origin;

	// If the pixel is actually inside the "box" - return 1
	// If not, return inverted distance from the edge for the smoothing effect
	if (Relation > 0.0) {
		if (Relation < Size) {
			Result = 1.0;
		} else Result = 1.0 - (Relation - Size);
	} else Result = 1.0 + Relation;

	// Clamp result so the inverted distance doesnt go lower than 0
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
		and if it's not - we smooth the edges of slices using Box()

		We do this once verticaly and once horizontaly, and then
		negative-overlap the results to get the checkered pattern
	*/

	// Vertical slices
	if (EachSecond(Position.y, BoxSize)) {
		Result += Box(	// Slice below
			Left(Position.y, BoxSize) - BoxSize,
			Position.y,
			BoxSize
		);
		Result += Box(	// Slice above
			Left(Position.y, BoxSize) + BoxSize,
			Position.y,
			BoxSize
		);
	} else Result += 1.0;

	// Horizontal slices
	if (EachSecond(Position.x, BoxSize)) {
		Result -= Box(	// Left slice
			Left(Position.x, BoxSize) - BoxSize,
			Position.x,
			BoxSize
		);
		Result -= Box(	// Right slice
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
