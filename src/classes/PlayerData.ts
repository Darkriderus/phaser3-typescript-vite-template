import { LocationKey } from "./GameLogic";

export class StoredDataStructure {
    settings: any
    savedGame?: {
        date: Date,
        money: number,
        rawMaterials: number,
        currentLocation?: LocationKey
    }
}

export class PlayerData {
    private static readonly KEY = 'storedData';

    // #region Getters and Setters
    public static get hasSavedGame(): boolean {
        return this.load().savedGame !== undefined
    }

    public static get date() {
        return this.load().savedGame?.date
    }

    public static get money(): number | undefined {
        return this.load().savedGame?.money
    }
    public static set money(value: number) {
        const playerData = this.load()
        playerData.savedGame!.money = value
        this.save(playerData)
    }

    public static get rawMaterials(): number | undefined {
        return this.load().savedGame?.rawMaterials
    }
    public static set rawMaterials(value: number) {
        const playerData = this.load()
        playerData.savedGame!.rawMaterials = value
        this.save(playerData)
    }

    public static get currentLocation(): LocationKey {
        return this.load().savedGame?.currentLocation || LocationKey.HOMEBASE

    }
    public static set currentLocation(value: LocationKey) {
        const playerData = this.load()
        playerData.savedGame!.currentLocation = value
        this.save(playerData)
    }

    // #endregion

    public static create() {
        const playerData = this.load()
        playerData.savedGame = {
            date: new Date(),
            money: 500,
            rawMaterials: 500,
        }
        this.save(playerData)
    }

    private static load(): StoredDataStructure {
        const storedData = localStorage.getItem(PlayerData.KEY);
        return storedData ? JSON.parse(storedData) : { savedGame: undefined, settings: {} }
    }

    private static save(dataToSave: StoredDataStructure) {
        localStorage.setItem(PlayerData.KEY, JSON.stringify(dataToSave));
    }
}