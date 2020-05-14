#version 300 es


precision highp float;

in vec2 point;
in vec2 texCoords;
layout(location = 0) out vec4 outColor;


uniform sampler2D positions_texture;
uniform sampler2D image_texture;
uniform float imageWidth;
uniform float imageHeight;

void main(void) {

    vec2 positions = texture(positions_texture, texCoords).st;

    float pixelWidth = 1.0/imageWidth;
    float pixelHeight = 1.0/imageHeight;

    float maxStep = 30.0; // window size parameter
    float step = 1.0;

    vec2 directions[8];
    directions[0] = vec2(point.s - step*pixelWidth, point.t - step*pixelHeight);
    directions[1] = vec2(point.s                 ,  point.t - step*pixelHeight);
    directions[2] = vec2(point.s + step*pixelWidth, point.t - step*pixelHeight);
    directions[3] = vec2(point.s - step*pixelWidth, point.t);
    directions[4] = vec2(point.s + step*pixelWidth, point.t);
    directions[5] = vec2(point.s - step*pixelWidth, point.t + step*pixelHeight);
    directions[6] = vec2(point.s                  , point.t + step*pixelHeight);
    directions[7] = vec2(point.s + step*pixelWidth, point.t + step*pixelHeight);

    // be careful for overflow
    int pixelsIn = 0;
    vec4 finalColor = vec4(0,0,0,0);

    vec4 tmpOutColor = texture(image_texture, positions);


    while(step < maxStep) {

        for (int i = 0; i < 8; i++) {

            vec4 distanceTexturePoint = texture(positions_texture, directions[i]);

            if (distanceTexturePoint.a != 1.0) {
                continue;
            }

            float distanceToBlue = (distanceTexturePoint.r-point.s)*(distanceTexturePoint.r-point.s) + (distanceTexturePoint.g-point.t)*(distanceTexturePoint.g-point.t);
            float distanceToNeighbour = (directions[i].r-point.s)*(directions[i].r-point.s) + (directions[i].g-point.t)*(directions[i].g-point.t);

            // Check the distance if smaller count the pixel in
            if (distanceToNeighbour < distanceToBlue) {

                finalColor += texture(image_texture, positions);
                pixelsIn++;

            }

        }

        step += 1.0;
    }


    finalColor /= float(pixelsIn);
    if (pixelsIn == 0) {
        finalColor = texture(image_texture, positions);
    }


    outColor = finalColor;





}