import { PlayerData } from "./PlayerData";
import ConsoleGrid, { GridData } from 'console-grid';
// import EightColors from 'eight-colors';

export class WorldMap {
    static generateMap(_playerData: PlayerData) {
        // Pure fuming pile of hardcoded bullshit for testing my Idea

        const grid: GridData = {
            options: {
                padding: 0,
                defaultMaxWidth: 5,
                defaultMinWidth: 5,
            },
            columns: [
                {
                    id: "labels",
                    name: "",
                    align: "center",
                },
                {
                    name: "A",
                    id: "A",
                    align: "center",

                },
                {
                    name: "B",
                    id: "B",
                    align: "center",

                },
                {
                    name: "C",
                    id: "C",
                    align: "center",

                },
                {
                    name: "D",
                    id: "D",
                    align: "center",

                },
                {
                    name: "E",
                    id: "E",
                    align: "center",

                },
            ],
            rows: [
                {
                    "labels": "1",
                    "A": " ",
                    "B": " ",
                    "C": " ",
                    "D": " ",
                    "E": " ",
                },
                {
                    innerBorder: true
                },
                {
                    "labels": "2",
                    "A": " ",
                    "B": " ",
                    "C": "HQ",
                    "D": " ",
                    "E": " ",
                },
                {
                    innerBorder: true
                },
                {
                    "labels": "3",
                    "A": " ",
                    "B": " ",
                    "C": " ",
                    "D": " ",
                    "E": " ",
                },
            ]
        }

        // Kinda Working
        // const grid: GridData = {
        //     columns: [
        //         "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"
        //     ],
        //     rows: [
        //         ["1", "", "", "", "", "", "", "", "", ""],
        //         innerBorder,
        //         ["2", "", "", "", "", "", "", "", "", ""],
        //         innerBorder,
        //         ["3", "", "", "", "", "", "", "", "", ""],
        //         innerBorder,
        //         ["4", "", "", "", "", "", "", "", "", ""],
        //         innerBorder,
        //         ["5", "", "", "", "", "", "", "", "", ""],
        //         innerBorder,
        //         ["6", "", "", "", "", "", "", "", "", ""],
        //         innerBorder,
        //         ["7", "", "", "", "", "", "", "", "", ""],
        //         innerBorder,
        //         ["8", "", "", "", "", "", "", "", "", ""],
        //         innerBorder,
        //         ["9", "", "", "", "", "", "", "", "", ""]
        //     ]
        // }


        ConsoleGrid(grid)
    }
}