#version 300 es


precision highp float;

in vec2 texCoords;
layout(location = 0) out vec4 outColor;
layout(location = 1) out vec4 outPosition;


uniform sampler2D texture_u_image;

float rand(vec2 co){
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main(void) {


    vec4 tmpOutColor = texture(texture_u_image, texCoords);
    // (${x,y},${vedno 0},${kot alpha pri barvi})
    vec4 tmpPosition = vec4(texCoords, 0.0, 1.0);

    if (rand(vec2(texCoords.x, texCoords.y)) < 0.95) {

        // Zero alpha black pixel
        tmpOutColor = vec4(tmpOutColor.rgb, 0.0);

        tmpPosition = vec4(texCoords, 0.0, 0.0);

    }

    outColor = tmpOutColor;
    outPosition = tmpPosition;


}