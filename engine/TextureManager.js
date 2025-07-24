
export class TextureManager {
    constructor() {
        this.images = new Map();
    }

    /**
     * Load all textures from an object { name: url, ... }
     * @param {Object} textures
     * @returns {Promise}
     */
    load(textures) {
        const promises = Object.entries(textures).map(([name, url]) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    this.images.set(name, img);
                    resolve();
                };
                img.onerror = reject;
                img.src = url;
            });
        });
        return Promise.all(promises);
    }

    /**
     * Get a loaded image by name
     * @param {string} name
     * @returns {HTMLImageElement}
     */
    get(name) {
        return this.images.get(name);
    }

    /**
     * Check if a texture exists by name
     * @param {string} name
     * @returns {boolean}
     */
    has(name) {
        return this.images.has(name);
    }

    /**
     * Set a texture by name
     * @param {string} name
     * @param {HTMLImageElement|string} image
     */
    set(name, image) {
        this.images.set(name, image);
    }

    /**
     * Get scale factors to fit a texture to a given width and height
     * @param {string} name - The texture name
     * @param {number} width - Target width
     * @param {number} height - Target height
     * @returns {{xScale: number, yScale: number}|null}
     */
    getScale(name, width, height) {
        const img = this.get(name);
        if (!img) return null;
        return {
            xScale: width / img.width,
            yScale: height / img.height
        };
    }

    /**
     * Create a tiled texture as a data URL, repeating the image to fill the given width and height
     * @param {string} name - The texture name (must be loaded)
     * @param {number} width - Output width
     * @param {number} height - Output height
     * @returns {string|null} - Data URL of the tiled texture, or null if not found
     */
    createTiledTexture(name, width, height) {
        const img = this.get(name);
        if (!img) return null;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        const pattern = ctx.createPattern(img, 'repeat');
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, width, height);
        return canvas.toDataURL();
    }
} 