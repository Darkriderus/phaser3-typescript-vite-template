import EventsCenter from './EventsCenter'
import { PlayerData } from './PlayerData'

export type GameOption = {
    text: string
    id: number
    onSelect: () => void
    selectable: () => boolean
}

export type GameLocation = {
    label: string
    id: number
    options: GameOption[]
}

class OptionFactory {
    static create(
        text: string,
        id: number,
        onSelect: () => void,
        selectable: () => boolean = () => true
    ): GameOption {
        return { text, id, onSelect, selectable }
    }
}

export class GameLogic {
    static readonly LOCATIONS: Record<string, GameLocation> = {
        MAIN_MENU: {
            label: 'Main Menu',
            id: 10,
            options: [
                OptionFactory.create('New Game', 1010, () => {
                    PlayerData.createGame()
                    this.moveToLocation('HOME')
                }),
                OptionFactory.create('Load Game', 1020, () => {
                    console.log('Load Game')
                    this.moveToLocation('HOME')

                }, () => PlayerData.hasSavedGame)
            ]
        },

        HOME: {
            label: 'Homebase',
            id: 20,
            options: [
                OptionFactory.create('Go to the War Room', 2010, () => {
                    this.moveToLocation('WAR_ROOM')
                }),
                OptionFactory.create('Go to the Storage Vaults', 2020, () => {
                    this.moveToLocation('STORAGE')
                })
            ]
        },

        WAR_ROOM: {
            label: 'War Room',
            id: 30,
            options: [
                OptionFactory.create('Go to the Homebase', 3010, () => {
                    this.moveToLocation('HOME')
                }),
                OptionFactory.create('Go to the Storage Vaults', 3020, () => {
                    this.moveToLocation('STORAGE')
                })
            ]
        },

        STORAGE: {
            label: 'Storage Vaults',
            id: 40,
            options: [
                OptionFactory.create('Go to the Homebase', 4010, () => {
                    this.moveToLocation('HOME')
                }),
                OptionFactory.create('Go to the War Room', 4020, () => {
                    this.moveToLocation('WAR_ROOM')
                })
            ]
        }
    }

    static moveToLocation(location: keyof typeof GameLogic.LOCATIONS) {
        console.log('Moving to', GameLogic.LOCATIONS[location].label);
        PlayerData.currentMenu = GameLogic.LOCATIONS[location]
        EventsCenter.emit('console-output', {
            text: GameLogic.LOCATIONS[location].label,
            options: GameLogic.LOCATIONS[location].options
        });
    }
}
