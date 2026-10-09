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

struct Node {
	aabb: Aabb,
	left: u32,
	right: u32,
	parent: u32,
	item: u32,
}

@group(0) @binding(0)
var<storage, read> particles_in: array<Entity>;

@group(0) @binding(1)
var<storage, read_write> particles_out: array<Entity>;

@group(0) @binding(2)
var<uniform> entity_count: u32;

@group(0) @binding(3)
var<uniform> gravity: vec2f;

@group(0) @binding(4)
var<uniform> bounds: vec2f;

@group(0) @binding(5)
var<storage, read> nodes: array<Node>;

const DT = 1.0 / 60.0 / 16.0;
const DT_SQ = DT * DT;

fn calc_aabb(pos: vec2f, radius: f32) -> Aabb {
	let offset = vec2f(radius, radius);
	return Aabb(pos - offset, pos + offset);
}

fn overlaps(a: Aabb, b: Aabb) -> bool {
	return all(a.min <= b.max) && all(b.min <= a.max);
}

@compute @workgroup_size(64)
fn update_positions(@builtin(global_invocation_id) gid: vec3u) {
	let i = gid.x;
	if (i < entity_count) {
		var ent = particles_in[i];
		let next_pos = ent.curr_pos * 2 - ent.prev_pos + gravity * DT_SQ;
		ent.prev_pos = ent.curr_pos;
		ent.curr_pos = next_pos;
		particles_out[i] = ent;
	}
}

@compute @workgroup_size(64)
fn resolve_collisions(@builtin(global_invocation_id) gid: vec3u) {
	let i = gid.x;
	if (i < entity_count) {
		var ent1 = particles_in[i];
		let aabb1 = calc_aabb(ent1.curr_pos, ent1.radius);
		var displacement = vec2f(0.0, 0.0);
		var stack: array<u32, 64u>;
		var stack_len = 1u;
		stack[0] = 0u;

		while (stack_len > 0u) {
			stack_len--;
			let node_idx = stack[stack_len];
			let node = nodes[node_idx];
			if (overlaps(aabb1, node.aabb)) {
				if (node_idx < entity_count - 1u) {
					if (stack_len + 2u <= 64u) {
						stack[stack_len] = node.left;
						stack[stack_len + 1u] = node.right;
						stack_len += 2u;
					}
				} else {
					let j = node.item;
					if (i != j) {
						let ent2 = particles_in[j];
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

							displacement += rotated_normal * delta * 0.1;
						}
					}
				}
			}
		}

		ent1.curr_pos += displacement;
		particles_out[i] = ent1;
	}
}

@compute @workgroup_size(64)
fn apply_world_bounds(@builtin(global_invocation_id) gid: vec3u) {
	let i = gid.x;
	if (i < entity_count) {
		var ent = particles_in[i];
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

		particles_out[i] = ent;
	}
}
