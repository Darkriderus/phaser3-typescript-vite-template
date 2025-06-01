import Phaser from 'phaser'
import EventsCenter from '../classes/EventsCenter'
import MainMenuScene from './MainMenuScene'
import { GameOption } from '../classes/GameLogic'
import { PlayerData } from '../classes/PlayerData'

export enum Direction {
    UP = -1,
    DOWN = 1
}

export default class ConsoleUIScene extends Phaser.Scene {
    static readonly KEY = 'console'

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private enterKey!: Phaser.Input.Keyboard.Key

    private _options: GameOption[] = []
    private _text: string = ''
    private _selectedIndex = 0

    constructor() {
        super({ key: ConsoleUIScene.KEY, active: true })
    }

    // Getters/Setters
    get selectedIndex() {
        return this._selectedIndex
    }

    set selectedIndex(index: number) {
        this._selectedIndex = index
        this.updateOptionHighlight()
    }

    get options(): GameOption[] {
        return this._options
    }

    set options(value: GameOption[]) {
        this._options = value
        this.renderOptions()
    }

    get text(): string {
        return this._text
    }

    set text(value: string) {
        this._text = value
        this.renderTextOutput()
    }

    // Phaser lifecycle
    create(): void {
        this.setupKeyboardControls()
        this.registerEventListeners()
        this.game.scene.start(MainMenuScene.KEY)
    }

    update(): void {
        this.handleInput()
    }

    // Input
    private setupKeyboardControls(): void {
        this.cursors = this.input.keyboard.createCursorKeys()
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
    }

    private handleInput(): void {
        if (Phaser.Input.Keyboard.JustDown(this.cursors.up!)) {
            this.moveCursor(Direction.UP)
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursors.down!)) {
            this.moveCursor(Direction.DOWN)
        }

        if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
            this.triggerSelectedOption()
        }
    }

    // Event Handling
    private registerEventListeners(): void {
        EventsCenter.on('console-output', ({ text, options }: { text: string; options: GameOption[] }) => {
            this.text = text
            this.options = options
            this.selectedIndex = 0
        })
    }

    // UI Updates
    private renderTextOutput(): void {
        const consoleOutput = document.getElementById('console-output') as HTMLDivElement
        if (consoleOutput) {
            consoleOutput.textContent = this.text
        }
    }

    private renderOptions(): void {
        const list = document.getElementById('console-options') as HTMLUListElement
        if (!list) return

        list.innerHTML = ''

        this._options.forEach((option, index) => {
            const li = document.createElement('li')
            li.textContent = option.text
            li.value = option.id
            if (index === this.selectedIndex) li.classList.add('selected')
            list.appendChild(li)
        })
    }

    private updateOptionHighlight(): void {
        const items = document.querySelectorAll('#console-options li') as NodeListOf<HTMLLIElement>
        items.forEach((item, i) => {
            item.classList.toggle('selected', i === this.selectedIndex)
        })
    }

    // Game Logic
    private moveCursor(direction: Direction): void {
        console.log(PlayerData.currentMenu.options)
        const total = this._options.length
        if (total === 0) return

        this.selectedIndex = (this.selectedIndex + direction + total) % total
    }

    private triggerSelectedOption(): void {
        const selected = this._options[this.selectedIndex]
        EventsCenter.emit('option-selected', { selectedId: selected.id })
        this.selectedIndex = 0
    }
}
