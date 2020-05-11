const resizeCanvas = (canvas, multiplier) => {
    var cssToRealPixels = window.devicePixelRatio || 1;

    // Lookup the size the browser is displaying the canvas in CSS pixels
    // and compute a size needed to make our drawingbuffer match it in
    // device pixels.
    var displayWidth = Math.floor(canvas.clientWidth * cssToRealPixels);
    var displayHeight = Math.floor(canvas.clientHeight * cssToRealPixels);

    // Check if the canvas is not the same size.

    if (canvas.width !== displayWidth ||
        canvas.height !== displayHeight) {


    }
    // Make the canvas fixed size
    canvas.width = 220;
    canvas.height = 220;
};

export default resizeCanvas;
