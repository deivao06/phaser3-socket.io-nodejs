export default class SpriteComponent {
    constructor(physics, anims) {
        this.name = 'SpriteComponent';

        this.physics = physics;
        this.anims = anims;
        this.sprite = null;

        this.x = null;
        this.y = null;

        this.animation = null;
    }

    addSprite(x, y , tileset) {
        this.x = x;
        this.y = y;

        this.sprite = this.physics.add.sprite(this.x, this.y, tileset);
    }

    setCollideWorldBounds(bool) {
        this.sprite.setCollideWorldBounds(bool);
    }

    setScale(value) {
        this.sprite.setScale(value);
    }

    setSize(width, height) {
        this.sprite.setSize(width, height);
    }

    setOffset(x, y) {
        this.sprite.setOffset(x, y);
    }

    setTint(tint) {
        this.sprite.tint = tint;
    }

    setPushable(bool) {
        this.sprite.setPushable(bool);
    }

    createAnim({
        name: name, 
        start: start, 
        end: end, 
        frameRate: frameRate, 
        repeat: repeat,
        tileset: tileset
    }) {
        this.anims.create({
            key: name,
            frames: this.anims.generateFrameNumbers(tileset, { start: start, end: end }),
            frameRate: frameRate,
            repeat: repeat
        })
    }

    playAnim(anim, bool = false) {
        this.sprite.anims.play(anim, bool);
        this.animation = anim;
    }
}