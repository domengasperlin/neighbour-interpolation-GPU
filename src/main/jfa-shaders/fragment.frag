#version 300 es


precision highp float;

layout(location = 0) out vec4 outPosition;
layout(location = 1) out vec4 outColor;

in vec2 texCoords;

uniform sampler2D texture_jfa, texture_u_image;
uniform float width,height;
uniform float step;

void main(void) {
    vec4 fragData0,colorData0;



    fragData0  = texture( texture_jfa, gl_FragCoord.st );
    colorData0 = texture( texture_u_image, gl_FragCoord.st );


    // outColor from before
    //outColor = texture(texture_jfa, texCoords);
    outPosition = texture(texture_jfa, texCoords);
    outColor = colorData0;

}