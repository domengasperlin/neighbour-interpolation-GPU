#version 300 es

precision highp float;


// input, It will receive data from a buffer
in vec2 a_position;

out vec2 texCoords;

void main(void) {

    texCoords = (a_position+1.0)/2.0;
    gl_Position = vec4(a_position, 1.0, 1.0);


}