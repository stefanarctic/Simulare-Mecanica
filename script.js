import { Game } from './engine/Game.js';
import { Vector2 } from './engine/Vector2.js';

const texturesObj = {
    basketball: 'res/images/basketball2.png'
};

const game = new Game({ textures: texturesObj });

game.onload(() => {
    // Create boxes and ground
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

    // TODO load all images passed in the constructor of the game object, then when it loads and all other engine resources are loaded, call the onload callback
    // TODO texture handling
    
    // Load the basketball image, then create the circle with correct scaling
    const img = new Image();
    img.onload = function() {
        const radius = 30;
        const diameter = radius * 2;
        const xScale = diameter / img.width;
        const yScale = diameter / img.height;
        const circle = game.createCircle(window.innerWidth / 3, 200, radius, {
            render: {
                sprite: {
                    texture: texturesObj.basketball,
                    xScale,
                    yScale
                },
                fillStyle: '#ff9800' // fallback color
            }
        });
    };
    img.src = texturesObj.basketball;
});