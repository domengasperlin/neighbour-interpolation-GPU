const {glMatrix} = require('gl-matrix');
glMatrix.setMatrixArrayType(Float32Array);



const createVertexBuffer = gl => {
    // Create and initialize buffer
    const geometryBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, geometryBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, (new Float32Array([])), gl.STATIC_DRAW);

    return geometryBuffer;
}

const createRenderBuffer = gl => {

    const renderBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderBuffer);
    // Storage size of renderBuffer
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, gl.canvas.width, gl.canvas.height);

    return renderBuffer;
}

const createFrameBuffer = gl => {

    const frameBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);

    return frameBuffer;
}


export default {
    createVertexBuffer,
    createRenderBuffer,
    createFrameBuffer,
};
