import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';

import { useSelector } from 'react-redux';

// Import { useReplicant } from 'use-nodecg';
// import { CSGOOutput, MatchStats, Weapon } from '../../types/csgo-gsi';
import { DummyProducer } from '../../extensions/dummyData';
// Import { TeamData } from '../../types/extra-data';
import { Producer } from '../../types/producer';
import { ComponentAnimation } from '../../types/animations';
import { stateType } from '../replicant-store';

import { ScoreBug } from './score-bug/score-bug';
import { Player } from './player/player';
import { CurrentPlayer } from './current-player/current-player';
import { TeamEco } from './in-game-stats/team-eco';
import { TeamNade } from './in-game-stats/team-nades';
import { Killfeed } from './killfeed/killfeed';
import { RoundHistory } from './round-history/round-history';
import { PlayersAlive } from './players-alive/players-alive';

const Container = styled.div`
	position: absolute;
	width: 1920px;
	height: 1080px;
	overflow: hidden;
	font-family: Roboto;
`;

const TopCentered = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	width: 100%;
`;

const PlayerList = styled.div`
	& > * {
		margin: 10px 0;
	}
`;

const LeftSide = styled(PlayerList)`
	position: absolute;
	left: 30px;
	top: 660px;
`;
const RightSide = styled(PlayerList)`
	position: absolute;
	right: 30px;
	top: 660px;
`;

const GameStats = styled.div`
	& > * {
		margin: 5px 0;
	}
	top: 501px;
	display: flex;
	flex-direction: column;
	width: 340px;
`;

const LeftGameStats = styled(GameStats)`
	position: absolute;
	left: 30px;
`;

const RightGameStats = styled(GameStats)`
	position: absolute;
	right: 30px;
	align-items: flex-end;
`;

const Current = styled(CurrentPlayer)`
	position: absolute;
	left: 588px;
	bottom: 50px;
`;

// Const BombPlantedStyled = styled(BombPlanted)`
// 	position: absolute;
// 	top: 110px;
// 	left: 633px;
// `;

// Returns true if teamOne should be T's
function currentTeamSide(round: number): boolean {
	if (round < 15) {
		return true;
	}

	if (round >= 30) {
		// Overtime math
		return Boolean(Math.floor((round - 27) / 6) % 2);
	}

	return false;
}

export const HUD: React.FunctionComponent = () => {
	const allPlayers = useSelector((state: stateType) => state.allPlayers);
	const swapTeams = useSelector((state: stateType) => state.swapTeams);
	const matchStats = useSelector((state: stateType) => state.matchStats);
	const phase = useSelector((state: stateType) => state.phase.phase);

	const [producerRep] = useReplicant<Producer, Producer>('producer', DummyProducer);
	const scoreBugRef = useRef<HTMLDivElement>(null);
	const roundHistoryRef = useRef<ComponentAnimation>(null);
	const leftTeamEcoRef = useRef<ComponentAnimation>(null);
	const rightTeamEcoRef = useRef<ComponentAnimation>(null);
	const leftTeamNadesRef = useRef<ComponentAnimation>(null);
	const rightTeamNadesRef = useRef<ComponentAnimation>(null);
	const [, setScoreBugWidth] = useReplicant<number, number>('scoreBugWidth', 1920);

	const ct = swapTeams ? currentTeamSide(matchStats.round) : !currentTeamSide(matchStats.round);

	useEffect(() => {
		if (producerRep.teamEco) {
			leftTeamEcoRef?.current?.show();
			rightTeamEcoRef?.current?.show();
		} else {
			leftTeamEcoRef?.current?.hide();
			rightTeamEcoRef?.current?.hide();
		}

		if (producerRep.teamNades) {
			leftTeamNadesRef?.current?.show();
			rightTeamNadesRef?.current?.show();
		} else {
			leftTeamNadesRef?.current?.hide();
			rightTeamNadesRef?.current?.hide();
		}
	}, [producerRep]);

	const leftPlayers: JSX.Element[] = [];
	const rightPlayers: JSX.Element[] = [];

	// This is really ugly
	allPlayers.forEach((player) => {
		if (swapTeams) {
			if (player.observer_slot <= 5) {
				leftPlayers.push(<Player steamId={player.steamId} key={player.steamId} />);
			} else {
				rightPlayers.push(<Player steamId={player.steamId} key={player.steamId} right />);
			}
		} else if (player.observer_slot > 5) {
			leftPlayers.push(<Player steamId={player.steamId} key={player.steamId} />);
		} else {
			rightPlayers.push(<Player steamId={player.steamId} key={player.steamId} right />);
		}

		return undefined;
	});

	useEffect(() => {
		if (scoreBugRef.current) setScoreBugWidth(scoreBugRef.current.offsetWidth);
	}, [scoreBugRef?.current?.offsetWidth]);

	return (
		<Container>
			<TopCentered>
				<div ref={scoreBugRef}>
					<ScoreBug style={{ marginTop: 21 }} />
				</div>
				<RoundHistory ref={roundHistoryRef} />
			</TopCentered>

			<PlayersAlive style={{ position: 'absolute', top: 30, right: 30 }} />

			<LeftSide>{leftPlayers}</LeftSide>
			<RightSide>{rightPlayers}</RightSide>

			<LeftGameStats>
				<TeamEco ref={leftTeamEcoRef} phase={phase} ct={ct} teamTwo={swapTeams} />
				<TeamNade ref={leftTeamNadesRef} phase={phase} ct={ct} teamTwo={swapTeams} />
			</LeftGameStats>

			<RightGameStats>
				<TeamEco ref={rightTeamEcoRef} phase={phase} ct={!ct} right teamTwo={!swapTeams} />
				<TeamNade ref={rightTeamNadesRef} phase={phase} ct={!ct} right teamTwo={!swapTeams} />
			</RightGameStats>

			<Current />

			<Killfeed />
		</Container>
	);
};
