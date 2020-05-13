#version 300 es


precision highp float;

in vec2 texCoords;
layout(location = 0) out vec4 outColor;


uniform sampler2D positions_texture;
uniform sampler2D image_texture;


void main(void) {

    vec2 positions = texture(positions_texture, texCoords).st;

    outColor = texture(image_texture, positions);


}