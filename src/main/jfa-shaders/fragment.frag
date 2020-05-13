#version 300 es

precision highp float;

struct Material {
    sampler2D color1M;
    sampler2D color2M;
};

uniform Material material;

uniform float step;
uniform float imageWidth;
uniform float imageHeight;

in vec2 point;

layout (location = 0) out vec4 color1;
layout (location = 1) out vec4 color2;


void main()
{

    float pixelWidth = 1.0/imageWidth;
    float pixelHeight = 1.0/imageHeight;

    vec4 texture1 = texture(material.color1M, point.st);
    vec4 texture2 = texture(material.color2M, point.st);


    // All possible directions
    vec2 directions[8];
    directions[0] = vec2(point.s - step*pixelWidth, point.t - step*pixelHeight);
    directions[1] = vec2(point.s                 ,  point.t - step*pixelHeight);
    directions[2] = vec2(point.s + step*pixelWidth, point.t - step*pixelHeight);
    directions[3] = vec2(point.s - step*pixelWidth, point.t);
    directions[4] = vec2(point.s + step*pixelWidth, point.t);
    directions[5] = vec2(point.s - step*pixelWidth, point.t + step*pixelHeight);
    directions[6] = vec2(point.s                  , point.t + step*pixelHeight);
    directions[7] = vec2(point.s + step*pixelWidth, point.t + step*pixelHeight);


    float distance = 0.0;

    if (texture1.a == 1.0) {
        distance = (texture1.r-point.s)*(texture1.r-point.s) + (texture1.g-point.t)*(texture1.g-point.t);
    }


    for (int i = 0; i < 8; i++)
    {
        if (directions[i].s < 0.0 || directions[i].s >= imageWidth || directions[i].t < 0.0 || directions[i].t >= imageHeight) {

            continue;
        }

        vec4 neighbor0 = texture(material.color1M, directions[i]);

        if (neighbor0.a != 1.0) {
            continue;
        }


        float updatedDistance = (neighbor0.r-point.s)*(neighbor0.r-point.s) + (neighbor0.g-point.t)*(neighbor0.g-point.t);

        if (texture1.a != 1.0 || updatedDistance < distance) {
            distance = updatedDistance;
            texture1 = neighbor0;
            texture2 = texture(material.color2M, directions[i]);
        }

    }

    color1 = texture1;
    color2 = texture2;

}
