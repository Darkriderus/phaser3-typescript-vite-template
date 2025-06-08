import { ConsoleEvents } from '../scenes/ConsoleUIScene'
import EventsCenter from './EventsCenter'
import { PlayerData } from './PlayerData'

export enum LocationKey {
    HOMEBASE = 'homebase',
    STORAGE = 'storage',
    MAP_ROOM = 'map-room'
}

export type GameOption = {
    label: string
    id: number
    onSelect: () => void
    // isSelectable: () => boolean
    // isVisible: () => boolean
}

export type GameLocation = {
    label: string
    key: LocationKey
    options: GameOption[]
}

export class GameLogic {
    readonly ALL_LOCATIONS: Record<LocationKey, GameLocation> = {
        [LocationKey.HOMEBASE]: {
            label: 'Homebase',
            key: LocationKey.HOMEBASE,
            options: [
                {
                    label: 'Storage',
                    id: 1,
                    onSelect: () => this.moveToLocation(LocationKey.STORAGE)
                },
                {
                    label: 'Map Room',
                    id: 2,
                    onSelect: () => this.moveToLocation(LocationKey.MAP_ROOM)
                }
            ]
        },
        [LocationKey.STORAGE]: {
            label: 'Storage',
            key: LocationKey.STORAGE,
            options: [
                {
                    label: 'Homebase',
                    id: 1,
                    onSelect: () => this.moveToLocation(LocationKey.HOMEBASE)
                }
            ]
        },
        [LocationKey.MAP_ROOM]: {
            label: 'Map Room',
            key: LocationKey.MAP_ROOM,
            options: [
                {
                    label: 'Homebase',
                    id: 1,
                    onSelect: () => this.moveToLocation(LocationKey.HOMEBASE)
                }
            ]
        }
    }

    constructor() {
        const currentLocation = PlayerData.currentLocation
        this.moveToLocation(currentLocation)
    }

    public get playerData() { return PlayerData }

    moveToLocation(location: LocationKey) {
        PlayerData.currentLocation = location
        EventsCenter.emit(ConsoleEvents.UPDATE_OUTPUT, {
            text: this.ALL_LOCATIONS[location].label,
            options: this.ALL_LOCATIONS[location].options,
            locationKey: location
        });
    }
}
