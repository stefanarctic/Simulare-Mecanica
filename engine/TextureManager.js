
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
} 