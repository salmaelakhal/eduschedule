const { Jimp } = require('jimp');

async function processLogo() {
    try {
        const image = await Jimp.read('/Users/flifla/Dev/PERN/eduschedule/client/public/favicon.png');

        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
            const red = this.bitmap.data[idx + 0];
            const green = this.bitmap.data[idx + 1];
            const blue = this.bitmap.data[idx + 2];

            const lum = 0.299 * red + 0.587 * green + 0.114 * blue;

            let alpha = 255 - lum;
            alpha = Math.max(0, Math.min(255, (alpha - 20) * 1.5));

            this.bitmap.data[idx + 0] = 255;
            this.bitmap.data[idx + 1] = 255;
            this.bitmap.data[idx + 2] = 255;
            this.bitmap.data[idx + 3] = alpha;
        });

        // Auto-crop to remove bounding box 
        image.autocrop();

        await image.writeAsync('/Users/flifla/Dev/PERN/eduschedule/client/public/logo-white.png');
    } catch (err) {
        console.error(err);
    }
}

processLogo();
