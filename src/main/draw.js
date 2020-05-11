const {mat4, glMatrix} = require('gl-matrix');
glMatrix.setMatrixArrayType(Float32Array);


const draw = (gl, now, state) => {

    // Rasterize TRIANGLE primitives
    gl.drawArrays(gl.TRIANGLES, 0, 6)

};

const render = (gl, now, state) => {


    // Render to our targetTexture by binding the framebuffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, state.frameBuffertex1);
    // Specifies which texture unit to make active.
    gl.activeTexture(gl.TEXTURE0);
    //gl.uniform1i(state.uniformsSampling.textureLocation1, 0);
    gl.bindTexture(gl.TEXTURE_2D, state.imageTexture);

    // Clear buffers
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //gl.bindTexture(gl.TEXTURE2D, state.imageTexture);
    gl.drawArrays(gl.TRIANGLES, 0, 6)

    // Unbind the framebuffer and Render to the canvas
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    gl.bindVertexArray(state.vertexArrayObject);
    // Specifies which texture unit to make active.
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, state.imageTexture);

    // You only need to set the texture unit if you use a unit other than 0 because uniforms default to 0.
    //gl.uniform1i(state.uniformsSampling.textureLocation1, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    gl.drawArrays(gl.TRIANGLES, 0, 6)

    //requestAnimationFrame(now => render(gl, now, state));
};

export default render;
