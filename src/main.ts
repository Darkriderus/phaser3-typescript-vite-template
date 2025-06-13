import { select } from '@inquirer/prompts';
import { GameLogic, LocationKey } from './classes/GameLogic';


const main = async () => {
	let exitGame = false;
	const gameLogic = new GameLogic();
	const allLocations = gameLogic.LOCATIONS;
	let currentLocation = allLocations[LocationKey.MAIN_MENU]

	do {
		console.clear();

		const menuChoices = currentLocation.options.map((option, index) => {
			const isDisabled = option.isDisabled?.() ?? false;

			return {
				name: `[${index + 1}]${isDisabled ? '' : ' ' + option.label}`,
				value: option.id,
				description: `[DESC] ${option.label}`,
				key: index + 1,
				disabled: isDisabled ? option.disabledLabel?.() ?? true : false,
			};
		});

		currentLocation.header?.()

		const answer = await select({
			message: currentLocation.label,
			choices: menuChoices
		});

		const selectedMenuOption = currentLocation.options.find((option) => option.id === answer);
		if (selectedMenuOption) {
			selectedMenuOption.onSelect()
		}

		currentLocation = allLocations[gameLogic.playerData.savedGame!.currentLocation]
	} while (!exitGame)
};

main();

process.on('uncaughtException', (error) => {
	if (error instanceof Error && error.name === 'ExitPromptError') {
		console.log('👋 until next time!');
	} else {
		// Rethrow unknown errors
		throw error;
	}
});
