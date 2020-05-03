const {mat4, glMatrix} = require('gl-matrix');
glMatrix.setMatrixArrayType(Float32Array);


const draw = (gl, now, state) => {


};

const render = (gl, now, state) => {

    draw(gl, now, state);

    requestAnimationFrame(now => render(gl, now, state));
};

export default render;
