import { generateFullHeader } from "../helper/consoleHelper"
import { PlayerData } from "./PlayerData"

export type Option = {
    label: string
    id: string
    onSelect: () => void
    isDisabled?: () => boolean
    disabledLabel?: () => string
    isVisible?: () => boolean
}

export type Location = {
    label: string
    key: LocationKey
    header?: () => void
    options: Option[]
}

export enum LocationKey {
    MAIN_MENU = 'main-menu',
    OPTIONS = 'options',
    HOMEBASE = 'homebase',
    STORAGE = 'storage',
    MAP_ROOM = 'map-room'
}

export class GameLogic {
    public playerData = new PlayerData();

    readonly LOCATIONS: Record<LocationKey, Location> = {
        [LocationKey.MAIN_MENU]: {
            label: 'Main Menu',
            key: LocationKey.MAIN_MENU,
            options: [
                {
                    label: 'Start New Game',
                    id: `${LocationKey.MAIN_MENU}-new`,
                    onSelect: () => {
                        this.playerData.createNew()
                        this.moveToLocation(this.playerData.savedGame!.currentLocation)
                    }
                },
                {
                    label: 'Load Game',
                    id: `${LocationKey.MAIN_MENU}-load`,
                    onSelect: () => {
                        this.playerData.load()
                        this.moveToLocation(this.playerData.savedGame!.currentLocation)
                    },
                    isDisabled: () => !this.playerData.hasSavedGame(),
                    disabledLabel: () => "No saved game found!"

                },
                {
                    label: 'Options',
                    id: `${LocationKey.MAIN_MENU}-options`,
                    onSelect: () => {
                        console.log("Options")

                    }
                },
                {
                    label: 'Exit',
                    id: `${LocationKey.MAIN_MENU}-exit`,
                    onSelect: () => {
                        console.log("Exit")
                    }
                }
            ]
        },
        [LocationKey.OPTIONS]: {
            label: 'Options',
            key: LocationKey.OPTIONS,
            options: [
                {
                    label: 'Back',
                    id: `${LocationKey.OPTIONS}-${LocationKey.MAIN_MENU}`,
                    onSelect: () => {
                        console.log("Back")
                    }
                }
            ]
        },
        [LocationKey.HOMEBASE]: {
            label: 'Homebase',
            key: LocationKey.HOMEBASE,
            header: () => {
                generateFullHeader(this.playerData)
            },
            options: [
                {
                    label: 'Storage',
                    id: `${LocationKey.HOMEBASE}-${LocationKey.STORAGE}`,
                    onSelect: () => {
                        this.moveToLocation(LocationKey.STORAGE)
                    }
                },
                {
                    label: 'Map Room',
                    id: `${LocationKey.HOMEBASE}-${LocationKey.MAP_ROOM}`,
                    onSelect: () => {
                        this.moveToLocation(LocationKey.MAP_ROOM)
                    }
                }
            ]
        },
        [LocationKey.STORAGE]: {
            label: 'Storage',
            key: LocationKey.STORAGE,
            options: [
                {
                    label: 'Homebase',
                    id: `${LocationKey.STORAGE}-${LocationKey.HOMEBASE}`,
                    onSelect: () => {
                        this.moveToLocation(LocationKey.HOMEBASE)

                    }
                }
            ]
        },
        [LocationKey.MAP_ROOM]: {
            label: 'Map Room',
            key: LocationKey.MAP_ROOM,
            options: [
                {
                    label: 'Homebase',
                    id: `${LocationKey.MAP_ROOM}-${LocationKey.HOMEBASE}`,
                    onSelect: () => {
                        this.moveToLocation(LocationKey.HOMEBASE)

                    }
                }
            ]
        }
    }

    constructor() {

    }

    moveToLocation(currentLocation: LocationKey) {
        this.playerData.savedGame!.currentLocation = currentLocation
        this.playerData.save()
    }
}
