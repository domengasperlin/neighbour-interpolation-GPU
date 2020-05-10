const {mat4, glMatrix} = require('gl-matrix');
glMatrix.setMatrixArrayType(Float32Array);


const draw = (gl, now, state) => {

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, 6)

    //gl.drawBuffers(gl.COLOR_ATTACHMENT1)


};

const render = (gl, now, state) => {

    // render to our targetTexture by binding the framebuffer

    /*
    gl.bindFramebuffer(gl.FRAMEBUFFER, state.fbTexture2);

    //gl.activeTexture(gl.TEXTURE1);
    gl.uniform1i(state.uniforms.textureLocation2, 1);

    //gl.bindTexture(gl.TEXTURE2D, state.dataTexture);



    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    draw(gl, now, state);

    */
    // Unbind the framebuffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    // render to the canvas
    gl.bindVertexArray(state.vao);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, state.imageTexture);

    // You only need to set the texture unit if you use a unit other than 0 because uniforms default to 0.
    gl.uniform1i(state.uniforms.textureLocation1, 0);
    draw(gl, now, state);


    requestAnimationFrame(now => render(gl, now, state));
};

export default render;
