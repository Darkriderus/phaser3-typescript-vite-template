import Phaser from 'phaser'
import EventsCenter from '../classes/EventsCenter'
import { ConsoleEvents } from './ConsoleUIScene'
import GameScene from './GameScene'
import { PlayerData } from '../classes/PlayerData'

export enum MenuKey {
    MAIN_MENU = 'main-menu',
    OPTIONS = 'options'
}

export type MenuOption = {
    label: string
    id: number
    onSelect: () => void
    // isSelectable: () => boolean
    // isVisible: () => boolean
}

export type MenuLocation = {
    label: string
    key: MenuKey
    options: MenuOption[]
}


export default class MenuScene extends Phaser.Scene {
    static readonly KEY = 'menu'

    readonly MENU_LOCATIONS: Record<MenuKey, MenuLocation> = {
        [MenuKey.MAIN_MENU]: {
            label: 'Main Menu',
            key: MenuKey.MAIN_MENU,
            options: [
                {
                    label: 'Start New Game',
                    id: 1,
                    onSelect: () => {
                        PlayerData.create()
                        this.scene.start(GameScene.KEY)
                    }
                },
                {
                    label: 'Load Game',
                    id: 2,
                    onSelect: () => {
                        this.scene.start(GameScene.KEY)
                    }
                },
                {
                    label: 'Options',
                    id: 3,
                    onSelect: () => this.changeMenu(MenuKey.OPTIONS)
                }
            ]
        },
        [MenuKey.OPTIONS]: {
            label: 'Options',
            key: MenuKey.OPTIONS,
            options: [
                {
                    label: 'Back',
                    id: 1,
                    onSelect: () => this.changeMenu(MenuKey.MAIN_MENU)
                }
            ]
        }
    }

    private selectedMenu: MenuKey = MenuKey.MAIN_MENU

    constructor() {
        super(MenuScene.KEY)
    }

    preload() {
    }

    create() {
        const menuOptions = this.MENU_LOCATIONS[this.selectedMenu].options

        EventsCenter.emit(ConsoleEvents.UPDATE_OUTPUT, { locationKey: MenuKey.MAIN_MENU, text: this.MENU_LOCATIONS[MenuKey.MAIN_MENU].label, options: menuOptions });

        // Player Selected a Option
        EventsCenter.on(ConsoleEvents.SELECT_OPTION, (data: { locationKey: MenuKey | undefined, selectedId: number }) => {
            if (this.scene.isActive(MenuScene.KEY) && data.locationKey && (data.locationKey as MenuKey)) {
                console.log(MenuScene.KEY, ConsoleEvents.SELECT_OPTION, { data })
                const menuOptions = this.MENU_LOCATIONS[this.selectedMenu].options
                menuOptions.find((option: MenuOption) => option.id === data.selectedId)!.onSelect();
            }
        });
    }

    changeMenu(menu: MenuKey) {
        const menuOptions = this.MENU_LOCATIONS[menu].options
        EventsCenter.emit(ConsoleEvents.UPDATE_OUTPUT, { locationKey: MenuKey.MAIN_MENU, text: this.MENU_LOCATIONS[menu].label, options: menuOptions });
        this.selectedMenu = menu
    }
}
