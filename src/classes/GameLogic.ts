import { AnsiCode, generateFullHeader } from "../helper/consoleHelper"
import { BuildingType } from "./Building"
import { PlayerData } from "./PlayerData"
import { UnitData } from "./Unit"
import { WorldMap } from "./WorldMap"

export type Option = {
    label: string
    id: string
    onSelect: () => string | void
    isDisabled?: () => boolean
    disabledLabel?: () => string
    isHidden?: () => boolean
}

export type Location = {
    label: string
    key: LocationKey
    header?: () => void
    options: () => Option[]
}

export enum LocationKey {
    MAIN_MENU = 'main-menu',
    OPTIONS = 'options',
    HQ = 'hq',
    ENGINEER_DEPT = 'engineer-dept',
    MAP_ROOM = 'map-room',
    BRIEFING_ROOM = 'briefing-room',
    CONSTRUCTION = 'construction',
    COMM_DEPT = 'comm-dept',
}

export class GameLogic {
    public playerData = new PlayerData();

    readonly LOCATIONS: Record<LocationKey, Location> = {
        [LocationKey.MAIN_MENU]: {
            label: 'Main Menu',
            key: LocationKey.MAIN_MENU,
            options: () => [
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
            options: () => [
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
            options: () => [
                {
                    label: 'Briefing Room',
                    id: `${LocationKey.HQ}-${LocationKey.BRIEFING_ROOM}`,
                    onSelect: () => {
                        this.moveToLocation(LocationKey.BRIEFING_ROOM)
                    }
                },
                {
                    label: 'Engineer Department',
                    id: `${LocationKey.HQ}-${LocationKey.ENGINEER_DEPT}`,
                    onSelect: () => {
                        this.moveToLocation(LocationKey.ENGINEER_DEPT)
                    }
                },
                {
                    label: 'Communications Department',
                    id: `${LocationKey.HQ}-${LocationKey.COMM_DEPT}`,
                    onSelect: () => {
                        this.moveToLocation(LocationKey.COMM_DEPT)
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
            options: () => [
                {
                    label: 'Construction',
                    id: `${LocationKey.ENGINEER_DEPT}-${LocationKey.CONSTRUCTION}`,
                    onSelect: () => {
                        this.moveToLocation(LocationKey.CONSTRUCTION)
                    }
                },
                {
                    label: 'Back to HQ',
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
            options: () => [
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
        [LocationKey.MAP_ROOM]: {
            label: 'Map Room',
            key: LocationKey.MAP_ROOM,
            header: () => {
                WorldMap.generateMap(this.playerData)
            },
            options: () => [
                {
                    label: 'Back to HQ',
                    id: `${LocationKey.MAP_ROOM}-${LocationKey.HQ}`,
                    onSelect: () => {
                        this.moveToLocation(LocationKey.HQ)
                    }
                }
            ]
        },
        [LocationKey.COMM_DEPT]: {
            label: 'Communication Department',
            key: LocationKey.COMM_DEPT,
            options: () => [
                {
                    label: 'Request new Battalion Leader',
                    id: `${LocationKey.COMM_DEPT}-new-leader`,
                    onSelect: () => {

                        const leader = this.playerData.savedGame!.battalions.length + 1 + ".BTL Leader"
                        const name = this.playerData.savedGame!.battalions.length + 1 + ". Battalion"
                        this.createBattalion(leader, name, [
                            {
                                name: "Debug-Platoon",
                                combatScore: 999
                            }
                        ])


                        return AnsiCode.BGGreen + "New Battalion Leader: " + leader + AnsiCode.Reset
                    }
                },
                {
                    label: 'Back to HQ',
                    id: `${LocationKey.COMM_DEPT}-${LocationKey.HQ}`,
                    onSelect: () => {
                        this.moveToLocation(LocationKey.HQ)
                    }
                }
            ]
        },
        [LocationKey.BRIEFING_ROOM]: {
            label: 'Briefing Room',
            key: LocationKey.BRIEFING_ROOM,
            options: () => {
                let options: Option[] =
                    this.playerData.savedGame!.battalions.map((battalion) => {
                        return {
                            label: battalion.name,
                            id: `${LocationKey.BRIEFING_ROOM}-${battalion.name}`,
                            onSelect: () => {
                                this.moveToLocation(LocationKey.BRIEFING_ROOM)
                                return AnsiCode.BGGreen + "Battalion: " + battalion.name + " selected!" + AnsiCode.Reset
                            }
                        }
                    })
                options.push(
                    {
                        label: 'Back to HQ',
                        id: `${LocationKey.BRIEFING_ROOM}-${LocationKey.HQ}`,
                        onSelect: () => {
                            this.moveToLocation(LocationKey.HQ)
                        }
                    }
                )

                return options
            }
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

    createBattalion(leader: string, name: string, units: UnitData[]) {
        this.playerData.savedGame!.battalions.push({ leader, name, units })
        this.playerData.save()
    }
}
