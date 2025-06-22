import { Vector2 } from './Vector2.js';
import { Rectangle } from './Rectangle.js';
import { Circle } from './Circle.js';
import { Polygon } from './Polygon.js';
import { Triangle } from './Triangle.js';
import { Textures } from './Textures.js';

export class Game {
    constructor(options = {}) {
        // Initialize Matter.js modules
        this.Engine = Matter.Engine;
        this.Render = Matter.Render;
        this.Runner = Matter.Runner;
        this.Bodies = Matter.Bodies;
        this.Composite = Matter.Composite;
        this.Body = Matter.Body;

        // Create engine and renderer
        this.engine = this.Engine.create();
        this.render = this.Render.create({
            element: document.body,
            engine: this.engine,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
                wireframes: false,
            }
        });

        // Create runner
        this.runner = this.Runner.create();

        // Array to store all game objects
        this.gameObjects = [];

        // Texture system
        this.textures = new Textures();
        this._onloadCallback = null;
        this._resourcesLoaded = false;
        this._loadingPromise = null;

        // Start the engine and renderer
        this.Runner.run(this.runner, this.engine);
        this.Render.run(this.render);

        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());

        // Add update loop
        this.Engine.run(this.engine);
        Matter.Events.on(this.engine, 'beforeUpdate', () => this.update());

        // If textures are provided, load them
        if (options.textures) {
            this._loadingPromise = this.textures.load(options.textures);
            this._loadingPromise.then(() => {
                this._resourcesLoaded = true;
                if (this._onloadCallback) this._onloadCallback();
            }).catch((error) => {
                console.error('Failed to load textures:', error);
                this._resourcesLoaded = true;
                if (this._onloadCallback) this._onloadCallback();
            });
        } else {
            this._resourcesLoaded = true;
        }
    }

    // Load a texture
    loadTexture(name, url) {
        return this.textures.loadSingle(name, url);
    }

    // Get a loaded texture
    getTexture(name) {
        return this.textures.get(name);
    }

    // Get a texture URL
    getTextureUrl(name) {
        return this.textures.getUrl(name);
    }

    // Check if a texture is loaded
    hasTexture(name) {
        return this.textures.has(name);
    }

    // Create a new rectangle
    createRectangle(x, y, width, height, options = {}) {
        const rect = new Rectangle(this, new Vector2(x, y), width, height, options);
        this.gameObjects.push(rect);
        return rect;
    }

    // Create a new circle
    createCircle(x, y, radius, options = {}) {
        const circle = new Circle(this, new Vector2(x, y), radius, options);
        this.gameObjects.push(circle);
        return circle;
    }

    // Create a new polygon
    createPolygon(x, y, sides, radius, options = {}) {
        const polygon = new Polygon(this, new Vector2(x, y), sides, radius, options);
        this.gameObjects.push(polygon);
        return polygon;
    }

    // Create a new triangle
    createTriangle(x, y, vertices, size, options = {}) {
        const triangle = new Triangle(this, new Vector2(x, y), vertices, size, options);
        this.gameObjects.push(triangle);
        return triangle;
    }

    // Create a slope
    createSlope(x, y, height, angle, options = {}) {

        // ABC triangle
        // Angles
        const b = 90;
        const c = angle;
        const a = 180 - b - c;

        // Sides
        const ab = height;
        const tgc = Math.tan(this.degreesToRadians(c));
        const bc = Math.pow(tgc, -1) * ab;

        return this.createTriangle(x, y, [
            { x: x, y: y },
            { x: x, y: y - ab },
            { x: x + bc, y: y }
        ], options);

        // return this.createTriangle(x, y, [
        //     { x: -size / 2, y: size / 2 },
        //     { x: size / 2, y: size / 2 },
        //     { x: -size / 2, y: -size / 2 }
        // ], options);
    }

    // createTriangle(x, y, size, options = {}) {
    //     const triangle = new Triangle(this, new Vector2(x, y), size, options);
    //     this.gameObjects.push(triangle);
    //     return triangle;
    // }

    // Remove a game object
    removeGameObject(gameObject) {
        const index = this.gameObjects.indexOf(gameObject);
        if (index !== -1) {
            this.gameObjects.splice(index, 1);
            gameObject.destroy();
        }
    }

    // Update all game objects
    update() {
        for (const gameObject of this.gameObjects) {
            gameObject.update();
        }
    }

    // Handle window resize
    handleResize() {
        this.render.options.width = window.innerWidth;
        this.render.options.height = window.innerHeight;
        this.render.canvas.width = window.innerWidth;
        this.render.canvas.height = window.innerHeight;
    }

    // Pause the simulation
    pause() {
        this.Runner.stop(this.runner);
    }

    // Resume the simulation
    resume() {
        this.Runner.run(this.runner, this.engine);
    }

    // Clear all game objects
    clear() {
        for (const gameObject of this.gameObjects) {
            gameObject.destroy();
        }
        this.gameObjects = [];
        this.Composite.clear(this.engine.world);
    }

    degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
    
    radiansToDegrees(radians) {
        return radians * (180 / Math.PI);
    }

    /**
     * Preload multiple textures at once.
     * @param {Object} textures - { name: url, ... }
     * @returns {Promise}
     */
    preloadTextures(textures) {
        return this.textures.load(textures);
    }

    /**
     * Set a sprite on a game object using a texture name from cache.
     * @param {GameObject} gameObject
     * @param {string} textureName - The texture name from cache
     * @param {Object} options - Sprite options like xScale, yScale
     */
    setSprite(gameObject, textureName, options = {}) {
        const image = this.textures.get(textureName);
        const url = this.textures.getUrl(textureName);
        
        if (!image || !url) {
            console.warn(`Texture '${textureName}' not found in cache`);
            return;
        }

        const spriteOptions = {
            texture: url, // Use URL for Matter.js
            xScale: options.xScale || 1,
            yScale: options.yScale || 1
        };

        if (!gameObject.body.render) gameObject.body.render = {};
        gameObject.body.render.sprite = spriteOptions;
    }

    /**
     * Set a sprite on a game object with automatic scaling based on object size.
     * @param {GameObject} gameObject
     * @param {string} textureName - The texture name from cache
     * @param {Object} options - Additional options
     */
    setSpriteWithAutoScale(gameObject, textureName, options = {}) {
        const image = this.textures.get(textureName);
        const url = this.textures.getUrl(textureName);
        
        if (!image || !url) {
            console.warn(`Texture '${textureName}' not found in cache`);
            return;
        }

        let xScale = 1, yScale = 1;

        // Auto-scale based on object type
        if (gameObject.radius) {
            // Circle - scale to fit diameter
            const diameter = gameObject.radius * 2;
            xScale = diameter / image.width;
            yScale = diameter / image.height;
        } else if (gameObject.width && gameObject.height) {
            // Rectangle - scale to fit dimensions
            xScale = gameObject.width / image.width;
            yScale = gameObject.height / image.height;
        }

        // Apply custom scaling if provided
        if (options.xScale !== undefined) xScale = options.xScale;
        if (options.yScale !== undefined) yScale = options.yScale;

        this.setSprite(gameObject, textureName, { xScale, yScale });
    }

    /**
     * Set a texture on a game object with automatic scaling.
     * @param {GameObject} gameObject
     * @param {string} url - The image URL
     */
    setTexture(gameObject, url) {
        if (!url) return;
        const img = new window.Image();
        img.onload = () => {
            const diameter = gameObject.radius * 2;
            const xScale = diameter / img.width;
            const yScale = diameter / img.height;
            if (!gameObject.body.render) gameObject.body.render = {};
            gameObject.body.render.sprite = {
                texture: url,
                xScale,
                yScale
            };
        };
        img.src = url;
    }

    /**
     * Register a callback to be called when the engine and resources are ready.
     * @param {Function} callback
     */
    onload(callback) {
        this._onloadCallback = callback;
        if (this._resourcesLoaded && typeof callback === 'function') {
            callback();
        }
    }

    /**
     * Wait for all resources to be loaded
     * @returns {Promise}
     */
    waitForResources() {
        if (this._resourcesLoaded) {
            return Promise.resolve();
        }
        return this._loadingPromise || Promise.resolve();
    }
} 