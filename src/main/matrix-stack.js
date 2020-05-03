const {mat4, glMatrix} = require('gl-matrix');
glMatrix.setMatrixArrayType(Float32Array);

let matrixStack = [];

export function pushMatrix(matrix) {
    let copy = mat4.clone(matrix);
    matrixStack.push(copy);
}

export function popMatrix() {
    if (matrixStack.length == 0) {
        throw "Stack is empty";
    }
    return matrixStack.pop();

}