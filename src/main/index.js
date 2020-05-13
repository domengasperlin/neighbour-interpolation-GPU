// Shaders
import samplingFragmentShaderSrc from './sampling-shaders/fragment.frag';
import samplingVertexShaderSrc from './sampling-shaders/vertex.vert';

import jfaFragmentShaderSrc from './jfa-shaders/fragment.frag';
import jfaVertexShaderSrc from './jfa-shaders/vertex.vert';

import simpleDFragmentShaderSrc from './simple-draw/fragment.frag';
import simpleDVertexShaderSrc from './simple-draw/vertex.vert';

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
let jfaXYDataTexture = null;
// Webgl context
let gl = null;
// Select stages (programs) to be performed
const performStages = [1, 2, 3];

async function initTextures(gl) {
    // Image texture that will be used for sampling in program 1
    imageTexture = await createTexture.loadTexture(gl, img);
    // The same image is used instead of data texture if we want to skip the sampling program (e.g. input image is already sampled)
    imageDataTexture1 = await createTexture.loadTexture(gl, img);
    // Floating texture used to JFA algorithm
    jfaXYDataTexture = await createTexture.createXYTexture(gl);

}

// Resize canvas and viewport
const resize = () => {
    resizeCanvas(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
};

function renderDraw(n) {
    gl.clearColor(0.0, 0.0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
    resize();
}

function bindFramebufferAndSetViewport(fb, width, height) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.viewport(0, 0, width, height);
}

// For showing stages
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function prepareSimpleProgramAndUse(program, buffer, vao, attribute) {
    // ======================================================================== CREATE AND BIND ARRAY_BUFFER AND VERTEX ARRAY ====================================================

    // Put data in a buffer (array of binary data that will be uploaded to GPU)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer); // Bound BUFFER will be used by attribute below
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Make that the current vertex array so that all of our attribute settings will apply to that set of attribute state
    gl.bindVertexArray(vao);

    // This tells WebGL we want to get data out of a buffer. If we don't turn on the attribute then the attribute will have a constant value.
    gl.enableVertexAttribArray(attribute.position);
    // Then we need to specify how to pull the data out,
    // A hidden part of gl.vertexAttribPointer is that it binds the current ARRAY_BUFFER to the attribute => positions would get pulled from current bound buffer
    // Specify type of data to pull and its structure
    gl.vertexAttribPointer(attribute.position, 2, gl.FLOAT, false, 0, 0);
    // Buffers are not random access. Instead a vertex shaders is executed a specified number of times.
    // Each time it's executed the next value from each specified buffer is pulled out and assigned to an attribute.


    // ======================================================================== UNBIND ARRAY_BUFFER, VERTEX ARRAY, USE PROGRAM =================================================
    gl.bindVertexArray(null);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.useProgram(program);

}

function bindTextureAndAttachementToFrameBuffer(frameBuffer, texture, attachement) {

    // So we can render to floating point textures -> for our data texture
    const ext = gl.getExtension("EXT_color_buffer_float");
    if (!ext) {
        alert("need EXT_color_buffer_float");
        return;
    }

    bindFramebufferAndSetViewport(frameBuffer, gl.canvas.width, gl.canvas.height);

    // Attach the texture as the first color attachment to the framebuffer
    gl.framebufferTexture2D(gl.FRAMEBUFFER, attachement, gl.TEXTURE_2D, texture, 0);

    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !==
        gl.FRAMEBUFFER_COMPLETE) {
        console.error("This combination of attachments not supported!");
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

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
            jfa_material_tex1: gl.getUniformLocation(jfaProgram, 'material.color1M'),
            jfa_material_tex2: gl.getUniformLocation(jfaProgram, 'material.color2M'),
            jfa_width: gl.getUniformLocation(jfaProgram, 'imageWidth'),
            jfa_height: gl.getUniformLocation(jfaProgram, 'imageHeight'),
            jfa_step: gl.getUniformLocation(jfaProgram, 'step'),
        };

        // SIMPLE DRAW PROGRAM

        const sDrawShaders = [
            {src: simpleDFragmentShaderSrc, type: gl.FRAGMENT_SHADER},
            {src: simpleDVertexShaderSrc, type: gl.VERTEX_SHADER}
        ];

        const sDrawProgram = createProgram(gl, sDrawShaders);

        const attributesSDraw = {
            position: gl.getAttribLocation(sDrawProgram, 'a_position'),
        };

        const uniformsSDraw = {
            textureLocation1: gl.getUniformLocation(sDrawProgram, 'texture_u_image'),
        };


        // ======================================================================== FRAMEBUFFER SETUP ========================================================================
        const samplingColorsframeBuffertex = gl.createFramebuffer();

        bindTextureAndAttachementToFrameBuffer(samplingColorsframeBuffertex, imageDataTexture1, gl.COLOR_ATTACHMENT0);

        bindTextureAndAttachementToFrameBuffer(samplingColorsframeBuffertex, jfaXYDataTexture, gl.COLOR_ATTACHMENT1);


        // ======================================================================== SAMPLING PROGRAM  ====================================================

        if (performStages.includes(1)) {

            let positionBuffer = gl.createBuffer();
            let vertexArrayObject = gl.createVertexArray();
            prepareSimpleProgramAndUse(samplingProgram, positionBuffer, vertexArrayObject, attributesSampling.position);


            // Render to the canvas
            gl.bindVertexArray(vertexArrayObject);

            // Prepare textures and texture units
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, imageTexture);
            gl.uniform1i(uniformsSampling.textureLocation1, 0);

            renderDraw(6);


            // Render to samplingColorsframeBuffertex by binding the framebuffer ==========================================
            bindFramebufferAndSetViewport(samplingColorsframeBuffertex, gl.canvas.width, gl.canvas.height);
            gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);
            renderDraw(6);



            // Clean up before next program
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.bindVertexArray(null);
            gl.bindTexture(gl.TEXTURE_2D, null);

        }


        // ========================================================================  JFA PROGRAM ====================================================

        let coordinatesTextures = [jfaXYDataTexture];
        let colorTextures = [jfaXYDataTexture];

        if (performStages.includes(2)) {

            let positionBufferJFA = gl.createBuffer();
            let vertexArrayObjectJFA = gl.createVertexArray();
            prepareSimpleProgramAndUse(jfaProgram, positionBufferJFA, vertexArrayObjectJFA, attributesJFA.position);

            gl.bindVertexArray(vertexArrayObjectJFA);


            // EXECUTE JFA ALGORITHM
            gl.uniform1f(uniformsJFA.jfa_width, gl.canvas.width);
            gl.uniform1f(uniformsJFA.jfa_height, gl.canvas.height);

            let step = 1;
            while (step * 2 < gl.canvas.width || step * 2 < gl.canvas.height) step *= 2;


            const jumpFloodingFrameBuffer = gl.createFramebuffer();

            // perform iterations
            let curr = 0;

            while (step >= 1) {

                // Create textures for current iteration
                let color = createTexture.createDataTexture(gl);
                let coordinates = createTexture.createDataTexture(gl);

                // Bind them
                bindTextureAndAttachementToFrameBuffer(jumpFloodingFrameBuffer, color, gl.COLOR_ATTACHMENT0);
                bindTextureAndAttachementToFrameBuffer(jumpFloodingFrameBuffer, coordinates, gl.COLOR_ATTACHMENT1);
                bindFramebufferAndSetViewport(jumpFloodingFrameBuffer, gl.canvas.width, gl.canvas.height);

                // Bind appropriate textures on different positions
                // Specifies which texture unit to make active.

                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, coordinatesTextures[curr]);

                gl.activeTexture(gl.TEXTURE1);
                gl.bindTexture(gl.TEXTURE_2D, colorTextures[curr]);

                // Prepare buffers to draw the outputs on the two textures
                gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);

                // Setup the uniforms
                gl.uniform1f(uniformsJFA.jfa_step, step);
                gl.uniform1i(uniformsJFA.jfa_material_tex1, 0);
                gl.uniform1i(uniformsJFA.jfa_material_tex2, 1);

                renderDraw(6);

                colorTextures.push(color);
                coordinatesTextures.push(coordinates);

                curr++;
                step /= 2;
            }


            // Clean up before next program
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.bindVertexArray(null);
            gl.bindTexture(gl.TEXTURE_2D, null);

        }


        // ========================================================================  SIMPLE DRAW PROGRAM ====================================================
        if (performStages.includes(3)) {

            // Choose demo for results with specified delay
            let stepDelay = 1000;
            let showSteps = [1,2,3,4];

            let positionBufferSDraw = gl.createBuffer();
            let vertexArrayObjectSDraw = gl.createVertexArray();
            prepareSimpleProgramAndUse(sDrawProgram, positionBufferSDraw, vertexArrayObjectSDraw, attributesSDraw.position);

            gl.bindVertexArray(vertexArrayObjectSDraw);

            // Specifies which texture unit to make active.
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, imageDataTexture1);

            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, jfaXYDataTexture);

            gl.activeTexture(gl.TEXTURE3);
            gl.bindTexture(gl.TEXTURE_2D, imageTexture);

            if (showSteps.includes(1)) {

                document.getElementById('demo_id').innerText = `1 Original image`;
                gl.uniform1i(uniformsSDraw.textureLocation1, 3);
                renderDraw(6);
                await sleep(stepDelay);
            }

            if (showSteps.includes(2)) {

                document.getElementById('demo_id').innerText = `2 Image after sampling seed points`;
                gl.uniform1i(uniformsSDraw.textureLocation1, 0);
                renderDraw(6);
                await sleep(stepDelay);
            }

            if (showSteps.includes(3)) {

                document.getElementById('demo_id').innerText = `3 Position coordinates texture`;
                gl.uniform1i(uniformsSDraw.textureLocation1, 1);
                renderDraw(6);
                await sleep(stepDelay);
            }


            if (showSteps.includes(4)) {

                for (let j = 0; j < coordinatesTextures.length; j++) {
                    document.getElementById('demo_id').innerText = `4 Iteration: ${j} of JFA`;

                    gl.activeTexture(gl.TEXTURE2);
                    gl.bindTexture(gl.TEXTURE_2D, coordinatesTextures[j]);
                    gl.uniform1i(uniformsSDraw.textureLocation1, 2);
                    renderDraw(6);
                    await sleep(500);

                }
            }

            // if (showSteps.includes(5)) {
            //
            //     for (let j = 0; j < colorTextures.length; j++) {
            //         document.getElementById('demo_id').innerText = `5 Iterations ${j} of JFA`;
            //
            //         gl.activeTexture(gl.TEXTURE3);
            //         gl.bindTexture(gl.TEXTURE_2D, colorTextures[j]);
            //         gl.uniform1i(uniformsSDraw.textureLocation1, 3);
            //         renderDraw(6);
            //         await sleep(100);
            //
            //     }
            // }

            gl.bindVertexArray(null);
            gl.bindTexture(gl.TEXTURE_2D, null);

            // Clean up
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.bindVertexArray(null);
            gl.bindTexture(gl.TEXTURE_2D, null);

        }


    }
;

export default main;
