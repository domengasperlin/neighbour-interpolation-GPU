#version 300 es


precision highp float;

out vec4 outColor;
in vec2 texCoords;

uniform sampler2D texture_u_image;
uniform vec2 resolution;


void main(void) {

    vec2 position = texCoords;

    vec4 tmpOutColor = texture(texture_u_image, texCoords);

    outColor = tmpOutColor;
//    outColor = vec4(1.0,0.0,0.0,1.0);

}