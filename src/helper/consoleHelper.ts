import { PlayerData } from "../classes/PlayerData";
import ConsoleGrid from 'console-grid';

export enum AnsiCode {
    Reset = '\x1b[0m',
    Bright = '\x1b[1m',
    Dim = '\x1b[2m',
    Underscore = '\x1b[4m',
    Blink = '\x1b[5m',
    Reverse = '\x1b[7m',
    Hidden = '\x1b[8m',

    Black = '\x1b[30m',
    Red = '\x1b[31m',
    Green = '\x1b[32m',
    Yellow = '\x1b[33m',
    Blue = '\x1b[34m',
    Magenta = '\x1b[35m',
    Cyan = '\x1b[36m',
    White = '\x1b[37m',

    BGBlack = '\x1b[40m',
    BGRed = '\x1b[41m',
    BGGreen = '\x1b[42m',
    BGYellow = '\x1b[43m',
    BGBlue = '\x1b[44m',
    BGMagenta = '\x1b[45m',
    BGCyan = '\x1b[46m',
    BGWhite = '\x1b[47m',
}


export const generateFullHeader = (playerData: PlayerData) => {
    ConsoleGrid({
        "columns": [
            {
                "name": "Money",
                "align": "right"
            }, {
                "name": "Raw Materials",
                "align": "right"
            }],
        "rows": [
            [
                playerData.savedGame!.money,
                playerData.savedGame!.rawMaterials
            ],
        ]
    });
}