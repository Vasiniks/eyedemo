
		precision mediump float;
		varying vec2 vUV;
		uniform float progress; // = 0.0
		uniform float centerX; // = 0.5
		uniform float centerY; // = 0.0
		uniform float width; // = 1.2
		uniform float height; // = 1.5
		uniform float opacity; // = 1.0
		uniform float smoothness; // = 0.2
		uniform float scrim; // = 1.0
		uniform bool opening; // = true
		vec2 center = vec2(centerX, centerY);
		// cheap ellipse func from iq.
		float ellipse(vec2 center, vec2 uv, float a, float b)
		{
			center = center - uv;
			a = 1.0 / a;
			b = 1.0 / b;
			return (length(center*vec2(a, b)) - 1.0) / (length(center*vec2(a*a, b*b)));
		}
		void main() {
			float distance = ellipse(center, vUV, width, height);
			float edge = smoothstep(distance - smoothness, distance + smoothness, 0.0);
			float directionEdge = opening ? edge : 1.-edge;
			vec4 color = directionEdge * vec4(vec3(0.), 1.);
			color = opacity * color;
			gl_FragColor = mix(color, vec4(vec3(0.), 1.), scrim);
		}
	