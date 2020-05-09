import createShader from './create-shader';

const createProgram = (gl, shaderData) => {
    const program = gl.createProgram();

    const shaders = shaderData
        .map(s => createShader(gl, s.src, s.type))
        .forEach(s => gl.attachShader(program, s));

    gl.linkProgram(program);

    let success = gl.getProgramParameter(program, gl.LINK_STATUS);

    if (success) return program;

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);

};

export default createProgram;
