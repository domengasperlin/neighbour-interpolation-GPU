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

// Textures
let imageTexture = null;
let imageDataTexture1 = null;
let jfaXYTexture = null;

// Webgl context
let gl = null;

// Select stages (programs) to be performed
const performStages = [1,2];

async function initTextures(gl) {
    // Image texture that will be used for sampling in program 1
    imageTexture = await createTexture.loadTexture(gl, img);
    // The same image is used instead of data texture if we want to skip the sampling program (e.g. input image is already sampled)
    imageDataTexture1 = await createTexture.loadTexture(gl, img);
    // Floating texture used to JFA algorithm
    jfaXYTexture = await createTexture.createXYTexture(gl);

}

// Resize canvas and viewport
const resize = () => {
    resizeCanvas(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
};

function renderDraw(n) {
    //gl.clearColor(0.0, 1.0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
    resize();
}

function bindFramebufferAndSetViewport(fb, width, height) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.viewport(0, 0, width, height);
}

const main = async () => {

    const canvas = document.getElementById('canvas');

    gl = canvas.getContext('webgl2');

    resize();
    window.onresize = resize;

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
        position: gl.getAttribLocation(jfaProgram, 'a_position'),
    };

    const uniformsJFA = {
        textureLocation1: gl.getUniformLocation(jfaProgram, 'texture_u_image'),
        resolution: gl.getUniformLocation(jfaProgram, 'resolution'),
    };



    // ======================================================================== FRAMEBUFFER ========================================================================
    const frameBuffertex1 = gl.createFramebuffer();

    bindFramebufferAndSetViewport(frameBuffertex1, gl.canvas.width, gl.canvas.height);

    // Attach the texture as the first color attachment to the framebuffer
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, imageDataTexture1, 0);

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





    if (performStages.includes(1)) {
        // Sets WebGL program for sampling e.g. all the gl.uniformXXX functions set uniforms on the current program.
        gl.useProgram(samplingProgram);


        // Render to the canvas ===========================================================================
        gl.bindVertexArray(vertexArrayObject);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, imageTexture);


        // You only need to set the texture unit if you use a unit other than 0 because uniforms default to 0.
        gl.uniform1i(uniformsSampling.textureLocation1, 0);

        renderDraw(6);


        gl.bindTexture(gl.TEXTURE_2D, imageTexture);
        // Render to our targetTexture by binding the framebuffer ==========================================
        bindFramebufferAndSetViewport(frameBuffertex1, gl.canvas.width, gl.canvas.height);

        gl.uniform1i(uniformsSampling.textureLocation1, 0);

        gl.drawBuffers([gl.COLOR_ATTACHMENT0]);
        renderDraw(6);

        // Unbind the framebuffer
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindVertexArray(null);

    }



    if (performStages.includes(2)) {
        gl.useProgram(jfaProgram);

        // ======================================================================== CREATE AND BIND ARRAY_BUFFER AND VERTEX ARRAY ====================================================

        // Put data in a buffer (array of binary data that will be uploaded to GPU)
        let positionBufferJFA = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferJFA); // Bound BUFFER will be used by attribute below
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

        // CREATE VERTEX ARRAY - First we need to create a collection of attribute state called a Vertex Array Object.
        // The state of attributes, which buffers to use for each one and
        // how to pull out data from those buffers, is collected into a vertex array object (VAO).
        let vertexArrayObjectJFA = gl.createVertexArray();
        // Make that the current vertex array so that all of our attribute settings will apply to that set of attribute state
        gl.bindVertexArray(vertexArrayObjectJFA);

        // This tells WebGL we want to get data out of a buffer. If we don't turn on the attribute then the attribute will have a constant value.
        gl.enableVertexAttribArray(attributesJFA.position);
        // Then we need to specify how to pull the data out,
        // A hidden part of gl.vertexAttribPointer is that it binds the current ARRAY_BUFFER to the attribute => positions would get pulled from current bound buffer
        // Specify type of data to pull and its structure
        gl.vertexAttribPointer(attributesJFA.position, 2, gl.FLOAT, false, 0, 0);
        // Buffers are not random access. Instead a vertex shaders is executed a specified number of times.
        // Each time it's executed the next value from each specified buffer is pulled out and assigned to an attribute.
        gl.bindVertexArray(null);

        // ======================================================================== UNBIND ARRAY_BUFFER, VERTEX ARRAY =======================================================================
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        // Unbind the framebuffer and Render to the canvas
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        gl.bindVertexArray(vertexArrayObjectJFA);
        // Specifies which texture unit to make active.
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, imageDataTexture1);

        // You only need to set the texture unit if you use a unit other than 0 because uniforms default to 0.
        gl.uniform1i(uniformsJFA.textureLocation1, 0);
        renderDraw(6);
        gl.bindVertexArray(null);

    }

};

export default main;
