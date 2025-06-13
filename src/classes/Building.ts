export enum BuildingType {
    MINING_CAMP = 'mining-camp',
    FACTORY = 'factory',
    BARRACKS = 'barracks',
    STORAGE = 'storage'
}

export class Building {
    public type: BuildingType
    public tier: number

    constructor(type: BuildingType) {
        this.type = type
        this.tier = 1
    }
}