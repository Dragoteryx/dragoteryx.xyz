struct VsOutput {
	@builtin(position) pos: vec4f,
	@location(0) ent_color: vec3f,
	@location(1) ent_data: vec3f,
};

@group(0) @binding(0)
var<uniform> bounds : vec2f;

fn to_screen(pos: vec2f) -> vec2f {
	return pos / bounds * 2.0 - vec2f(1.0);
}

fn to_world(pos: vec2f) -> vec2f {
	return (pos + vec2f(1.0)) / 2.0 * bounds;
}

@vertex
fn vs_main(
	@builtin(vertex_index) vi: u32,
	@location(0) pos: vec2f,
  @location(1) color: vec3f,
  @location(2) radius: f32,
) -> VsOutput {
	let ev = vi % 6u;

	var offset: vec2f;
	if (ev == 0u) {
		offset = vec2f(-radius, -radius);
	} else if (ev == 1u) {
		offset = vec2f(radius, -radius);
	} else if (ev == 2u) {
		offset = vec2f(radius, radius);
	} else if (ev == 3u) {
		offset = vec2f(-radius, -radius);
	} else if (ev == 4u) {
		offset = vec2f(radius, radius);
	} else {
		offset = vec2f(-radius, radius);
	}

	var out: VsOutput;
	let ndc = to_screen(pos + offset);
	out.pos = vec4f(ndc.x, -ndc.y, 0.0, 1.0);
	out.ent_data = vec3f(pos, radius);
	out.ent_color = color;
	return out;
}

@fragment
fn fs_main(vs: VsOutput) -> @location(0) vec4f {
	let dist = length(vs.pos.xy - vs.ent_data.xy);
  let radius = vs.ent_data.z;
	if (dist > radius) {
		discard;
	}
	
	let aa = 1.0 - smoothstep(radius - 1.5, radius, dist);
	return vec4f(vs.ent_color * aa, 1.0);
}
