import Phaser from 'phaser'
import EventsCenter from '../classes/eventsCenter'
import MainMenuScene from './MainMenuScene'

export default class ConsoleUIScene extends Phaser.Scene {
    static readonly KEY = 'console'

    constructor() {
        super({ key: ConsoleUIScene.KEY, active: true })
    }

    preload() {
    }

    create() {
        const playerInputElement = document.getElementById('console-input') as HTMLTextAreaElement
        const consoleOutputElement = document.getElementById('console-output') as HTMLPreElement

        playerInputElement.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'Enter' && playerInputElement.value.length > 0) {
                const playerInput = playerInputElement.value;
                playerInputElement.value = '';
                EventsCenter.emit('player-input', { payload: playerInput });
            }
        });

        EventsCenter.on('console-output', (data: { payload: string[] }) => {
            console.log('console-output', data.payload);
            consoleOutputElement.innerHTML = data.payload.join('<br>');
        });

        this.game.scene.start(MainMenuScene.KEY);
    }
}
