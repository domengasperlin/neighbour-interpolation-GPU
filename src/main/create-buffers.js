const {glMatrix} = require('gl-matrix');
glMatrix.setMatrixArrayType(Float32Array);



const createVertexBuffer = gl => {
    // Create and initialize buffer
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    return vertexBuffer;
};

const createRenderBuffer = gl => {

    const renderBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderBuffer);
    // Storage size of renderBuffer
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, gl.canvas.width, gl.canvas.height);

    return renderBuffer;
};

const createFrameBuffer = gl => {

    const frameBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);

    return frameBuffer;
};


export default {
    createVertexBuffer,
    createRenderBuffer,
    createFrameBuffer,
};
