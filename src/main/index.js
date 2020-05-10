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
let dataTexture = null;

async function initTextures(gl) {
    imageTexture = await createTexture.loadTexture(gl, img);
    dataTexture = await createTexture.createDataTexture(gl);
}

let verts = [
    -1, -1,
    -1, 1,
    1, 1,

    -1, -1,
    1, 1,
    1, -1,
];


const main = async () => {

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
        position: gl.getAttribLocation(program, 'a_position'),
    };

    const uniforms = {
        textureLocation1: gl.getUniformLocation(program, 'texture_u_image'),
        textureLocation2: gl.getUniformLocation(program, 'texture_u2'),
        resolution: gl.getUniformLocation(program, 'resolution'),
    };


    const fbTexture1 = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbTexture1);

    // attach the texture as the first color attachment
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, imageTexture, 0);

    // Check if framebuffer will work
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !==
        gl.FRAMEBUFFER_COMPLETE) {
        console.error("This combination of attachments not supported!");
    }

    // TODO: CHECK WHAT SEEMS TO BE THE PROBLEM HERE
    const fbTexture2 = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbTexture2);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, dataTexture, 0);
    // Check if framebuffer will work
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !==
        gl.FRAMEBUFFER_COMPLETE) {
        console.error("This combination of attachments not supported!");
    }

    // Unbind the framebuffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    // Put data in a buffer
    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // CREATE VERTEX ARRAY
    // First we need to create a collection of attribute state called a Vertex Array Object.
    let vao = gl.createVertexArray();
    // Make that the current vertex array so that all of our attribute settings will apply to that set of attribute state
    gl.bindVertexArray(vao);

    // This tells WebGL we want to get data out of a buffer. If we don't turn on the attribute then the attribute will have a constant value.
    gl.enableVertexAttribArray(attributes.position);
    // Then we need to specify how to pull the data out, A hidden part of gl.vertexAttribPointer is that it binds the current ARRAY_BUFFER to the attribute
    gl.vertexAttribPointer(attributes.position, 2, gl.FLOAT, false, 0, 0);

    // UNBIND VERTEX ARRAY
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

    requestAnimationFrame(now => {

        render(gl, now, {
            attributes,
            uniforms,
            vao,
            imageTexture,
            dataTexture,
            fbTexture1,
            fbTexture2,
        });

    })
};

export default main;
