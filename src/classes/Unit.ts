export type UnitData = {
    name: string,
    combatScore: number
}

export class Unit {
    private data: UnitData

    constructor(data: UnitData) {
        this.data = data
    }

    get name() {
        return this.data.name
    }
    set name(name: string) {
        this.data.name = name
    }

    get combatScore() {
        return this.data.combatScore
    }
    set combatScore(combatScore: number) {
        this.data.combatScore = combatScore
    }
}