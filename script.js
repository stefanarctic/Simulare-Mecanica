import { Game } from './engine/Game.js';
import { Vector2 } from './engine/Vector2.js';

const texturesObj = {
    basketball: 'res/images/basketball2.png'
};

console.log('Starting game initialization...');

const game = new Game({ textures: texturesObj });

game.onload(() => {
    console.log('Game loaded successfully!');
    console.log('All textures loaded:', game.textures.getLoadedTextures());
    console.log('Basketball texture available:', game.hasTexture('basketball'));
    console.log('Basketball URL:', game.getTextureUrl('basketball'));
    
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

    // All images are now loaded and cached! 
    // We can create the circle with the basketball sprite directly from cache
    const circle = game.createCircle(window.innerWidth / 3, 200, 30, {
        spriteName: 'basketball', // Use the cached texture name
        spriteOptions: {
            autoScale: true // Automatically scale to fit the circle
        },
        render: {
            fillStyle: '#ff9800' // fallback color
        }
    });

    console.log('Circle created with sprite:', circle.getSprite());
    console.log('Circle has sprite:', circle.hasSprite());

    // Alternative way to set sprite after creation
    // const circle2 = game.createCircle(window.innerWidth / 2, 100, 25, {
    //     render: {
    //         fillStyle: '#ff9800'
    //     }
    // });
    // circle2.setSprite('basketball', { autoScale: true });
});