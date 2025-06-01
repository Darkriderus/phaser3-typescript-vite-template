import { GameLocation, GameLogic } from "./GameLogic";

export class StoredDataStructure {
    settings: any
    savedGame?: {
        date: Date,
        money: number,
        rawMaterials: number,
    }
    currentMenu?: GameLocation
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

    public static get currentMenu(): GameLocation {
        const currentMenuId = (this.load().currentMenu || GameLogic.LOCATIONS.MAIN_MENU).id
        console.log('currentMenuId', currentMenuId);

        return Object.values(GameLogic.LOCATIONS).find((location: GameLocation) => location.id === currentMenuId)!

    }
    public static set currentMenu(value: GameLocation) {
        const playerData = this.load()
        playerData.currentMenu = value
        this.save(playerData)
    }

    // #endregion

    public static init() {
        this.currentMenu = GameLogic.LOCATIONS.MAIN_MENU
    }

    public static createGame() {
        console.log("Create Game");
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
        return storedData ? JSON.parse(storedData) : { currentMenu: GameLogic.LOCATIONS.MAIN_MENU, settings: {} }
    }

    private static save(dataToSave: StoredDataStructure) {
        localStorage.setItem(PlayerData.KEY, JSON.stringify(dataToSave));
    }
}