export class Textures {
    constructor() {
        this.images = new Map(); // Store HTMLImageElement
        this.urls = new Map();   // Store URL strings
        this.loadingPromises = new Map();
        this.isLoading = false;
    }

    /**
     * Load all textures from an object { name: url, ... }
     * @param {Object} textures
     * @returns {Promise}
     */
    load(textures) {
        this.isLoading = true;
        const promises = Object.entries(textures).map(([name, url]) => {
            return this.loadSingle(name, url);
        });
        
        return Promise.all(promises).finally(() => {
            this.isLoading = false;
        });
    }

    /**
     * Load a single texture
     * @param {string} name
     * @param {string} url
     * @returns {Promise}
     */
    loadSingle(name, url) {
        // If already loaded, return the existing image
        if (this.images.has(name)) {
            return Promise.resolve(this.images.get(name));
        }

        // If already loading, return the existing promise
        if (this.loadingPromises.has(name)) {
            return this.loadingPromises.get(name);
        }

        console.log(`Loading texture: ${name} from ${url}`);

        const promise = new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                console.log(`Successfully loaded texture: ${name}`);
                this.images.set(name, img);
                this.urls.set(name, url);
                this.loadingPromises.delete(name);
                resolve(img);
            };
            img.onerror = (error) => {
                console.error(`Failed to load texture '${name}' from '${url}':`, error);
                this.loadingPromises.delete(name);
                reject(new Error(`Failed to load texture '${name}' from '${url}': ${error}`));
            };
            img.src = url;
        });

        this.loadingPromises.set(name, promise);
        return promise;
    }

    /**
     * Get a loaded image by name
     * @param {string} name
     * @returns {HTMLImageElement|null}
     */
    get(name) {
        return this.images.get(name) || null;
    }

    /**
     * Get the URL for a texture by name
     * @param {string} name
     * @returns {string|null}
     */
    getUrl(name) {
        return this.urls.get(name) || null;
    }

    /**
     * Check if a texture is loaded
     * @param {string} name
     * @returns {boolean}
     */
    has(name) {
        return this.images.has(name);
    }

    /**
     * Check if a texture is currently loading
     * @param {string} name
     * @returns {boolean}
     */
    isLoading(name) {
        return this.loadingPromises.has(name);
    }

    /**
     * Get all loaded texture names
     * @returns {string[]}
     */
    getLoadedTextures() {
        return Array.from(this.images.keys());
    }

    /**
     * Clear all textures from cache
     */
    clear() {
        this.images.clear();
        this.urls.clear();
        this.loadingPromises.clear();
    }
} 