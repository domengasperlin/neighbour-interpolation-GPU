#version 300 es

precision mediump float;

uniform sampler2D tex0,tex1; /* the textures to read from */
uniform float width,height; /* window dimensions */
uniform float step; /* jump flooding step size */

out vec4 fragData;

void main()
{

    fragData = vec4(1.0,0.0,0.0,1.0);
}
