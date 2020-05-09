// Shaders
import fragmentShaderSrc from './shaders/fragment.frag';
import vertexShaderSrc from './shaders/vertex.vert';
// Helper functions
import createProgram from './create-program';
import createBuffers from './create-buffers';
import createTexture from './create-texture';
import render from './draw';
import resizeCanvas from './resize-canvas';
// Assets import
import img from '../assets/images/lenna.png'

let imageTexture = null;
async function initTextures(gl) {
    imageTexture = await createTexture.loadTexture(gl, img);
}

let verts = [
    -1, -1,
    -1, 1,
    1, 1,

    -1, -1,
    1, 1,
    1, -1,
];




const menu = async () => {

    // Create a program
    const canvas = document.getElementById('canvas');

    const gl = canvas.getContext('webgl2');

    await initTextures(gl);

    const shaders = [
        {src: fragmentShaderSrc, type: gl.FRAGMENT_SHADER},
        {src: vertexShaderSrc, type: gl.VERTEX_SHADER}
    ];

    const program = createProgram(gl, shaders);

    // Set up attributes and uniforms
    const attributes = {
        a_position: gl.getAttribLocation(program, 'a_position'),
    };

    const uniforms = {
    };


    // we've put data in a buffer
    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW)

    // Tell the attribute how to get data out of it. First we need to create a collection of attribute state called a Vertex Array Object.
    let vao = gl.createVertexArray();
    // Make that the current vertex array so that all of our attribute settings will apply to that set of attribute state
    gl.bindVertexArray(vao);

    // This tells WebGL we want to get data out of a buffer. If we don't turn on the attribute then the attribute will have a constant value.
    gl.enableVertexAttribArray(attributes.position);
    // Then we need to specify how to pull the data out, A hidden part of gl.vertexAttribPointer is that it binds the current ARRAY_BUFFER to the attribute
    gl.vertexAttribPointer(attributes.position,2,gl.FLOAT,false,0,0);


    gl.bindVertexArray(null);

    // Resize canvas and viewport
    const resize = () => {
        resizeCanvas(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    };

    // Clear the canvas

    // Set WebGL program here (we have only one)
    gl.useProgram(program);

    // Setup canvas
    window.onresize = resize;
    resize();

    //gl.enable(gl.DEPTH_TEST);
    //gl.enable(gl.CULL_FACE);
    //gl.cullFace(gl.BACK);





    //gl.enableVertexAttribArray(attributes.position);
    //const vertexBuffer = createBuffers.createVertexBuffer(gl);
    //gl.vertexAttribPointer(attributes.position, 2, gl.FLOAT, false, 0, 0);


    /*
    let textureCoords = [0.581092, 0.497349, 0.304193, 0.220451, 0.581092, 0.220451, 0.303575, 0.497413, 0.026676, 0.220515, 0.303575, 0.220515, 0.581711, 0.220451, 0.858609, 0.497349, 0.581711, 0.497349, 0.026676, 0.774835, 0.303575, 0.497936, 0.303575, 0.774834, 0.858577, 0.774867, 0.581679, 0.497968, 0.858577, 0.497968, 0.647519, 0.810049, 0.647519, 0.775497, 0.677442, 0.792773, 0.634253, 0.875762, 0.616977, 0.845839, 0.65153, 0.845839, 0.677442, 0.84522, 0.647519, 0.827944, 0.677442, 0.810668, 0.616359, 0.792773, 0.586435, 0.810049, 0.586435, 0.775497, 0.6469, 0.775497, 0.6469, 0.810049, 0.616977, 0.792773, 0.616977, 0.810668, 0.6469, 0.827944, 0.616977, 0.84522, 0.581806, 0.84121, 0.616359, 0.84121, 0.599082, 0.871133, 0.581806, 0.810668, 0.616359, 0.810668, 0.599082, 0.840591, 0.028129, 0.774958, 0.305028, 0.809511, 0.028129, 0.809511, 0.304193, 0.88038, 0.581092, 0.845827, 0.581092, 0.88038, 0.304842, 0.88119, 0.027943, 0.915743, 0.027943, 0.88119, 0.028778, 0.81113, 0.305676, 0.845682, 0.028778, 0.845682, 0.304842, 0.916361, 0.027943, 0.950914, 0.027943, 0.916361, 0.581092, 0.775485, 0.304193, 0.810038, 0.304193, 0.775485, 0.304854, 0.951628, 0.027943, 0.986085, 0.027955, 0.951532, 0.027943, 0.846019, 0.304842, 0.880571, 0.027943, 0.880572, 0.581092, 0.950722, 0.304193, 0.916169, 0.581092, 0.916169, 0.304388, 0.952523, 0.581287, 0.987075, 0.304388, 0.987075, 0.304193, 0.845209, 0.581092, 0.810656, 0.581092, 0.845209, 0.581092, 0.880998, 0.304193, 0.915551, 0.304193, 0.880998, 0.582036, 0.771937, 0.305138, 0.495038, 0.582037, 0.495038, 0.581092, 0.497349, 0.304193, 0.497349, 0.304193, 0.220451, 0.303575, 0.497413, 0.026676, 0.497413, 0.026676, 0.220515, 0.581711, 0.220451, 0.858609, 0.220451, 0.858609, 0.497349, 0.026676, 0.774835, 0.026676, 0.497936, 0.303575, 0.497936, 0.858577, 0.774867, 0.581679, 0.774867, 0.581679, 0.497968, 0.028129, 0.774958, 0.305028, 0.774958, 0.305028, 0.809511, 0.304193, 0.88038, 0.304193, 0.845827, 0.581092, 0.845827, 0.304842, 0.88119, 0.304842, 0.915743, 0.027943, 0.915743, 0.028778, 0.81113, 0.305676, 0.81113, 0.305676, 0.845682, 0.304842, 0.916361, 0.304842, 0.950913, 0.027943, 0.950914, 0.581092, 0.775485, 0.581092, 0.810038, 0.304193, 0.810038, 0.304854, 0.951628, 0.304842, 0.98618, 0.027943, 0.986085, 0.027943, 0.846019, 0.304842, 0.846019, 0.304842, 0.880571, 0.581092, 0.950722, 0.304193, 0.950722, 0.304193, 0.916169, 0.304388, 0.952523, 0.581287, 0.952523, 0.581287, 0.987075, 0.304193, 0.845209, 0.304193, 0.810656, 0.581092, 0.810656, 0.581092, 0.880998, 0.581092, 0.915551, 0.304193, 0.915551, 0.582036, 0.771937, 0.305138, 0.771937, 0.305138, 0.495038]

    gl.enableVertexAttribArray(attributes.frag_texture);
    const boxTextureBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxTextureBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    gl.vertexAttribPointer(attributes.frag_texture, 2, gl.FLOAT, false, 2 * Float32Array.BYTES_PER_ELEMENT, 0);

*/



    requestAnimationFrame(now => {

        render(gl, now, {
            attributes,
            uniforms,
            vao,
            imageTexture,
        });
    })
};

export default menu;
