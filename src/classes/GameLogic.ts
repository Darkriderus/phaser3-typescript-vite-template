import { AnsiCode, generateFullHeader } from "../helper/consoleHelper"
import { BuildingType } from "./Building"
import { PlayerData } from "./PlayerData"
import { UnitData } from "./Unit"

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
    CONSTRUCTION_CENTER = 'construction-center',
    COMMAND_CENTER = 'command-center',
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
                    label: `${LocationKey.COMMAND_CENTER}`,
                    id: `${LocationKey.HQ}-${LocationKey.COMMAND_CENTER}`,
                    onSelect: () => {
                        this.moveToLocation(LocationKey.COMMAND_CENTER)
                    }
                },
                {
                    label: `${LocationKey.CONSTRUCTION_CENTER}`,
                    id: `${LocationKey.HQ}-${LocationKey.CONSTRUCTION_CENTER}`,
                    onSelect: () => {
                        this.moveToLocation(LocationKey.CONSTRUCTION_CENTER)
                    }
                },
            ]
        },
        [LocationKey.CONSTRUCTION_CENTER]: {
            label: 'Construction',
            key: LocationKey.CONSTRUCTION_CENTER,
            options: () => {
                const buildingOptions = Object.values(BuildingType).map((buildingType: BuildingType) => ({
                    label: 'Build ' + buildingType,
                    id: `${LocationKey.CONSTRUCTION_CENTER}-${buildingType}`,
                    onSelect: () => {
                        this.constructBuilding(buildingType)
                    },
                    isDisabled: () => this.playerData.savedGame!.buildings.find((building) => building === buildingType) !== undefined,
                    disabledLabel: () => buildingType + " already built"
                }))
                return [
                    ...buildingOptions,
                    {
                        label: 'Back to Headquarters',
                        id: `${LocationKey.CONSTRUCTION_CENTER}-${LocationKey.HQ}`,
                        onSelect: () => {
                            this.moveToLocation(LocationKey.HQ)
                        }
                    }
                ]
            }
        },
        [LocationKey.COMMAND_CENTER]: {
            label: 'Command Center',
            key: LocationKey.COMMAND_CENTER,
            options: () => {
                let options: Option[] =
                    this.playerData.savedGame!.battalions.map((battalion) => {
                        return {
                            label: battalion.name,
                            id: `${LocationKey.COMMAND_CENTER}-${battalion.name}`,
                            onSelect: () => {
                                this.moveToLocation(LocationKey.COMMAND_CENTER)
                                return AnsiCode.BGGreen + "Battalion: " + battalion.name + " selected!" + AnsiCode.Reset
                            }
                        }
                    })

                return [
                    ...options,
                    {
                        label: 'Request new Leader',
                        id: `${LocationKey.COMMAND_CENTER}-new-leader`,
                        onSelect: () => {

                            const leader = this.playerData.savedGame!.battalions.length + 1 + ". Leader"
                            const name = this.playerData.savedGame!.battalions.length + 1 + ". Battalion"
                            this.createBattalion(leader, name, [
                                {
                                    name: "Debug-Platoon",
                                    combatScore: 999
                                }
                            ])


                            return AnsiCode.BGGreen + "New Leader: " + leader + AnsiCode.Reset
                        }
                    },
                    {
                        label: 'Back to HQ',
                        id: `${LocationKey.COMMAND_CENTER}-${LocationKey.HQ}`,
                        onSelect: () => {
                            this.moveToLocation(LocationKey.HQ)
                        }
                    }
                ]
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
