import { select } from '@inquirer/prompts';
import { GameLogic, LocationKey } from './classes/GameLogic';


const main = async () => {
	let exitGame = false;
	const gameLogic = new GameLogic();
	const allLocations = gameLogic.LOCATIONS;
	let currentLocation = allLocations[LocationKey.MAIN_MENU]
	let message = ''

	do {
		console.clear();

		const menuChoices = currentLocation.options().filter((option) => !option.isHidden || !option.isHidden()).map((option, index) => {
			const isDisabled = option.isDisabled?.() ?? false;
			return {
				name: `[${isDisabled ? 'X' : index + 1}]${isDisabled ? '' : ' ' + option.label}`,
				value: option.id,
				// description: `[DESC] ${option.label}`,
				key: isDisabled ? null : index + 1,
				disabled: isDisabled ? option.disabledLabel?.() ?? true : false,
			};
		});

		if (message) {
			console.log(message)
			message = ''
		}

		currentLocation.header?.()

		const answer = await select({
			message: currentLocation.label,
			choices: menuChoices
		});

		const selectedMenuOption = currentLocation.options().find((option) => option.id === answer);
		if (selectedMenuOption) {
			message = selectedMenuOption.onSelect() ?? ''
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
