// Shaders
import samplingFragmentShaderSrc from './sampling-shaders/fragment.frag';
import samplingVertexShaderSrc from './sampling-shaders/vertex.vert';

import jfaFragmentShaderSrc from './jfa-shaders/fragment.frag';
import jfaVertexShaderSrc from './jfa-shaders/vertex.vert';

// Helper functions
import createProgram from './create-program';
import createTexture from './create-texture';
import render from './draw';
import resizeCanvas from './resize-canvas';
// Assets import
import img from '../assets/images/lenna.png'
import verts from "./two-triangles";

let imageTexture = null;
let imageDataTexture = null;

async function initTextures(gl) {
    imageTexture = await createTexture.loadTexture(gl, img);
    imageDataTexture = await createTexture.createDataTexture(gl);
}


const main = async () => {

    const canvas = document.getElementById('canvas');

    const gl = canvas.getContext('webgl2');

    await initTextures(gl);

    // ========================================================================  CREATE PROGRAMS, SETUP ATTRIBUTES AND UNIFORM LOCATIONS ========================================================================


    // SAMPLING PROGRAM

    const samplingShaders = [
        {src: samplingFragmentShaderSrc, type: gl.FRAGMENT_SHADER},
        {src: samplingVertexShaderSrc, type: gl.VERTEX_SHADER}
    ];

    const samplingProgram = createProgram(gl, samplingShaders);

    // Looking up attribute locations
    const attributesSampling = {
        position: gl.getAttribLocation(samplingProgram, 'a_position'),
    };

    // Looking up uniform locations
    const uniformsSampling = {
        textureLocation1: gl.getUniformLocation(samplingProgram, 'texture_u_image'),
        resolution: gl.getUniformLocation(samplingProgram, 'resolution'),
    };

    // JFA PROGRAM

    const jfaShaders = [
        {src: jfaFragmentShaderSrc, type: gl.FRAGMENT_SHADER},
        {src: jfaVertexShaderSrc, type: gl.VERTEX_SHADER}
    ];

    const jfaProgram = createProgram(gl, jfaShaders);

    const attributesJFA = {
        step: gl.getAttribLocation(jfaProgram, 'step'),
    };

    const uniformsJFA = {

    };


    // ======================================================================== FRAMEBUFFER ========================================================================
    const frameBuffertex1 = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffertex1);

    // Attach the texture as the first color attachment to the framebuffer
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, imageDataTexture, 0);

    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !==
        gl.FRAMEBUFFER_COMPLETE) {
        console.error("This combination of attachments not supported!");
    }


    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    // ======================================================================== CREATE AND BIND ARRAY_BUFFER AND VERTEX ARRAY ====================================================

    // Put data in a buffer (array of binary data that will be uploaded to GPU)
    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); // Bound BUFFER will be used by attribute below
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // CREATE VERTEX ARRAY - First we need to create a collection of attribute state called a Vertex Array Object.
    // The state of attributes, which buffers to use for each one and
    // how to pull out data from those buffers, is collected into a vertex array object (VAO).
    let vertexArrayObject = gl.createVertexArray();
    // Make that the current vertex array so that all of our attribute settings will apply to that set of attribute state
    gl.bindVertexArray(vertexArrayObject);

    // This tells WebGL we want to get data out of a buffer. If we don't turn on the attribute then the attribute will have a constant value.
    gl.enableVertexAttribArray(attributesSampling.position);
    // Then we need to specify how to pull the data out,
    // A hidden part of gl.vertexAttribPointer is that it binds the current ARRAY_BUFFER to the attribute => positions would get pulled from current bound buffer
    // Specify type of data to pull and its structure
    gl.vertexAttribPointer(attributesSampling.position, 2, gl.FLOAT, false, 0, 0);
    // Buffers are not random access. Instead a vertex shaders is executed a specified number of times.
    // Each time it's executed the next value from each specified buffer is pulled out and assigned to an attribute.
    gl.bindVertexArray(null);


    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    // ======================================================================== UNBIND ARRAY_BUFFER, VERTEX ARRAY =======================================================================


    // Resize canvas and viewport
    const resize = () => {
        resizeCanvas(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    };
    resize();
    window.onresize = resize;

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    // Sets WebGL program for sampling e.g. all the gl.uniformXXX functions set uniforms on the current program.
    gl.useProgram(samplingProgram);
    //gl.useProgram(jfaProgram);


    render(gl, 0, {
        attributesSampling,
        uniformsSampling,
        vertexArrayObject,
        imageTexture,
        imageDataTexture,
        frameBuffertex1,
    });

    //gl.useProgram(jfaProgram);

    //gl.drawArrays(gl.TRIANGLES, 0, 6)

    //gl.getFramebufferAttachmentParameter(frameBuffertex1, gl.COLOR_ATTACHMENT0)

};

export default main;
