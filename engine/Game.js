import { Vector2 } from './Vector2.js';
import { Rectangle } from './Rectangle.js';
import { Circle } from './Circle.js';
import { Polygon } from './Polygon.js';
import { Triangle } from './Triangle.js';
import { TextureManager } from './TextureManager.js';

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
        this.textures = new TextureManager();
        this._onloadCallback = null;
        this._resourcesLoaded = false;

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
            this.textures.load(options.textures).then(() => {
                this._resourcesLoaded = true;
                if (this._onloadCallback) this._onloadCallback();
            });
        } else {
            this._resourcesLoaded = true;
        }
    }

    // Load a texture
    loadTexture(name, url) {
        return new Promise((resolve, reject) => {
            if (this.textures.has(name)) {
                resolve(this.textures.get(name));
                return;
            }

            const img = new Image();
            img.onload = () => {
                this.textures.set(name, url);
                resolve(url);
            };
            img.onerror = reject;
            img.src = url;
        });
    }

    // Get a loaded texture
    getTexture(name) {
        return this.textures.get(name);
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
        const promises = Object.entries(textures).map(([name, url]) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    this.textures.set(name, img);
                    resolve();
                };
                img.onerror = reject;
                img.src = url;
            });
        });
        return Promise.all(promises);
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
} 