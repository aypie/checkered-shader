#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

// Definitions
#define ColorA vec3(0.5, 0.5, 0.5)
#define ColorB vec3(0.8, 0.8, 0.8)
#define CheckSize 64.0
#define SpeedX 10.0
#define SpeedY 20.0

// Smooth the slices by adding a one-pixel wide fallof on the edges
float Edge(float Origin, float Position, float Size) {
	// Assuming this function only gets called outside of the slice
	// we only need to find a smooth edge that's defined as the
	// inverted distance from the edge

	// First we find a relative position of a pixel
	float Relation = Position - Origin;

	// Finding the distance from the edge and inverting it
	// Then clamping it so it doesn't go below 0
	if (Relation > 0.0)
	return clamp(1.0 - (Relation - Size), 0.0, 1.0);
	return clamp(1.0 + Relation, 0.0, 1.0);
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
	if (EachSecond(Position.y, CheckSize)) {
		Result += Edge(	// Slice below
			Left(Position.y, CheckSize) - CheckSize,
			Position.y,
			CheckSize
		);
		Result += Edge(	// Slice above
			Left(Position.y, CheckSize) + CheckSize,
			Position.y,
			CheckSize
		);
	} else Result += 1.0;

	// Horizontal slices
	if (EachSecond(Position.x, CheckSize)) {
		Result -= Edge(	// Left slice
			Left(Position.x, CheckSize) - CheckSize,
			Position.x,
			CheckSize
		);
		Result -= Edge(	// Right slice
			Left(Position.x, CheckSize) + CheckSize,
			Position.x,
			CheckSize
		);
	} else Result -= 1.0;

	// The absolute of the Result will contain the checkered pattern
	
	// Apply colors to the pattern and output
	gl_FragColor = vec4(
		mix(ColorA, ColorB, abs(Result)),
		1.0
	);
}
