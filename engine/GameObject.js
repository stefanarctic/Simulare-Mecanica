import { Vector2 } from './Vector2.js';

export class GameObject {
    constructor(game, position, options = {}) {
        this.game = game;
        this.position = new Vector2(position.x, position.y);
        this.velocity = new Vector2();
        this.acceleration = new Vector2();
        this.options = options;
        this.body = null;
        this.mass = options.mass || 1;
        this.maxSpeed = options.maxSpeed || Infinity;
        this.maxForce = options.maxForce || Infinity;
        this.angle = options.angle || 0;
        this.texture = options.texture || null;
    }

    update() {
        if (this.body) {
            // Update position and velocity from Matter.js body
            this.position.x = this.body.position.x;
            this.position.y = this.body.position.y;
            this.velocity.x = this.body.velocity.x;
            this.velocity.y = this.body.velocity.y;
            this.angle = this.body.angle;

            // Apply acceleration to velocity
            this.velocity = this.velocity.add(this.acceleration);
            
            // Limit velocity to maxSpeed
            this.velocity = this.velocity.limit(this.maxSpeed);

            // Update Matter.js body with new velocity
            Matter.Body.setVelocity(this.body, {
                x: this.velocity.x,
                y: this.velocity.y
            });

            // Reset acceleration
            this.acceleration = new Vector2();
        }
    }

    setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
        if (this.body) {
            Matter.Body.setPosition(this.body, { x, y });
        }
    }

    setVelocity(x, y) {
        this.velocity.x = x;
        this.velocity.y = y;
        if (this.body) {
            Matter.Body.setVelocity(this.body, { x, y });
        }
    }

    setAngle(angle) {
        this.angle = angle;
        if (this.body) {
            Matter.Body.setAngle(this.body, angle);
        }
    }

    setAcceleration(x, y) {
        this.acceleration.x = x;
        this.acceleration.y = y;
    }

    // Apply a force to the object
    applyForce(force) {
        // F = ma, so a = F/m
        const acceleration = force.divide(this.mass);
        this.acceleration = this.acceleration.add(acceleration);
    }

    // Apply a force towards a target
    seek(target) {
        const desired = new Vector2(
            target.x - this.position.x,
            target.y - this.position.y
        );
        
        // Normalize and scale to maxSpeed
        desired.normalize();
        desired.multiply(this.maxSpeed);
        
        // Calculate steering force
        const steer = desired.subtract(this.velocity);
        steer.limit(this.maxForce);
        
        // Apply the force
        this.applyForce(steer);
    }

    // Apply a force to flee from a target
    flee(target) {
        const desired = new Vector2(
            this.position.x - target.x,
            this.position.y - target.y
        );
        
        // Normalize and scale to maxSpeed
        desired.normalize();
        desired.multiply(this.maxSpeed);
        
        // Calculate steering force
        const steer = desired.subtract(this.velocity);
        steer.limit(this.maxForce);
        
        // Apply the force
        this.applyForce(steer);
    }

    setTexture(texture) {
        this.texture = texture;
        if (this.body) {
            this.body.render.sprite = {
                texture: texture,
                xScale: 1,
                yScale: 1
            };
        }
    }

    destroy() {
        if (this.body) {
            this.game.removeBody(this.body);
            this.body = null;
        }
    }
} 