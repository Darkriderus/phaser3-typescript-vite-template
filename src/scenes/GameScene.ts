import Phaser from 'phaser'
import { GameLogic, GameOption, LocationKey } from '../classes/GameLogic';
import EventsCenter from '../classes/EventsCenter';
import { ConsoleEvents } from './ConsoleUIScene';

export default class GameScene extends Phaser.Scene {
    static readonly KEY = 'game'

    private gameLogic?: GameLogic

    constructor() {
        super(GameScene.KEY)
    }

    preload() {
    }

    create() {
        this.gameLogic = new GameLogic()

        EventsCenter.on(ConsoleEvents.SELECT_OPTION, (data: { locationKey: LocationKey | undefined, selectedId: number }) => {
            if (this.scene.isActive(GameScene.KEY) && data.locationKey && (data.locationKey as LocationKey)) {
                console.log(GameScene.KEY, ConsoleEvents.SELECT_OPTION, { data })
                this.gameLogic!.ALL_LOCATIONS[data.locationKey].options.find((option: GameOption) => option.id === data.selectedId)!.onSelect();
            }
        });
    }
}
