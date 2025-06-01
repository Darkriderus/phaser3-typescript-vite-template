import Phaser from 'phaser'
import EventsCenter from '../classes/EventsCenter'
import { GameLogic, GameOption } from '../classes/GameLogic'
import { PlayerData } from '../classes/PlayerData'

export default class MainMenuScene extends Phaser.Scene {
    static readonly KEY = 'main-menu'

    constructor() {
        super(MainMenuScene.KEY)
    }

    preload() {
    }

    create() {
        PlayerData.init()

        const menuOptions = GameLogic.LOCATIONS.MAIN_MENU.options
        const selectableOptions = menuOptions.filter((menuItem) => menuItem.selectable())

        EventsCenter.emit('console-output', { text: GameLogic.LOCATIONS.MAIN_MENU.label, options: selectableOptions });

        // Player Selected a Option
        EventsCenter.on('option-selected', (data: { selectedId: number }) => {
            console.log('option-selected', data.selectedId, PlayerData.currentMenu.options, data.selectedId);
            console.log(PlayerData.currentMenu.options.find((option: GameOption) => option.id === data.selectedId))
            PlayerData.currentMenu.options.find((option: GameOption) => option.id === data.selectedId)!.onSelect();
        });
    }
}
