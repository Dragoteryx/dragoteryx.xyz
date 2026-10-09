struct Entity {
	curr_pos: vec2f,
	prev_pos: vec2f,
	color: vec3f,
	radius: f32,
}

struct Node {
	aabb: array<atomic<u32>, 4>,
	left: u32,
	right: u32,
	parent: u32,
	item: u32,
}

struct SortParams {
	k: u32,
	j: u32,
}

@group(0) @binding(0)
var<storage, read> particles: array<Entity>;

@group(0) @binding(1)
var<storage, read_write> keys: array<vec2u>;

@group(0) @binding(2)
var<storage, read_write> nodes: array<Node>;

@group(0) @binding(3)
var<storage, read_write> flags: array<atomic<u32>>;

@group(0) @binding(4)
var<uniform> entity_count: u32;

@group(0) @binding(5)
var<uniform> bounds: vec2f;

@group(0) @binding(6)
var<uniform> sort_params: SortParams;

const INVALID = 0xFFFFFFFFu;

fn calc_morton_code(pos: vec2f) -> u32 {
	let x = clamp(pos.x / bounds.x, 0.0, 1.0);
	let y = clamp(pos.y / bounds.y, 0.0, 1.0);
	let ix = u32(x * 0xFFFF);
	let iy = u32(y * 0xFFFF);
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

fn calc_prefix_len(i: i32, j: i32) -> i32 {
	if (j < 0 || j >= i32(entity_count)) {
		return -1;
	}

	let code1 = keys[i].x;
	let code2 = keys[j].x;
	if (code1 == code2) {
		return 32 + i32(countLeadingZeros(u32(i) ^ u32(j)));
	} else {
		return i32(countLeadingZeros(code1 ^ code2));
	}
}

fn calc_children(i: i32) -> vec2u {
	let n = entity_count;
	let d = select(-1, 1, calc_prefix_len(i, i + 1) > calc_prefix_len(i, i - 1));
	let prefix_min = calc_prefix_len(i, i - d);

	var len_max = 2;
	while (calc_prefix_len(i, i + len_max * d) > prefix_min) {
		len_max *= 2;
	}

	var len = 0;
	for (var t = len_max / 2; t >= 1; t /= 2) {
		if (calc_prefix_len(i, i + (len + t) * d) > prefix_min) {
			len += t;
		}
	}

	let j = i + len * d;
	let prefix_node = calc_prefix_len(i, j);
	var split = 0;
	var div = 2;
	loop {
		let t = (len + div - 1) / div;
		if (calc_prefix_len(i, i + (split + t) * d) > prefix_node) {
			split += t;
		}

		if (t <= 1) {
			break;
		}

		div *= 2;
	}

	let gamma = i + split * d + min(d, 0);
	let left = select(u32(gamma), n - 1u + u32(gamma), min(i, j) == gamma);
	let right = select(u32(gamma + 1), n - 1u + u32(gamma + 1), max(i, j) == gamma + 1);
	return vec2u(left, right);
}

fn store_aabb(node: u32, aabb_min: vec2f, aabb_max: vec2f) {
	atomicStore(&nodes[node].aabb[0], bitcast<u32>(aabb_min.x));
	atomicStore(&nodes[node].aabb[1], bitcast<u32>(aabb_min.y));
	atomicStore(&nodes[node].aabb[2], bitcast<u32>(aabb_max.x));
	atomicStore(&nodes[node].aabb[3], bitcast<u32>(aabb_max.y));
}

fn load_aabb_min(node: u32) -> vec2f {
	return vec2f(
		bitcast<f32>(atomicLoad(&nodes[node].aabb[0])),
		bitcast<f32>(atomicLoad(&nodes[node].aabb[1])),
	);
}

fn load_aabb_max(node: u32) -> vec2f {
	return vec2f(
		bitcast<f32>(atomicLoad(&nodes[node].aabb[2])),
		bitcast<f32>(atomicLoad(&nodes[node].aabb[3])),
	);
}

@compute @workgroup_size(64)
fn compute_morton_codes(@builtin(global_invocation_id) gid: vec3u) {
	let i = gid.x;
	if (i < arrayLength(&keys)) {
		if (i < entity_count) {
			keys[i] = vec2u(calc_morton_code(particles[i].curr_pos), i);
		} else {
			keys[i] = vec2u(INVALID, INVALID);
		}
	}
}

@compute @workgroup_size(64)
fn bitonic_sort_step(@builtin(global_invocation_id) gid: vec3u) {
	let t = gid.x;
	let k = sort_params.k;
	let j = sort_params.j;
	let i = 2u * j * (t / j) + (t % j);
	let l = i + j;
	if (l < arrayLength(&keys)) {
		let key1 = keys[i];
		let key2 = keys[l];
		let greater = key1.x > key2.x || (key1.x == key2.x && key1.y > key2.y);
		if (greater == ((i & k) == 0u)) {
			keys[i] = key2;
			keys[l] = key1;
		}
	}
}

@compute @workgroup_size(64)
fn build_hierarchy(@builtin(global_invocation_id) gid: vec3u) {
	let i = gid.x;
	let n = entity_count;
	if (i < n) {
		nodes[n - 1u + i].item = keys[i].y;
		if (i == 0u) {
			nodes[0].parent = INVALID;
		}

		if (i < n - 1u) {
			let children = calc_children(i32(i));
			nodes[i].left = children.x;
			nodes[i].right = children.y;
			nodes[children.x].parent = i;
			nodes[children.y].parent = i;
		}
	}
}

@compute @workgroup_size(64)
fn refit_bounds(@builtin(global_invocation_id) gid: vec3u) {
	let i = gid.x;
	let n = entity_count;
	if (i < n) {
		let leaf = n - 1u + i;
		let ent = particles[nodes[leaf].item];
		let offset = vec2f(ent.radius, ent.radius);
		store_aabb(leaf, ent.curr_pos - offset, ent.curr_pos + offset);

		var node = nodes[leaf].parent;
		while (node != INVALID && atomicAdd(&flags[node], 1u) == 1u) {
			let left = nodes[node].left;
			let right = nodes[node].right;
			store_aabb(
				node,
				min(load_aabb_min(left), load_aabb_min(right)),
				max(load_aabb_max(left), load_aabb_max(right)),
			);

			node = nodes[node].parent;
		}
	}
}
