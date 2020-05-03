const {mat4, glMatrix} = require('gl-matrix');

export function createIdentityMatrix() {
    let matrix = new Float32Array(16);
    mat4.identity(matrix);
    return matrix;
}
