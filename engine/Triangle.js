import { GameObject } from './GameObject.js';

export class Triangle extends GameObject {
    constructor(game, position, vertices, size, options = {}) {
        super(game, position, options);
        this.vertices = vertices;
        this.size = size;
        this.body = game.Bodies.fromVertices(position.x, position.y, [vertices], options);
        game.Composite.add(game.engine.world, this.body);

        // Set up sprite if provided
        if (options.spriteName) {
            this.setSprite(options.spriteName, options.spriteOptions);
        }
    }
} 