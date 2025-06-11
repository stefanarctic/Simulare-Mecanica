import { GameObject } from './GameObject.js';

export class Triangle extends GameObject {
    constructor(game, position, vertices, size, options = {}) {
        super(game, position, options);
        this.size = size;

        this.vertices = vertices;
        this.body = game.Bodies.fromVertices(position.x, position.y, vertices, size, options);
        // this.body = game.Bodies.polygon(position.x, position.y, 3, size, options);
        game.Composite.add(game.engine.world, this.body);
    }
} 