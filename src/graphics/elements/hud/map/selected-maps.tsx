import React from 'react';
import styled, { keyframes, css } from 'styled-components';

import { MapInfo } from '../../../../types/matches';
import { DesktopWindows } from '@material-ui/icons';
import { TeamData } from '../../../../types/extra-data';

const Container = styled.div`
	width: 1004px;
	background: white;
	border: 1px solid white;
	display: flex;
	justify-content: space-evenly;
	align-items: center;
	color: #000;
	padding: 10px;
`;

const SetMap = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`;

const ServerImage = styled(DesktopWindows)`
	font-size: 50px !important;
	margin-right: 20px;
`;

const TeamImage = styled.img`
	height: 50px;
	margin-right: 10px;
	width: auto;
	margin: 0 auto;
`;

const MapName = styled.span`
	font-size: 40px;
	font-weight: bold;
	margin-left: 10px;
	text-transform: uppercase;
`;

const SingleGrid = styled.div`
	display: grid;
`;

const TextFade = keyframes`
	0%, 50% {
		opacity: 0;
	}
	55%, 100% {
		opacity: 1;
	}
`;

const animationText = css`
	animation: ${TextFade} 10s alternate-reverse infinite both;
`;

const FadeImage1 = styled(TeamImage)`
	${animationText};
	grid-column: 1;
	grid-row: 1;
`;
const FadeImage2 = styled(FadeImage1)`
	animation-direction: alternate;
`;

// Servers can't win games lmao
const FadeServerImage = styled(ServerImage)`
	${animationText};
`;

const FadeText1 = styled(MapName)`
	${animationText};
	grid-column: 1;
	grid-row: 1;
`;

const FadeText2 = styled(FadeText1)`
	animation-direction: alternate;
`;

interface Props {
	mapData: MapInfo[];
	teamOne: TeamData;
	teamTwo: TeamData;
	swapTeams?: boolean;
}

function addScores(map: MapInfo, teamB = false) {
	if (teamB) {
		return map.firstHalf.teamB + map.secondHalf.teamB + (map?.ot?.teamB || 0);
	} else {
		return map.firstHalf.teamA + map.secondHalf.teamA + (map?.ot?.teamA || 0);
	}
}

export const SelectedMaps: React.FC<Props> = React.memo((props: Props) => {
	if (props.mapData.length === 0) {
		// If no selected maps then show nothing;
		return <React.Fragment></React.Fragment>;
	}

	const selectedMapsMap = props.mapData.map((map, index) => {
		if (map.ban) {
			return undefined;
		}

		const teamImage = map.teamVeto === props.teamOne.name ? props.teamOne.teamURL : props.teamTwo.teamURL;
		const mapName = map.map.replace('de_', '');

		let matchScore = '';
		let matchWinnerLogo = teamImage;
			if (addScores(map) >= 16 || addScores(map, true) >= 16) {
				matchScore = props.swapTeams
					? `${addScores(map, true)}:${addScores(map)}`
					: `${addScores(map)}:${addScores(map, true)}`;

				if (addScores(map) > addScores(map, true)) {
					matchWinnerLogo = props.teamOne.teamURL;
				} else {
					matchWinnerLogo = props.teamTwo.teamURL;
				}
			}

		return (
			<SetMap key={index}>
				{matchScore === '' || matchWinnerLogo === teamImage ? (
					map.teamVeto === 'Server' ? (
						<ServerImage />
					) : (
						<TeamImage src={teamImage} />
					)
				) : (
					<SingleGrid>
						{map.teamVeto === 'Server' ? (
							<FadeServerImage />
						) : (
							<FadeImage1 src={teamImage} />
						)}
						<FadeImage2 src={matchWinnerLogo} />
					</SingleGrid>
				)}
				{matchScore === '' ? (
					<MapName>{mapName}</MapName>
				) : (
					<SingleGrid>
						<FadeText1>{mapName}</FadeText1>
						<FadeText2>{matchScore}</FadeText2>
					</SingleGrid>
				)}
			</SetMap>
		);
	});

	return <Container>{selectedMapsMap}</Container>;
});

SelectedMaps.displayName = 'SelectedMaps';
