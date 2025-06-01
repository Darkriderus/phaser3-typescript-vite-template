import Phaser from 'phaser'
import EventsCenter from '../classes/EventsCenter'
import MainMenuScene from './MainMenuScene'

export enum Direction {
    UP = -1,
    DOWN = 1
}

export default class ConsoleUIScene extends Phaser.Scene {
    static readonly KEY = 'console'

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private enterKey!: Phaser.Input.Keyboard.Key;
    private _selectedIndex: number = 0;
    private options: string[] = [];

    constructor() {
        super({ key: ConsoleUIScene.KEY, active: true });
    }

    get selectedIndex(): number {
        return this._selectedIndex;
    }

    set selectedIndex(value: number) {
        this._selectedIndex = value;
        this.highlightSelectedOption();
    }

    create(): void {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        EventsCenter.on('console-output', this.renderOptions, this);

        this.game.scene.start(MainMenuScene.KEY);
    }

    update(): void {
        if (Phaser.Input.Keyboard.JustDown(this.cursors.up!)) {
            this.moveCursor(Direction.UP);
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursors.down!)) {
            this.moveCursor(Direction.DOWN);
        }

        if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
            this.selectCurrentOption();
        }
    }

    private moveCursor(direction: Direction): void {
        const optionCount = this.options.length;
        if (optionCount === 0) return;

        this.selectedIndex = (this.selectedIndex + direction + optionCount) % optionCount;
    }

    private selectCurrentOption(): void {
        const selectedText = this.options[this.selectedIndex];
        console.log('selectedCmd:', selectedText);

        // ToDo: emit player-input event
        this.selectedIndex = 0;
    }

    private highlightSelectedOption(): void {
        const listItems = document.querySelectorAll("#console-options li") as NodeListOf<HTMLLIElement>;

        listItems.forEach((li, index) => {
            li.classList.toggle("selected", index === this.selectedIndex);
        });
    }

    private renderOptions(data: { payload: string[] }): void {
        this.options = data.payload;

        const listElement = document.getElementById("console-options") as HTMLUListElement;
        listElement.innerHTML = "";

        this.options.forEach((cmd, index) => {
            const li = document.createElement("li");
            li.textContent = cmd;
            if (index === this.selectedIndex) {
                li.classList.add("selected");
            }
            listElement.appendChild(li);
        });
    }
}
