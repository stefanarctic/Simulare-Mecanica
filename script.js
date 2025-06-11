import { Game } from './engine/Game.js';
import { Vector2 } from './engine/Vector2.js';

// Create game instance
const game = new Game();

// Create boxes and ground
// const boxA = game.createRectangle(700, 200, 80, 80);
// const boxB = game.createRectangle(750, 50, 80, 80);
const ground = game.createRectangle(window.innerWidth / 2, window.innerHeight - 30, window.innerWidth, 60, { 
    isStatic: true,
    render: {
        fillStyle: '#34495e'  // Dark blue-gray
    }
});

// Create a slope
const slope = game.createSlope(window.innerWidth / 2.5, window.innerHeight - 200, 420, 30, {
    isStatic: true,
    render: {
        fillStyle: '#e74c3c'
    }
});

// Create the box
const boxA = game.createRectangle(500, 200, 80, 80, {
    angle: -Math.PI / 4
});

// Create the circle
// const circle = game.createCircle(500, 200, 30, 50);