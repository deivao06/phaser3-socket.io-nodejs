import Game from "../Game.js";

export default class MainScene extends Phaser.Scene {
  constructor () {
    super("main-scene");

    this.cursors = null;
    this.velocity = 100;
  }

  preload() {
    this.load.spritesheet("tileset", "assets/tileset.png", {
      frameWidth: 16,
      frameHeight: 32,
    });
  }

  create() {
    this.socket = io();

    this.gameClass = new Game();

    this.player = {};
    this.otherPlayers = [];

    this.eventHandlers();
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  update() {
    this.handlePlayerInput();
  }

  eventHandlers() {
    this.socket.on('connect', this.onSocketConnected)
    this.socket.on('disconnect', this.onSocketDisconnect)

    this.socket.on('new player', this.onNewPlayer.bind(this))
    this.socket.on('update state', this.onUpdateState.bind(this))
  }

  onSocketConnected() {
    console.log('Connected to socket server');
    this.emit('new player');
  }

  onSocketDisconnect() {
    console.log('Disconnected off socket server');
  }

  onNewPlayer(player) {
    this.player = player;
    this.player.sprite = this.physics.add.sprite(this.player.x, this.player.y, 'tileset');
    this.player.sprite.setCollideWorldBounds(true);
    this.player.sprite.setScale(2);
    
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('tileset', { start: 72, end: 74 }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('tileset', { start: 75, end: 79 }),
      frameRate: 12,
      repeat: -1
    })
  }

  onUpdateState(state) {
    this.gameClass.setState(state);

    this.gameClass.state.players.forEach((player) => {
      if(player.id != this.player.id){
        this.createOtherPlayer(player);
      }
    })

    //removing disconnected players sprite
    if(this.otherPlayers.length > 0){
      this.otherPlayers = this.otherPlayers.filter(x => {
        if(this.gameClass.state.players.includes(x)){
          return true;
        }else{
          x.sprite.destroy();
          return false;
        }
      })
    }
  }

  createOtherPlayer(player) {
    player.sprite = this.physics.add.sprite(player.x, player.y, 'tileset');
    player.sprite.setCollideWorldBounds(true);
    player.sprite.setScale(2);
    player.sprite.tint = 0x4af705;
    
    player.sprite.anims.play('idle');

    this.otherPlayers.push(player);
  }

  handlePlayerInput() {
    var running = false;

    if(Object.keys(this.player).length !== 0){
      if (this.cursors.left.isDown) {
        this.player.sprite.setVelocityX(-this.velocity);
        this.player.sprite.scaleX = -2;

        this.player.sprite.anims.play('run', true)
        running = true
      } else if (this.cursors.right.isDown) {
        this.player.sprite.setVelocityX(this.velocity)
        this.player.sprite.scaleX = 2;

        this.player.sprite.anims.play('run', true)
        running = true
      } else {
        this.player.sprite.setVelocityX(0);
      }

      if (this.cursors.up.isDown){
        this.player.sprite.setVelocityY(-this.velocity)

        this.player.sprite.anims.play('run', true)
        running = true
      } else if (this.cursors.down.isDown) {
        this.player.sprite.setVelocityY(this.velocity)

        this.player.sprite.anims.play('run', true);
        running = true
      } else {
        this.player.sprite.setVelocityY(0);
      }

      if(!running){
        this.player.sprite.anims.play('idle', true);
      }

      this.socket.emit('update player position', {
        x: this.player.sprite.x,
        y: this.player.sprite.y
      })
    }
  }
}
