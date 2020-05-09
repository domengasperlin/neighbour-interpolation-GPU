const {mat4, glMatrix} = require('gl-matrix');
glMatrix.setMatrixArrayType(Float32Array);


const draw = (gl, now, state) => {
    gl.bindVertexArray(state.vao);



    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, state.imageTexture)

    gl.clear(gl.COLOR_BUFFER_BIT |  gl.DEPTH_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, 6)


};

const render = (gl, now, state) => {

    draw(gl, now, state);

    requestAnimationFrame(now => render(gl, now, state));
};

export default render;
