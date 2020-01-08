let cube_rotation = 0.0;
main();

function main() {
	let delta_time = 0;
	
	let page_width = Math.max(document.documentElement["clientWidth"], document.body["scrollWidth"], document.documentElement["scrollWidth"], document.body["offsetWidth"], document.documentElement["offsetWidth"]);
	let page_height = Math.max(document.documentElement["clientHeight"], document.body["scrollHeight"], document.documentElement["scrollHeight"], document.body["offsetHeight"], document.documentElement["offsetHeight"]);
	
	let canvas = document.createElement("canvas");
	canvas.width = page_width;
	canvas.height = page_height;
	document.getElementById("canvas-wrapper").appendChild(canvas);
	const context = canvas.getContext("webgl");
	
	if (!context) {
		console.error("Couldn't get the WebGL canvas. Try using Firefox or Chrome.");
		return;
	}
	
	const vertex_shader_source = `
		attribute vec4 aVertexPosition;
		attribute vec2 aTextureCoord;
	
		uniform mat4 uModelViewMatrix;
		uniform mat4 uProjectionMatrix;
	
		varying highp vec2 vTextureCoord;
	
		void main(void) {
			gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
			vTextureCoord = aTextureCoord;
		}
	`;
	
	const fragment_shader_source = `
		varying highp vec2 vTextureCoord;
	
		uniform sampler2D uSampler;
	
		void main(void) {
			gl_FragColor = texture2D(uSampler, vTextureCoord);
		}
	`;

	const shader_program = initialize_shaders(context, vertex_shader_source, fragment_shader_source);
	
	const program_info = {
		program: shader_program,
		attribute_locations: {
			vertex_position: context.getAttribLocation(shader_program, "aVertexPosition"),
			texture_coordinates: context.getAttribLocation(shader_program, "aTextureCoord")
		},
		uniform_locations: {
			projection_matrix: context.getUniformLocation(shader_program, "uProjectionMatrix"),
			model_view_matrix: context.getUniformLocation(shader_program, "uModelViewMatrix"),
			u_sampler: context.getUniformLocation(shader_program, "uSampler")
		}
	};

	const buffers = initialize_buffers(context);
	const texture = load_texture(context, "cubetexture.png");

	let previous_now = 0;

	function render(now) {
		now /= 1000;
	
		delta_time = now - previous_now;
		previous_now = now;
	
		draw_scene(context, program_info, buffers, texture, delta_time);
	
		requestAnimationFrame(render);
	}
	
	requestAnimationFrame(render);
}

function load_shader(context, type, source) {
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

function initialize_shaders(context, vertex_shader_source, fragment_shader_source) {
	const vertex_shader = load_shader(context, context.VERTEX_SHADER, vertex_shader_source);
	const fragment_shader = load_shader(context, context.FRAGMENT_SHADER, fragment_shader_source);
	console.log(vertex_shader);

	const shader_program = context.createProgram();
	context.attachShader(shader_program, vertex_shader);
	context.attachShader(shader_program, fragment_shader);
	context.linkProgram(shader_program);

	if (!context.getProgramParameter(shader_program, context.LINK_STATUS)) {
		console.error(`Unable to start the shader program: ${context.getProgramInfoLog(shader_program)}`);
		return null;
	}

	return shader_program;
}

function initialize_buffers(context) {
	// Position Buffer

	const position_buffer = context.createBuffer();
	context.bindBuffer(context.ARRAY_BUFFER, position_buffer);

	const positions = [
		// Front face
		-1.0, -1.0,  1.0,
		 1.0, -1.0,  1.0,
		 1.0,  1.0,  1.0,
		-1.0,  1.0,  1.0,
		
		// Back face
		-1.0, -1.0, -1.0,
		-1.0,  1.0, -1.0,
		 1.0,  1.0, -1.0,
		 1.0, -1.0, -1.0,
		
		// Top face
		-1.0,  1.0, -1.0,
		-1.0,  1.0,  1.0,
		 1.0,  1.0,  1.0,
		 1.0,  1.0, -1.0,
		
		// Bottom face
		-1.0, -1.0, -1.0,
		 1.0, -1.0, -1.0,
		 1.0, -1.0,  1.0,
		-1.0, -1.0,  1.0,
		
		// Right face
		 1.0, -1.0, -1.0,
		 1.0,  1.0, -1.0,
		 1.0,  1.0,  1.0,
		 1.0, -1.0,  1.0,
		
		// Left face
		-1.0, -1.0, -1.0,
		-1.0, -1.0,  1.0,
		-1.0,  1.0,  1.0,
		-1.0,  1.0, -1.0,
	  ];

	context.bufferData(context.ARRAY_BUFFER, new Float32Array(positions), context.STATIC_DRAW);

	// Texture buffer

	const texture_coordinate_buffer = context.createBuffer();
	context.bindBuffer(context.ARRAY_BUFFER, texture_coordinate_buffer);
  
	const texture_coordinates = [
	  // Front
	  0.0,  0.0,
	  1.0,  0.0,
	  1.0,  1.0,
	  0.0,  1.0,
	  // Back
	  0.0,  0.0,
	  1.0,  0.0,
	  1.0,  1.0,
	  0.0,  1.0,
	  // Top
	  0.0,  0.0,
	  1.0,  0.0,
	  1.0,  1.0,
	  0.0,  1.0,
	  // Bottom
	  0.0,  0.0,
	  1.0,  0.0,
	  1.0,  1.0,
	  0.0,  1.0,
	  // Right
	  0.0,  0.0,
	  1.0,  0.0,
	  1.0,  1.0,
	  0.0,  1.0,
	  // Left
	  0.0,  0.0,
	  1.0,  0.0,
	  1.0,  1.0,
	  0.0,  1.0,
	];
  
	context.bufferData(context.ARRAY_BUFFER, new Float32Array(texture_coordinates), context.STATIC_DRAW);

	// Index Buffer
	
	const index_buffer = context.createBuffer();
	context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, index_buffer);

	const indices = [
		0,  1,  2,      0,  2,  3,    // front
		4,  5,  6,      4,  6,  7,    // back
		8,  9,  10,     8,  10, 11,   // top
		12, 13, 14,     12, 14, 15,   // bottom
		16, 17, 18,     16, 18, 19,   // right
		20, 21, 22,     20, 22, 23,   // left
	];

	context.bufferData(context.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), context.STATIC_DRAW);

	return {
		position: position_buffer,
		texture_coordinates: texture_coordinate_buffer,
		indices: index_buffer
	};
}

function draw_scene(context, program_info, buffers, texture, delta_time) {
	if (!context || !program_info) {
		console.error(`Oh no! There was a fatal error initializing the canvas.`);
	}
	
	context.clearColor(0.0, 0.0, 0.0, 1.0);
	context.clearDepth(1.0);
	context.enable(context.DEPTH_TEST);
	context.depthFunc(context.LEQUAL);
	
	context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
	
	const field_of_view = degrees_to_radians(45);
	const aspect = context.canvas.clientWidth / context.canvas.clientHeight;
	const z_near = 0.1;
	const z_far = 100.0;
	
	const projection_matrix = glMatrix.mat4.create();
	glMatrix.mat4.perspective(projection_matrix, field_of_view, aspect, z_near, z_far);
	
	const model_view_matrix = glMatrix.mat4.create();
	glMatrix.mat4.translate(model_view_matrix, model_view_matrix, [ -0.0, 0.0, -6.0 ]);
	glMatrix.mat4.rotate(model_view_matrix, model_view_matrix, cube_rotation, [ 0, 0, 1 ]); // fourth argument is axis to rotate around
	glMatrix.mat4.rotate(model_view_matrix, model_view_matrix, cube_rotation * .7, [0, 1, 0]);

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

	context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, buffers.indices);
	
	context.useProgram(program_info.program);
	
	context.uniformMatrix4fv(
		program_info.uniform_locations.projection_matrix,
		false,
		projection_matrix
	);
	
	context.uniformMatrix4fv(
		program_info.uniform_locations.model_view_matrix,
		false,
		model_view_matrix
	);

	// Tell WebGL we want to affect texture unit 0
	context.activeTexture(context.TEXTURE0);
	// Bind the texture to texture unit 0
	context.bindTexture(context.TEXTURE_2D, texture);
	// Tell the shader we bound the texture to texture unit 0
	context.uniform1i(program_info.uniform_locations.u_sampler, 0);
	
	
	{
		const vertex_count = 36;
		const type = context.UNSIGNED_SHORT;
		const offset = 0;
		context.drawElements(context.TRIANGLES, vertex_count, type, offset);
	}
	// {
	// 	const offset = 0;
	// 	const vertex_count = 4;
	// 	context.drawArrays(context.TRIANGLE_STRIP, offset, vertex_count);
	// }

	cube_rotation += delta_time;
}

function load_texture(context, url) {
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
	const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
	context.texImage2D(context.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);
  
	const image = new Image();
	image.onload = function() {
		context.bindTexture(context.TEXTURE_2D, texture);
		context.texImage2D(context.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
	
		if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
			context.generateMipmap(context.TEXTURE_2D);
		} 
		else {
			// Not a power of 2, so turn off mips and set wrapping to clamp to edge
			context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
			context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
			context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR);
		}
	};

	image.src = url;
  
	return texture;
}
  
