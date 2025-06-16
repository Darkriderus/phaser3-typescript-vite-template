import { AnsiCode, generateFullHeader } from "../helper/consoleHelper"
import { translate } from "../helper/translationHelper"
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
            label: translate(LocationKey.MAIN_MENU),
            key: LocationKey.MAIN_MENU,
            options: () => [
                {
                    label: translate(`${LocationKey.MAIN_MENU}-new`),
                    id: `${LocationKey.MAIN_MENU}-new`,
                    onSelect: () => {
                        this.playerData.createNew()
                        this.moveToLocation(this.playerData.savedGame!.currentLocation)
                    }
                },
                {
                    label: translate(`${LocationKey.MAIN_MENU}-load`),
                    id: `${LocationKey.MAIN_MENU}-load`,
                    onSelect: () => {
                        this.playerData.load()
                        this.moveToLocation(this.playerData.savedGame!.currentLocation)
                    },
                    isDisabled: () => !this.playerData.hasSavedGame(),
                    disabledLabel: () => translate(`${LocationKey.MAIN_MENU}-load-error-nogamefound`)

                },
                {
                    label: translate(`${LocationKey.MAIN_MENU}-options`),
                    id: `${LocationKey.MAIN_MENU}-options`,
                    onSelect: () => {
                        console.log(`${LocationKey.MAIN_MENU}-options`)
                    }
                },
                {
                    label: translate(`${LocationKey.MAIN_MENU}-quit`),
                    id: `${LocationKey.MAIN_MENU}-quit`,
                    onSelect: () => {
                        console.log(`${LocationKey.MAIN_MENU}-quit`)
                    }
                }
            ]
        },
        [LocationKey.OPTIONS]: {
            label: translate(LocationKey.OPTIONS),
            key: LocationKey.OPTIONS,
            options: () => [
                {
                    label: translate(`${LocationKey.OPTIONS}-${LocationKey.MAIN_MENU}`),
                    id: `${LocationKey.OPTIONS}-${LocationKey.MAIN_MENU}`,
                    onSelect: () => {
                        console.log("Back")
                    }
                }
            ]
        },
        [LocationKey.HQ]: {
            label: translate(LocationKey.HQ),
            key: LocationKey.HQ,
            header: () => {
                generateFullHeader(this.playerData)
            },
            options: () => [
                {
                    label: translate(`${LocationKey.HQ}-${LocationKey.COMMAND_CENTER}`),
                    id: `${LocationKey.HQ}-${LocationKey.COMMAND_CENTER}`,
                    onSelect: () => {
                        this.moveToLocation(LocationKey.COMMAND_CENTER)
                    }
                },
                {
                    label: translate(`${LocationKey.HQ}-${LocationKey.CONSTRUCTION_CENTER}`),
                    id: `${LocationKey.HQ}-${LocationKey.CONSTRUCTION_CENTER}`,
                    onSelect: () => {
                        this.moveToLocation(LocationKey.CONSTRUCTION_CENTER)
                    }
                },
            ]
        },
        [LocationKey.CONSTRUCTION_CENTER]: {
            label: translate(LocationKey.CONSTRUCTION_CENTER),
            key: LocationKey.CONSTRUCTION_CENTER,
            options: () => {
                const buildingOptions = Object.values(BuildingType).map((buildingType: BuildingType) => ({
                    label: translate(`${LocationKey.CONSTRUCTION_CENTER}-build-${buildingType}`),
                    id: `${LocationKey.CONSTRUCTION_CENTER}-build-${buildingType}`,
                    onSelect: () => {
                        this.constructBuilding(buildingType)
                    },
                    isDisabled: () => this.playerData.savedGame!.buildings.find((building) => building === buildingType) !== undefined,
                    disabledLabel: () => translate(`${LocationKey.CONSTRUCTION_CENTER}-build-${buildingType}-error-alreadybuilt`),
                }))
                return [
                    ...buildingOptions,
                    {
                        label: translate(`${LocationKey.CONSTRUCTION_CENTER}-${LocationKey.HQ}`),
                        id: `${LocationKey.CONSTRUCTION_CENTER}-${LocationKey.HQ}`,
                        onSelect: () => {
                            this.moveToLocation(LocationKey.HQ)
                        }
                    }
                ]
            }
        },
        [LocationKey.COMMAND_CENTER]: {
            label: translate(LocationKey.COMMAND_CENTER),
            key: LocationKey.COMMAND_CENTER,
            options: () => {
                let options: Option[] =
                    this.playerData.savedGame!.battalions.filter((battalion) => battalion !== null).map((battalion) => {
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
                        label: translate(`${LocationKey.COMMAND_CENTER}-new-leader`),
                        id: `${LocationKey.COMMAND_CENTER}-new-leader`,
                        onSelect: () => {
                            const leader = "LEADER_" + Math.random().toString().substring(2, 8)
                            const name = "BTL_" + Math.random().toString().substring(2, 8)
                            this.createBattalion(leader, name)

                            return AnsiCode.BGGreen + translate(`${LocationKey.COMMAND_CENTER}-new-leader-success`) + " " + leader + AnsiCode.Reset
                        }
                    },
                    {
                        label: translate(`${LocationKey.COMMAND_CENTER}-${LocationKey.HQ}`),
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

    createBattalion(leader: string, name: string, units: (UnitData | null)[] = [null, null, null, null]) {
        const btlIndex = this.playerData.savedGame!.battalions.indexOf(null)
        if (btlIndex !== -1) {
            this.playerData.savedGame!.battalions[btlIndex] = { leader, name, units }
            this.playerData.save()
        }
        this.playerData.save()
    }
}
