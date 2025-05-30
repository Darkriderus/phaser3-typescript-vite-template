import Phaser from 'phaser'
import EventsCenter from '../classes/eventsCenter'

export default class MainMenuScene extends Phaser.Scene {
    static readonly KEY = 'main-menu'

    static readonly MENU_ITEMS = [
        {
            text: 'New Game',
            onSelect: (): void => {
                console.log("New Game")
            }
        },
        {
            text: 'Load Game',
            onSelect: (): void => {
                console.log("Load Game")
            }
        }
    ]

    constructor() {
        super(MainMenuScene.KEY)
    }

    preload() {
    }

    create() {
        EventsCenter.emit('console-output', { payload: this.generateMenu() });

        EventsCenter.on('player-input', (data: { payload: string }) => {
            console.log('player-input', data.payload);
            MainMenuScene.MENU_ITEMS[parseInt(data.payload) - 1].onSelect();
        });
    }

    // Helper-Functions

    generateMenu() {
        return MainMenuScene.MENU_ITEMS.map((menuItem, idx) => {
            return "" + (idx + 1) + " - " + menuItem.text
        })
    }


}
