import Jimp from 'jimp';

async function processLogo() {
    try {
        const image = await Jimp.read('/Users/flifla/Dev/PERN/eduschedule/client/public/favicon.png');

        // We want to turn this flat white/blue logo into a pure white shape with alpha transparency
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
            const red = this.bitmap.data[idx + 0];
            const green = this.bitmap.data[idx + 1];
            const blue = this.bitmap.data[idx + 2];

            // Calculate luminance (0 = black, 255 = white)
            const lum = 0.299 * red + 0.587 * green + 0.114 * blue;

            // Convert luminance to alpha (white bg = transparent, dark logo = opaque)
            // We invert it: 255 - lum. 
            // We scale it so anything slightly off-white becomes fully transparent, and darks become solid.
            let alpha = 255 - lum;
            // Boost contrast of the alpha channel to make the edges sharp and remove weak halos
            alpha = Math.max(0, Math.min(255, (alpha - 20) * 1.5));

            // Set the color to pure white, using the computed alpha for smooth edges
            this.bitmap.data[idx + 0] = 255;
            this.bitmap.data[idx + 1] = 255;
            this.bitmap.data[idx + 2] = 255;
            this.bitmap.data[idx + 3] = alpha;
        });

        // Auto-crop any surrounding fully transparent pixels
        image.autocrop();

        await image.writeAsync('/Users/flifla/Dev/PERN/eduschedule/client/public/logo-white.png');
        console.log("SUCCESS: Logo processed and saved to logo-white.png");
    } catch (error) {
        console.error("ERROR processig logo: ", error);
    }
}

processLogo();
