import { PlayerData } from "../classes/PlayerData";
import ConsoleGrid from 'console-grid';

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