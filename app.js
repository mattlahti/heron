const vertex_shader_source = `
	attribute vec4 aVertexPosition;
	attribute vec3 aVertexNormal;
	attribute vec2 aTextureCoord;

	uniform mat4 uNormalMatrix;
	uniform mat4 uModelViewMatrix;
	uniform mat4 uProjectionMatrix;

	varying highp vec2 vTextureCoord;
	varying highp vec3 vLighting;

	void main(void) {
		gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
		vTextureCoord = aTextureCoord;

		highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
		highp vec3 directionalLightColor = vec3(1, 1, 1);
		highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

		highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

		highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
		vLighting = ambientLight + (directionalLightColor * directional);
	}
`;

const fragment_shader_source = `
	varying highp vec2 vTextureCoord;
	varying highp vec3 vLighting;

	uniform sampler2D uSampler;

	void main(void) {
		highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

		gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
	}
`;

let app_context = 
{
	aspect_ratio: 0,
	field_of_view: 92,
	near_plane: 0.1,
	far_plane: 100.0,
	world_position: make_v3(0, 0, 0),
	camera_yaw: 0,
	camera_pitch: Math.PI / 2,
	commands: [],
	command_count: 0,
	should_quit: false
};

let time = 
{
	delta_seconds: 0,
	elapsed_seconds: 0, 
	app_start_ms: 0
};

let input = 
{
	left_motion: make_v3(0, 0, 0),
	right_motion: make_v2(0, 0)
};

let page_width = 0;
let page_height = 0;
let is_dragging = false;
let last_mouse_pos = {};
let keys_held = {};

function get_mouse_position(event) 
{
	return make_v2(event.clientX, event.clientY);
}

//@todo(Matt): Array implementation instead of JS object
window.onkeyup = e => 
{
	delete keys_held[e.key];
}

window.onkeydown = e => 
{
	if (!keys_held[e.key]) {
		keys_held[e.key] = e.key;
	}
}

window.onmousedown = e => 
{
	is_dragging = true;
	last_mouse_pos = get_mouse_position(e);
}

window.onmousemove = e => 
{
	if (is_dragging) 
	{
		let current_mouse_pos = get_mouse_position(e);
		let rotation_dampener = 2.5;

		// (x = up/down, y = left/right)
		input.right_motion.y += -(last_mouse_pos.y - current_mouse_pos.y) / rotation_dampener;
		input.right_motion.x += -(last_mouse_pos.x - current_mouse_pos.x) / rotation_dampener;

		last_mouse_pos = current_mouse_pos;
	}
}

window.onmouseup = () => 
{
	is_dragging = false;
}

window.onresize = e => 
{
	set_page_dimensions();
	set_canvas_dimensions();
}

function set_page_dimensions() 
{
	page_width = Math.max(document.documentElement["clientWidth"], document.body["scrollWidth"], document.documentElement["scrollWidth"], document.body["offsetWidth"], document.documentElement["offsetWidth"]);
	page_height = Math.max(document.documentElement["clientHeight"], document.body["scrollHeight"], document.documentElement["scrollHeight"], document.body["offsetHeight"], document.documentElement["offsetHeight"]);
}

function set_canvas_dimensions()
{
	document.getElementById("gl-canvas").width = page_width;
	document.getElementById("text-canvas").width = page_width;
	document.getElementById("gl-canvas").height = page_height;
	document.getElementById("text-canvas").height = page_height;
}

function create_canvas(id, context_type) 
{
	let canvas = document.createElement("canvas");
	canvas.width = page_width;
	canvas.height = page_height;
	canvas.id = id;
	document.getElementById("canvas-wrapper").appendChild(canvas);
	return canvas.getContext(context_type);
}

function main() 
{
	set_page_dimensions();

	const context = create_canvas("gl-canvas", "webgl");
	const two_d_context = create_canvas("text-canvas", "2d");

	if (!context) 
	{
		console.error("FATAL: Couldn't start the WebGL canvas.");
		return;
	}

	app_context.aspect_ratio = context.canvas.clientWidth / context.canvas.clientHeight;

	const shader_program = initialize_shaders(context, vertex_shader_source, fragment_shader_source);
	
	const program_info = 
	{
		program: shader_program,
		attribute_locations: 
		{
			vertex_position: context.getAttribLocation(shader_program, "aVertexPosition"),
			texture_coordinates: context.getAttribLocation(shader_program, "aTextureCoord"),
			vertex_normal: context.getAttribLocation(shader_program, "aVertexNormal"),
		},
		uniform_locations: 
		{
			projection_matrix: context.getUniformLocation(shader_program, "uProjectionMatrix"),
			model_view_matrix: context.getUniformLocation(shader_program, "uModelViewMatrix"),
			u_sampler: context.getUniformLocation(shader_program, "uSampler"),
			normal_matrix: context.getUniformLocation(shader_program, "uNormalMatrix"),
		}
	};

	const buffers = initialize_buffers(context);
	const texture = load_texture(context, "cubetexture.png");

	function render() 
	{
		let start_ms = new Date().getTime();
		time.elapsed_seconds = (start_ms - time.app_start_ms) / 1000;

		if (app_context.should_quit) 
		{
			cancelAnimationFrame(app_context.animation_frame);
			app_context.animation_frame = null;
			write_status(two_d_context, "Application stopped");
			return;
		}

		draw_scene(context, two_d_context, program_info, buffers, texture);
		clear_input();

		app_context.animation_frame = requestAnimationFrame(render);

		let end_ms = new Date().getTime();
		time.delta_seconds = end_ms - start_ms;
	}
	
	time.app_start_ms = new Date().getTime();
	render();
}

function clear_input() 
{
	input = {
		left_motion: make_v3(0, 0, 0),
		right_motion: make_v2(0, 0)
	};
}

//@todo(Matt): Since these canvas attributes need to be set only once, move them outside of this call
function write_status(the_context, status) 
{
	the_context.fillStyle = "rgba(0, 0, 0, 0)";
	the_context.fillRect(0, 0, the_context.canvas.clientWidth, the_context.canvas.clientHeight);
	the_context.stroke();
	the_context.clearRect(0, 0, the_context.canvas.clientWidth, the_context.canvas.clientHeight);
	the_context.fillStyle = "#00FF00";
	the_context.font = "32px Roboto";
	the_context.fillText(status, 10, 50);
	the_context.stroke();
}

function load_shader(context, type, source) 
{
	const shader = context.createShader(type);
	
	context.shaderSource(shader, source);
	context.compileShader(shader);
	
	if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
		console.error(`There was a problem loading the shader: ${context.getShaderInfoLog(shader)}`);
		context.deleteShader(shader);
		return null;
	}
	
	return shader;
}

function initialize_shaders(context, vertex_shader_source, fragment_shader_source) 
{
	const vertex_shader = load_shader(context, context.VERTEX_SHADER, vertex_shader_source);
	const fragment_shader = load_shader(context, context.FRAGMENT_SHADER, fragment_shader_source);

	const shader_program = context.createProgram();
	context.attachShader(shader_program, vertex_shader);
	context.attachShader(shader_program, fragment_shader);
	context.linkProgram(shader_program);

	if (!context.getProgramParameter(shader_program, context.LINK_STATUS)) 
	{
		console.error(`Unable to start the shader program: ${context.getProgramInfoLog(shader_program)}`);
		return null;
	}

	return shader_program;
}

function initialize_buffers(context) 
{
	// Position Buffer

	const position_buffer = context.createBuffer();
	context.bindBuffer(context.ARRAY_BUFFER, position_buffer);

	const positions = [
		-1.0, -1.0,  1.0,
		1.0, -1.0,  1.0,
		1.0,  1.0,  1.0,
		-1.0,  1.0,  1.0,
		
		-1.0, -1.0, -1.0,
		-1.0,  1.0, -1.0,
		1.0,  1.0, -1.0,
		1.0, -1.0, -1.0,
		
		-1.0,  1.0, -1.0,
		-1.0,  1.0,  1.0,
		1.0,  1.0,  1.0,
		1.0,  1.0, -1.0,
		
		-1.0, -1.0, -1.0,
		1.0, -1.0, -1.0,
		1.0, -1.0,  1.0,
		-1.0, -1.0,  1.0,
		
		1.0, -1.0, -1.0,
		1.0,  1.0, -1.0,
		1.0,  1.0,  1.0,
		1.0, -1.0,  1.0,
		
		-1.0, -1.0, -1.0,
		-1.0, -1.0,  1.0,
		-1.0,  1.0,  1.0,
		-1.0,  1.0, -1.0
	];

	context.bufferData(context.ARRAY_BUFFER, new Float32Array(positions), context.STATIC_DRAW);

	// Texture buffer

	const texture_coordinate_buffer = context.createBuffer();
	context.bindBuffer(context.ARRAY_BUFFER, texture_coordinate_buffer);
  
	const texture_coordinates = [
		0.0,  0.0,
		1.0,  0.0,
		1.0,  1.0,
		0.0,  1.0,
		
		0.0,  0.0,
		1.0,  0.0,
		1.0,  1.0,
		0.0,  1.0,
		
		0.0,  0.0,
		1.0,  0.0,
		1.0,  1.0,
		0.0,  1.0,
		
		0.0,  0.0,
		1.0,  0.0,
		1.0,  1.0,
		0.0,  1.0,
		
		0.0,  0.0,
		1.0,  0.0,
		1.0,  1.0,
		0.0,  1.0,
		
		0.0,  0.0,
		1.0,  0.0,
		1.0,  1.0,
		0.0,  1.0
	];
  
	context.bufferData(context.ARRAY_BUFFER, new Float32Array(texture_coordinates), context.STATIC_DRAW);

	// Index Buffer
	
	const index_buffer = context.createBuffer();
	context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, index_buffer);

	const indices = [
		0,  1,  2,      0,  2,  3,
		4,  5,  6,      4,  6,  7, 
		8,  9,  10,     8,  10, 11,
		12, 13, 14,     12, 14, 15,
		16, 17, 18,     16, 18, 19,
		20, 21, 22,     20, 22, 23,
	];

	context.bufferData(context.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), context.STATIC_DRAW);

	// Normal buffer

	const normal_buffer = context.createBuffer();
	context.bindBuffer(context.ARRAY_BUFFER, normal_buffer);
  
	const vertex_normals = [
		0.0,  0.0,  1.0,
		0.0,  0.0,  1.0,
		0.0,  0.0,  1.0,
		0.0,  0.0,  1.0,
	
		0.0,  0.0, -1.0,
		0.0,  0.0, -1.0,
		0.0,  0.0, -1.0,
		0.0,  0.0, -1.0,
	
		0.0,  1.0,  0.0,
		0.0,  1.0,  0.0,
		0.0,  1.0,  0.0,
		0.0,  1.0,  0.0,
	
		0.0, -1.0,  0.0,
		0.0, -1.0,  0.0,
		0.0, -1.0,  0.0,
		0.0, -1.0,  0.0,
	
		1.0,  0.0,  0.0,
		1.0,  0.0,  0.0,
		1.0,  0.0,  0.0,
		1.0,  0.0,  0.0,
	
		-1.0,  0.0,  0.0,
		-1.0,  0.0,  0.0,
		-1.0,  0.0,  0.0,
		-1.0,  0.0,  0.0
	];
  
	context.bufferData(context.ARRAY_BUFFER, new Float32Array(vertex_normals), context.STATIC_DRAW);

	return {
		position: position_buffer,
		texture_coordinates: texture_coordinate_buffer,
		indices: index_buffer,
		normal: normal_buffer
	};
}

function draw_scene(context, two_d_context, program_info, buffers, texture, delta_time) 
{
	if (!context || !program_info) 
	{
		console.error(`Fatal error starting the canvas.`);
	}

	write_status(two_d_context, app_context.world_position.to_string("Position"));
	
	context.clearColor(0.0, 0.0, 0.0, 1.0);
	context.clearDepth(1.0);
	context.enable(context.DEPTH_TEST);
	context.depthFunc(context.LEQUAL);
	context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);

	let move_speed = 1;
	let keys_held_array = Object.values(keys_held);
	
	for (let i = 0; i < keys_held_array.length; i++) 
	{
		let key_held = keys_held_array[i];

		if (key_held === "Escape") 
		{
			app_context.should_quit = !app_context.should_quit;
			console.warn("Stopping application....");
			break;
		}

		switch (key_held) 
		{
			case 'w': { input.left_motion.z += move_speed; break; }
			case 's': { input.left_motion.z -= move_speed; break; }
			case 'a': { input.left_motion.x += move_speed; break; }
			case 'd': { input.left_motion.x -= move_speed; break; }
			case 'e': { input.left_motion.y -= move_speed; break; }
			case 'q': { input.left_motion.y += move_speed; break; }
		}
	}

	//@todo(Matt): Remove this barely-working, cobbled together solution.
	// In a nutshell, because I can't use a union, whenever i update x y or z, i should also update e (x, y, and z as an array)
	input.left_motion.update_e_from_properties();

	let projection_matrix = make_perspective(
		app_context.aspect_ratio,
		app_context.field_of_view,
		app_context.near_plane,
		app_context.far_plane
	);

	app_context.camera_yaw += input.right_motion.x;
	app_context.camera_pitch += input.right_motion.y;

	let rotation_matrix = matrix_multiply(make_rotation_z(app_context.camera_yaw), make_rotation_y(app_context.camera_pitch));
	rotation_matrix = rotation_matrix.to_m3x3();

	let rotation_x_movement = matrix_multiply(rotation_matrix, input.left_motion);
	app_context.world_position = vector_add(app_context.world_position, rotation_x_movement);

	let model_view_matrix = make_camera_transform(app_context.world_position, rotation_matrix);
	console.log(model_view_matrix);

	//@todo(Matt): Remove last uses of glMatrix, implement invert() on matrix
	const normal_matrix = glMatrix.mat4.create();
	glMatrix.mat4.invert(normal_matrix, model_view_matrix);
	glMatrix.mat4.transpose(normal_matrix, normal_matrix);

	// Position
	{
		const component_count = 3;
		const type = context.FLOAT;
		const normalize = false;
		const stride = 0;
		const offset = 0;
		context.bindBuffer(context.ARRAY_BUFFER, buffers.position);
	
		context.vertexAttribPointer(
			program_info.attribute_locations.vertex_position,
			component_count, 
			type, 
			normalize,
			stride,
			offset
		);
		
		context.enableVertexAttribArray(program_info.attribute_locations.vertex_position);
	}
	
	// Texture
	{
		const component_count = 2; // every coordinate composed of 2 values
		const type = context.FLOAT; // the data in the buffer is 32 bit float
		const normalize = false; // don't normalize
		const stride = 0; // how many bytes to get from one set to the next
		const offset = 0; // how many bytes inside the buffer to start from
		context.bindBuffer(context.ARRAY_BUFFER, buffers.texture_coordinates);
		context.vertexAttribPointer(program_info.attribute_locations.texture_coordinates, component_count, type, normalize, stride, offset);
		context.enableVertexAttribArray(program_info.attribute_locations.texture_coordinates);
	}

	// Normal
	{
		const component_count = 3;
		const type = context.FLOAT;
		const normalize = false;
		const stride = 0;
		const offset = 0;
		context.bindBuffer(context.ARRAY_BUFFER, buffers.normal);
		context.vertexAttribPointer(program_info.attribute_locations.vertex_normal, component_count, type, normalize, stride, offset);
		context.enableVertexAttribArray(program_info.attribute_locations.vertex_normal);
	}

	context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, buffers.indices);
	
	context.useProgram(program_info.program);
	
	//@note(Matt): matrix.e simply puts the matrix into a 1d array as webgl expects
	context.uniformMatrix4fv(
		program_info.uniform_locations.projection_matrix,
		false,
		projection_matrix.e
	);
	
	context.uniformMatrix4fv(
		program_info.uniform_locations.model_view_matrix,
		false,
		model_view_matrix.e
	);

	context.uniformMatrix4fv(
		program_info.uniform_locations.normal_matrix, 
		false,
		normal_matrix
	);

	context.activeTexture(context.TEXTURE0);
	context.bindTexture(context.TEXTURE_2D, texture);
	context.uniform1i(program_info.uniform_locations.u_sampler, 0);
	
	{
		const vertex_count = 36;
		const type = context.UNSIGNED_SHORT;
		const offset = 0;
		context.drawElements(context.TRIANGLES, vertex_count, type, offset);
	}
}

function load_texture(context, url) 
{
	const texture = context.createTexture();
	context.bindTexture(context.TEXTURE_2D, texture);
  
	// Put a single pixel in the texture so we can use it immediately instead of having to wait for AJAX. Update after ajax done
	const level = 0;
	const internalFormat = context.RGBA;
	const width = 1;
	const height = 1;
	const border = 0;
	const srcFormat = context.RGBA;
	const srcType = context.UNSIGNED_BYTE;
	const pixel = new Uint8Array([221, 72, 0, 255]); 
	context.texImage2D(context.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);
  
	const image = new Image();
	image.onload = function() 
	{
		context.bindTexture(context.TEXTURE_2D, texture);
		context.texImage2D(context.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
	
		if (is_power_of_2(image.width) && is_power_of_2(image.height)) 
		{
			context.generateMipmap(context.TEXTURE_2D);
		} 
		else 
		{
			context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
			context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
			context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR);
		}
	};

	image.src = url;
  
	return texture;
}

main();