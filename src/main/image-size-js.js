
class ImageSize {
     imageWidth = 220;
     imageHeight = 220;

    constructor() {
    }

    getImageWidth() {
        return this.imageWidth
    }

    getImageHeight() {
        return this.imageHeight;
    }

    setImageWidth(width) {
        this.imageWidth = width;
    }

    setImageHeight(height) {
        this.imageHeight = height;
    }

}

let imageSize = new ImageSize();

// imageSize.setImageHeight(300)

var realToCSSPixels = window.devicePixelRatio;

var displayWidth  = imageSize.getImageWidth()*realToCSSPixels  ;
var displayHeight = Math.floor(imageSize.getImageHeight()*realToCSSPixels );

displayWidth = 230;
displayHeight = 230;

//w 512 171
//h 680 = 227

export default {displayWidth,displayHeight}


