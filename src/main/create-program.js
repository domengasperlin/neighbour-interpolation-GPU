import createShader from './create-shader';

const createProgram = (gl, shaderData) => {
    const program = gl.createProgram();

    const shaders = shaderData
        .map(s => createShader(gl, s.src, s.type))
        .forEach(s => gl.attachShader(program, s));

    gl.linkProgram(program);

    return program;
};

export default createProgram;
