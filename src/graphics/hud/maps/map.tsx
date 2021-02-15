import React from 'react';
import styled from 'styled-components';

import { Matches } from '../../../types/nodecg-csgo-manager';

const MapContainer = styled.div`
	display: flex;
	align-items: center;
	border-top: 1px solid white;
	padding: 10px 0;
`;

const MapName = styled.div`
	font-weight: bold;
	width: 100px;
	text-align: center;
`;

const TeamImage = styled.img`
	height: 40px;
	min-width: 60px;
	max-width: 60px;
	object-fit: contain;
`;

const ScoreText = styled.span`
	min-width: 60px;
	text-align: center;
`;

interface Props {
	matchData: Matches.Match;
	map: Matches.MapInfo;
}

export const Map: React.FC<Props> = (props: Props) => {
	let pickedLogo =
		props.map.teamVeto === props.matchData.teamA.name ? props.matchData.teamA.logo : props.matchData.teamB.logo;

	let winnerLogo =
		props.map.totalScore.teamA > props.map.totalScore.teamB
			? props.matchData.teamA.logo
			: props.matchData.teamB.logo;

	if (!props.map.complete) {
		winnerLogo = '';
	}

	return (
		<MapContainer>
			<MapName>{props.map.map}</MapName>

			{props.map.teamVeto === 'Server' ? <ScoreText>Decider</ScoreText> : <TeamImage src={pickedLogo} />}
			<TeamImage src={winnerLogo} />
			<ScoreText>
				{props.map.totalScore.teamA}:{props.map.totalScore.teamB}
			</ScoreText>
		</MapContainer>
	);
};
