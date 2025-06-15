import { generateFullHeader } from "../helper/consoleHelper"
import { BuildingType } from "./Building"
import { PlayerData } from "./PlayerData"
import { WorldMap } from "./WorldMap"

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
    HQ = 'hq',
    ENGINEER_DEPT = 'engineer-dept',
    STORAGE = 'storage',
    MAP_ROOM = 'map-room',
    CONSTRUCTION = 'construction'
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
        [LocationKey.HQ]: {
            label: 'Headquarters',
            key: LocationKey.HQ,
            header: () => {
                generateFullHeader(this.playerData)
            },
            options: [
                {
                    label: 'Engineer Department',
                    id: `${LocationKey.HQ}-${LocationKey.ENGINEER_DEPT}`,
                    onSelect: () => {
                        this.moveToLocation(LocationKey.ENGINEER_DEPT)
                    }
                },
                {
                    label: 'Storage',
                    id: `${LocationKey.HQ}-${LocationKey.STORAGE}`,
                    onSelect: () => {
                        this.moveToLocation(LocationKey.STORAGE)
                    }
                },
                {
                    label: 'Map Room',
                    id: `${LocationKey.HQ}-${LocationKey.MAP_ROOM}`,
                    onSelect: () => {
                        this.moveToLocation(LocationKey.MAP_ROOM)
                    }
                }
            ]
        },
        [LocationKey.ENGINEER_DEPT]: {
            label: 'Engineering Department',
            key: LocationKey.ENGINEER_DEPT,
            options: [
                {
                    label: 'Construction',
                    id: `${LocationKey.ENGINEER_DEPT}-${LocationKey.CONSTRUCTION}`,
                    onSelect: () => {
                        this.moveToLocation(LocationKey.CONSTRUCTION)
                    }
                },
                {
                    label: 'Headquarters',
                    id: `${LocationKey.ENGINEER_DEPT}-${LocationKey.HQ}`,
                    onSelect: () => {
                        this.moveToLocation(LocationKey.HQ)
                    }
                }
            ]
        },
        [LocationKey.CONSTRUCTION]: {
            label: 'Construction',
            key: LocationKey.CONSTRUCTION,
            options: [
                {
                    label: 'Build Mining Camps',
                    id: `${LocationKey.CONSTRUCTION}-${BuildingType.MINING_CAMP}`,
                    onSelect: () => {
                        this.constructBuilding(BuildingType.MINING_CAMP)
                    },
                    isDisabled: () => this.playerData.savedGame!.buildings.find((building) => building === BuildingType.MINING_CAMP) !== undefined,
                    disabledLabel: () => "Mining Camp already built"
                },
                {
                    label: 'Back to Headquarters',
                    id: `${LocationKey.CONSTRUCTION}-${LocationKey.HQ}`,
                    onSelect: () => {
                        this.moveToLocation(LocationKey.HQ)
                    }
                }
            ]
        },
        [LocationKey.STORAGE]: {
            label: 'Storage',
            key: LocationKey.STORAGE,
            options: [
                {
                    label: 'Headquarters',
                    id: `${LocationKey.STORAGE}-${LocationKey.HQ}`,
                    onSelect: () => {
                        this.moveToLocation(LocationKey.HQ)

                    }
                }
            ]
        },
        [LocationKey.MAP_ROOM]: {
            label: 'Map Room',
            key: LocationKey.MAP_ROOM,
            header: () => {
                WorldMap.generateMap(this.playerData)
            },
            options: [
                {
                    label: 'Headquarters',
                    id: `${LocationKey.MAP_ROOM}-${LocationKey.HQ}`,
                    onSelect: () => {
                        this.moveToLocation(LocationKey.HQ)

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

    constructBuilding(building: BuildingType) {
        const buildingIndex = this.playerData.savedGame!.buildings.indexOf(null)
        if (buildingIndex !== -1) {
            this.playerData.savedGame!.buildings[buildingIndex] = building
            this.playerData.save()
        }
    }
}
