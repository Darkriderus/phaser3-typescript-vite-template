import Phaser from 'phaser'

export default class ConsoleUIScene extends Phaser.Scene {
    static readonly KEY = 'console'

    constructor() {
        super({ key: ConsoleUIScene.KEY, active: true })
    }

    preload() {
    }

    create() {
        const playerInputElement = document.getElementById('console-input') as HTMLTextAreaElement
        const outputElement = document.querySelector('#console-output')!

        playerInputElement.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'Enter' && playerInputElement.value.length > 0) {
                outputElement.innerHTML += '<br/>USR: ' + playerInputElement.value;
                (playerInputElement as HTMLTextAreaElement).value = '';
            }
        });

    }
}
