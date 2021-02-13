import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { stateType } from '../../replicant-store';

import { FitText, Text as FitTextText } from '../../components/fit-text';
import Grid from '@material-ui/core/Grid';
import { Wing } from './wing';
import { Time } from './time';
import { BombPlanted } from './bomb-planted';

const Text = styled(FitText)`
	& > ${FitTextText} {
	}
`;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const Hub = styled.div`
	background: var(--bg-col);
	color: #fff;
	width: 115px;
	height: 94px;
	background-size: 13px 13px;
	z-index: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
`;

const Round = styled(Text)`
	font-size: 25px;
`;

const OTText = styled(Round)`
	max-width: 52px;
`;

const BombPlantedStyled = styled(BombPlanted)`
	position: absolute;
	top: 118px;
`;

interface Props {
	style?: React.CSSProperties;
}

function currentTeamSide(round: number) {
	if (round < 15) {
		return true;
	}

	if (round >= 30) {
		// Overtime math
		return Boolean(Math.floor((round - 27) / 6) % 2);
	}

	return false;
}

export const ScoreBug: React.FunctionComponent<Props> = (props: Props) => {
	const bomb = useSelector((state: stateType) => state.bomb);
	const phase = useSelector((state: stateType) => state.phase);
	const round = useSelector((state: stateType) => state.game.round);
	const matchStats = useSelector((state: stateType) => state.matchStats);
	const teamOne = useSelector((state: stateType) => state.teamOne);
	const teamTwo = useSelector((state: stateType) => state.teamTwo);
	const swapTeams = useSelector((state: stateType) => state.swapTeams);
	const allPlayers = useSelector((state: stateType) => state.allPlayers);
	const currentMatch = useSelector((state: stateType) => state.currentMatch);

	const [playerKit, setPlayerKit] = useState(false);
	const time = parseFloat(phase.phase_ends_in);
	const [playerName, setPlayerName] = useState('');
	const [currentRound, setCurrentRound] = useState(0);

	const roundWinner = round?.win_team || '';

	const ct = !currentTeamSide(currentRound);

	let otText: JSX.Element | null = null;
	if (matchStats.round >= 30) {
		otText = (
			<div
				style={{
					fontSize: 25,
					display: 'flex',
					justifyContent: 'space-around',
					width: 102,
				}}>
				<OTText
					text={`OT${Math.ceil((matchStats.round - 29) / 6)}`}
					style={{ fontStyle: 'italic', lineHeight: '34px' }}
				/>
				<OTText text={`${matchStats.round - 29 - ~~((matchStats.round - 30) / 6) * 6}/6`} />
			</div>
		);
	}

	useEffect(() => {
		// No bomb in warmup
		if (bomb === undefined) {
			return;
		}

		if (bomb.state === 'defusing') {
			const player = allPlayers.find((player) => player.steamId === bomb.player);
			if (player) {
				setPlayerName(player.name);
				setPlayerKit(Boolean(player.state.defusekit));
			}
		}

		if (bomb.state === 'planting') {
			const player = allPlayers.find((player) => player.steamId === bomb.player);
			if (player) {
				setPlayerName(player.name);
			}
		}
	}, [allPlayers, bomb]);

	useEffect(() => {
		if (phase.phase === 'freezetime' && currentRound !== matchStats.round) {
			setCurrentRound(matchStats.round);
		}
	}, [currentRound, matchStats.round, phase.phase]);

	return (
		<Container style={props.style}>
			<Grid container direction={swapTeams ? 'row-reverse' : 'row'} justify="center" alignItems="center">
				<Wing
					displayingTeam={currentMatch?.teamA}
					oppositeTeam={currentMatch?.teamB}
					ct={ct}
					right={swapTeams}
					score={teamOne.score.toString()}
					matchesWonThisSeries={teamOne.matchesWonThisSeries}
				/>
				<Hub>
					<Time phase={phase.phase} time={time} roundWin={roundWinner} />
					{otText ? otText : <Round text={`${currentRound + 1}/30`} />}
				</Hub>
				<Wing
					displayingTeam={currentMatch?.teamB}
					oppositeTeam={currentMatch?.teamA}
					ct={!ct}
					right={!swapTeams}
					score={teamTwo.score.toString()}
					matchesWonThisSeries={teamTwo.matchesWonThisSeries}
				/>
			</Grid>
			<BombPlantedStyled
				bomb={bomb}
				playerName={playerName || ''}
				kit={bomb?.state === 'defusing' ? playerKit : false}
			/>
		</Container>
	);
};
