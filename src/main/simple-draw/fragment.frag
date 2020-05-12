#version 300 es


precision highp float;

in vec2 texCoords;
layout(location = 0) out vec4 outColor;


uniform sampler2D texture_u_image;


void main(void) {


    vec4 tmpOutColor = texture(texture_u_image, texCoords);

    outColor = tmpOutColor;


}