import { LocationKey } from "./GameLogic";
import * as fs from 'fs';



export type StoredDataStructure = {
    money: number,
    rawMaterials: number,
    currentLocation: LocationKey
}

export class PlayerData {
    private filename = 'saved-game.json'

    public savedGame: StoredDataStructure | null = null

    constructor() {
        if (!fs.existsSync(this.filename)) {
            fs.writeFileSync(this.filename, "");
        }
    }

    public createNew() {
        this.savedGame = {
            money: 500,
            rawMaterials: 500,
            currentLocation: LocationKey.HOMEBASE
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