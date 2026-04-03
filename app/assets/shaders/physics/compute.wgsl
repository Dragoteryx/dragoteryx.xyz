struct Entity {
	curr_pos: vec2f,
	prev_pos: vec2f,
	color: vec3f,
	radius: f32,
}

struct Aabb {
	min: vec2f,
	max: vec2f,
}

@group(0) @binding(0)
var<storage, read> entities_in: array<Entity>;

@group(0) @binding(1)
var<storage, read_write> entities_out: array<Entity>;

@group(0) @binding(2)
var<uniform> entity_count: u32;

@group(0) @binding(3)
var<uniform> gravity: vec2f;

@group(0) @binding(4)
var<uniform> bounds: vec2f;

const DT = 1.0 / 60.0 / 16.0;
const DT_SQ = DT * DT;

fn calc_aabb(pos: vec2f, radius: f32) -> Aabb {
	let offset = vec2f(radius, radius);
	return Aabb(pos - offset, pos + offset);
}

fn calc_morton_code(pos: vec2f) -> u32 {
	let x = clamp(pos.x / bounds.x, 0.0, 1.0);
	let y = clamp(pos.y / bounds.y, 0.0, 1.0);
	let ix = u32(clamp(x, 0.0, 1.0) * 0xFFFF);
	let iy = u32(clamp(y, 0.0, 1.0) * 0xFFFF);
	return (spread_bits(iy) << 1) | spread_bits(ix);
}

fn spread_bits(x: u32) -> u32 {
	var code = x & 0x0000ffffu;
	code = (code | (code << 8u)) & 0x00ff00ffu;
	code = (code | (code << 4u)) & 0x0f0f0f0fu;
	code = (code | (code << 2u)) & 0x33333333u;
	code = (code | (code << 1u)) & 0x55555555u;
	return code;
}

@compute @workgroup_size(64)
fn update_positions(@builtin(global_invocation_id) gid: vec3u) {
	let i = gid.x;
	if (i < entity_count) {
		var ent = entities_in[i];
		let next_pos = ent.curr_pos * 2 - ent.prev_pos + gravity * DT_SQ;
		ent.prev_pos = ent.curr_pos;
		ent.curr_pos = next_pos;
		entities_out[i] = ent;
	}
}

@compute @workgroup_size(64)
fn resolve_collisions(@builtin(global_invocation_id) gid: vec3u) {
	let i = gid.x;
	if (i < entity_count) {
		var ent1 = entities_in[i];
		for (var j = 0u; j < entity_count; j++) {
			if (i != j) {
				let ent2 = entities_in[j];
				let pos1 = ent1.curr_pos;
				let pos2 = ent2.curr_pos;
				let radius1 = ent1.radius;
				let radius2 = ent2.radius;
				let axis = pos1 - pos2;
				let dist = length(axis);
				let delta = radius1 + radius2 - dist;
				if (delta > 0.0) {
					var bias: f32;
					if (i % 2 == j % 2) {
						bias = -0.01;
					} else {
						bias = 0.01;
					}

					let cos_a = cos(bias);
					let sin_a = sin(bias);
					let normal = axis / dist;
					let rotated_normal = vec2f(
						normal.x * cos_a - normal.y * sin_a,
						normal.x * sin_a + normal.y * cos_a,
					);

					ent1.curr_pos += rotated_normal * delta * 0.25;
				}
			}
		}

		entities_out[i] = ent1;
	}
}

@compute @workgroup_size(64)
fn apply_world_bounds(@builtin(global_invocation_id) gid: vec3u) {
	let i = gid.x;
	if (i < entity_count) {
		var ent = entities_in[i];
		let radius = ent.radius;
		let aabb = calc_aabb(ent.curr_pos, radius);

		if (aabb.min.x < 0.0) {
			ent.curr_pos.x = radius;
		} else if (aabb.max.x > bounds.x) {
			ent.curr_pos.x = bounds.x - radius;
		}

		if (aabb.min.y < 0.0) {
			ent.curr_pos.y = radius;
		} else if (aabb.max.y > bounds.y) {
			ent.curr_pos.y = bounds.y - radius;
		}

		entities_out[i] = ent;
	}
}
