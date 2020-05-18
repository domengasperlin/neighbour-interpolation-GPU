
import imageProp from './image-size-js'


const resizeCanvas = (gl, canvas, multiplier) => {

    // Check if the canvas is not the same size.
    if (canvas.width  !== imageProp.displayWidth ||
        canvas.height !== imageProp.displayHeight) {

        // Make the canvas the same size
        canvas.width  = imageProp.displayWidth;
        canvas.height = imageProp.displayHeight;
    }
};

export default resizeCanvas;
