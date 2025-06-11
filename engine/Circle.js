import { GameObject } from './GameObject.js';

export class Circle extends GameObject {
    constructor(game, position, radius, options = {}) {
        super(game, position, options);
        this.radius = radius;
        this.body = game.Bodies.circle(position.x, position.y, radius, options);
        game.Composite.add(game.engine.world, this.body);
    }
} 