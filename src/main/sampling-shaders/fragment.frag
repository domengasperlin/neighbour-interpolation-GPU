#version 300 es


precision highp float;

in vec2 texCoords;
layout(location = 0) out vec4 outColor;


uniform sampler2D texture_u_image;
uniform vec2 resolution;

float rand(vec2 co){
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main(void) {

    vec2 position = texCoords;

    vec4 tmpOutColor = texture(texture_u_image, texCoords);

    if (rand(vec2(texCoords.x, texCoords.y)) < 0.5) {

        // Zero alpha black pixel
        tmpOutColor = vec4(tmpOutColor.rgb, 0.0);

    }

    outColor = tmpOutColor;

}