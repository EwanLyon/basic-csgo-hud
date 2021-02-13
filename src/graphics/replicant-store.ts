import { createStore } from 'redux';
import clone from 'clone';
import { ReplicantBrowser } from '../../../../types/browser';
import ExampleData from '../../../nodecg-csgo-manager/types/example-data';
import { Matches } from '../types/nodecg-csgo-manager';

const replicantNames = [
	'game',
	'matchStats',
	'allPlayers',
	'observingPlayer',
	'bomb',
	'phase',
	'playerData',
	'teamOne',
	'teamTwo',
	'swapTeams',
	'gameSettings',
	'matchKills',
	'mapGrenades',
	'matches',
	'currentMatch',
	'mapPlayers',
	'interpMapPlayers',
];
const replicants: ReplicantBrowser<unknown>[] = [];

const initialState = {
	game: ExampleData.game,
	matchStats: ExampleData.match,
	allPlayers: ExampleData.player,
	observingPlayer: ExampleData.observingPlayer,
	bomb: ExampleData.bomb,
	phase: ExampleData.phase,
	playerData: ExampleData.extraData,
	teamOne: ExampleData.teamData,
	teamTwo: ExampleData.teamData,
	swapTeams: false,
	gameSettings: ExampleData.gameSettings,
	matchKills: [],
	mapGrenades: ExampleData.grenadesAll,
	matches: [] as Matches.Matches,
	currentMatch: undefined as Matches.Match | undefined,
	mapPlayers: ExampleData.mapPostions,
	interpMapPlayers: ExampleData.interpMapPositions,
};

function replicantReducer(
	// eslint-disable-next-line default-param-last
	state = initialState,
	action: { type: string; name: string; value: unknown },
) {
	switch (action.type) {
		case 'updateReplicant':
			return { ...state, [action.name]: action.value };

		default:
			return state;
	}
}

export const store = createStore(replicantReducer);

export type stateType = typeof initialState;

replicantNames.forEach((name) => {
	const replicant = nodecg.Replicant(name, 'nodecg-csgo-manager');

	replicant.on('change', (newVal) => {
		store.dispatch({ type: 'updateReplicant', name: replicant.name, value: clone(newVal) });
	});

	replicants.push(replicant);
});
