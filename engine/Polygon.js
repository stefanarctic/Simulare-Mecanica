import { GameObject } from './GameObject.js';

export class Polygon extends GameObject {
    constructor(game, position, sides, radius, options = {}) {
        super(game, position, options);
        this.sides = sides;
        this.radius = radius;
        this.body = game.Bodies.polygon(position.x, position.y, sides, radius, options);
        game.Composite.add(game.engine.world, this.body);
    }
} 