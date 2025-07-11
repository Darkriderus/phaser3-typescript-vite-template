import { BuildingType } from "./Building";
import { LocationKey } from "./GameLogic";
import * as fs from 'fs';
import { UnitData } from "./Unit";

export type Battalion = {
    leader: string,
    name: string,
    units: (UnitData | null)[]
}

export enum Direction {
    WEST = 'west',
    EAST = 'east',
    NORTH = 'north',
    SOUTH = 'south'
}

export type Faction = {
    name: string,
    direction: Direction
}

export type StoredDataStructure = {
    money: number,
    rawMaterials: number,
    buildings: (BuildingType | null)[],
    battalions: (Battalion | null)[],
    currentLocation: LocationKey,
    factions: Faction[]
}

export class PlayerData {
    private filename = 'saved-game.json'

    public savedGame: StoredDataStructure | null = null

    constructor() {
        if (!fs.existsSync(this.filename)) {
            fs.writeFileSync(this.filename, "");
        }
    }

    public hasSavedGame() {
        return fs.existsSync(this.filename) && fs.readFileSync(this.filename, 'utf-8').length > 0
    }

    public createNew() {
        this.savedGame = {
            money: 500,
            rawMaterials: 1000,
            buildings: [null, null, null, null, null, null],
            battalions: [null, null, null, null, null, null],
            currentLocation: LocationKey.HQ,
            factions: [
                {
                    name: 'Faction West',
                    direction: Direction.WEST
                },
                {
                    name: 'Faction East',
                    direction: Direction.EAST
                },
                {
                    name: 'Faction North',
                    direction: Direction.NORTH
                },
                {
                    name: 'Faction South',
                    direction: Direction.SOUTH
                }
            ]
        }
        this.save()
    }

    public save() {
        if (this.savedGame) {
            fs.writeFileSync(this.filename, JSON.stringify(this.savedGame, null, 2));
            return true
        } else {
            return false
        }
    }

    public load() {
        const saveGameFileContent = fs.readFileSync(this.filename, 'utf-8')
        if (saveGameFileContent.length > 0) {
            this.savedGame = JSON.parse(saveGameFileContent)
        }
        else {
            this.createNew()
        }
    }
}