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


    // Pixels inside window area
    int pixelsInArea = 0;
    // Cumulative color
    vec4 finalColor = vec4(0, 0, 0, 0.0);

    // Square window size that can be adjusted according to the size of the image and presence of points
    int windowSize = 5;

    // Mannualy input csize=(2 * windowSize+1)^2 do to limitations of dynamic array
    int csize = 121;
    vec2 locations[121];
    int colorValues[121];

    int index = 0;



    for (int i = -windowSize; i <= windowSize; i++) {
        for (int j = -windowSize; j <= windowSize; j++) {

            vec2 iterFrag = vec2(point.s + float(i)*pixelWidth, point.t + float(j)*pixelHeight);
            vec4 distTextPoint = texture(positions_texture, iterFrag);

            // Out of screen coordinates
            if (iterFrag.s < 0.0 || iterFrag.s >= 1.0 || iterFrag.t < 0.0 || iterFrag.t >= 1.0) continue;
            if (distTextPoint.a != 1.0) continue;

            // Distance between voroiCoord point and iterFrag
            float fragIterToVoroiCoord = (distTextPoint.r-iterFrag.s)*(distTextPoint.r-iterFrag.s) + (distTextPoint.g-iterFrag.t)*(distTextPoint.g-iterFrag.t);

            // Distance between query point and iterFrag
            float queryToIterFrag = (iterFrag.r-point.s)*(iterFrag.r-point.s) + (iterFrag.g-point.t)*(iterFrag.g-point.t);

            // Check the distance if smaller count the pixel in
            if (queryToIterFrag < fragIterToVoroiCoord) {

                vec2 pixelColorLoc = iterFrag.xy;

                bool found = false;
                for (int k = 0; k < csize; k++) {
                    // If such entry already exist
                    if (locations[i] == pixelColorLoc) {
                        // Add stolen area for that location
                        colorValues[i] += 1;
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    // If not add the entry
                    locations[index] = pixelColorLoc;
                    // Add stolen area for that location
                    colorValues[index] += 1;
                    // Pointer to next available location
                    index++;
                }
                pixelsInArea++;

            }

        }

    }

    for (int k = 0; k < csize; k++) {
        // If such color already exist
        float delta = float(colorValues[k])  / float(pixelsInArea);
        finalColor += (delta * texture(image_texture, texture(positions_texture,locations[k].xy).xy));

    }

    outColor = finalColor;
}