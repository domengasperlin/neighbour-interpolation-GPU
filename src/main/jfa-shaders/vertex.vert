#version 300 es

precision mediump float;
in vec3 position;
uniform vec4 projectionMatrix;
uniform vec4 modelviewMatrix;

void main()
{
    gl_Position = projectionMatrix * modelviewMatrix * vec4(position, 1.0);
}
