import fragmentShaderSrc from './shaders/fragment.frag';
import vertexShaderSrc from './shaders/vertex.vert';
import resizeCanvas from './resize-canvas';
import createProgram from './create-program';
import buffer from './create-buffer';
import render from './draw';




const menu = async () => {
    // Create a program
    const canvas = document.getElementById('canvas');

    const gl = canvas.getContext('webgl2');

    const shaders = [
        {src: fragmentShaderSrc, type: gl.FRAGMENT_SHADER},
        {src: vertexShaderSrc, type: gl.VERTEX_SHADER}
    ];

    const program = createProgram(gl, shaders);


    // Set up attributes and uniforms
    const attributes = {
        position: gl.getAttribLocation(program, 'attr_position'),
    };

    const uniforms = {
        world: gl.getUniformLocation(program, 'mWorld'),
        view: gl.getUniformLocation(program, 'mView'),
        model: gl.getUniformLocation(program, 'mModel'),
        projection: gl.getUniformLocation(program, 'mProj'),
    };

    // Set WebGL program here (we have only one)
    gl.useProgram(program);

    // Resize canvas and viewport
    const resize = () => {
        resizeCanvas(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    };

    // Setup canvas
    window.onresize = resize;
    resize();

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);


    requestAnimationFrame(now => {

        render(gl, now, {
            attributes,
            uniforms,
        });
    })
};

export default menu;
