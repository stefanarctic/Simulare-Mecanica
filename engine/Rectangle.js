import { GameObject } from './GameObject.js';

export class Rectangle extends GameObject {
    constructor(game, position, width, height, options = {}) {
        super(game, position, options);
        this.width = width;
        this.height = height;
        this.body = game.Bodies.rectangle(position.x, position.y, width, height, options);
        game.Composite.add(game.engine.world, this.body);
    }
} 