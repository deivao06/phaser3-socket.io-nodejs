export default class InputHandlerComponent {
    constructor(player, cursors, socket) {
        this.name = 'InputHandlerComponent';
        this.player = player;
        this.cursors = cursors;
        this.socket = socket;

        this.velocity = 100;
    }

    handleInput() {
        var running = false;

        if (this.cursors.left.isDown) {
            this.player.components.SpriteComponent.sprite.setVelocityX(-this.velocity);
            this.player.components.SpriteComponent.sprite.setFlipX(true);
    
            this.player.components.SpriteComponent.playAnim('run', true)
            running = true
        } else if (this.cursors.right.isDown) {
            this.player.components.SpriteComponent.sprite.setVelocityX(this.velocity)
            this.player.components.SpriteComponent.sprite.setFlipX(false);
    
            this.player.components.SpriteComponent.playAnim('run', true)
            running = true
        } else {
            this.player.components.SpriteComponent.sprite.setVelocityX(0);
        }
    
        if (this.cursors.up.isDown){
            this.player.components.SpriteComponent.sprite.setVelocityY(-this.velocity)
    
            this.player.components.SpriteComponent.playAnim('run', true)
            running = true
        } else if (this.cursors.down.isDown) {
            this.player.components.SpriteComponent.sprite.setVelocityY(this.velocity)
    
            this.player.components.SpriteComponent.playAnim('run', true);
            running = true
        } else {
            this.player.components.SpriteComponent.sprite.setVelocityY(0);
        }
    
        if(!running){
            this.player.components.SpriteComponent.playAnim('idle', true);   
        }
        
        this.socket.emit('update player position', {
            x: this.player.components.SpriteComponent.sprite.x,
            y: this.player.components.SpriteComponent.sprite.y,
            animation: this.player.components.SpriteComponent.animation
        })

        return this.player;
    }
}