import MainScene from './scenes/MainScene.js';

const config = {
	type: Phaser.AUTO,
	width: 300,
	height: 300,
	physics: {
		default: 'arcade',
		arcade: {
			debug: true,
			gravity: { y: 0 }
		}
	},
	pixelArt: true,
	scene: [MainScene]
}

export default new Phaser.Game(config)