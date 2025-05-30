import Phaser from 'phaser'
import MainMenuScene from './scenes/MainMenuScene'
import ConsoleUIScene from './scenes/ConsoleUIScene'


const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 1,
	height: 1,
	scene: [ConsoleUIScene, MainMenuScene],
}

export default new Phaser.Game(config)
