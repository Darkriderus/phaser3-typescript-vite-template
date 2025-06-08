import Phaser from 'phaser'
import MenuScene from './scenes/MenuScene'
import ConsoleUIScene from './scenes/ConsoleUIScene'
import GameScene from './scenes/GameScene'


const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 1,
	height: 1,
	scene: [ConsoleUIScene, MenuScene, GameScene],
}

export default new Phaser.Game(config)
