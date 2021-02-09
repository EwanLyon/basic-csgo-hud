import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Team } from '../../../types/team-preset';
import { stateType } from '../../replicant-store';

import { FitText, Text as FitTextText } from '../../components/fit-text';

const Text = styled(FitText)`
	& > ${FitTextText} {
	}
`;

const Container = styled.div`
	height: 70px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-direction: ${(props: Both): string => (props.right ? 'row-reverse' : 'row')};
	border: 1px solid ${(props: Both): string => (props.ct ? 'var(--ct-col)' : 'var(--t-col)')};
	border-right: ${(props: Both): string => (props.right ? '' : 'none')};
	border-left: ${(props: Both): string => (props.right ? 'none' : '')};
	background: var(--bg-col);
`;

const Score = styled.span`
	font-size: 64px;
	width: 72px;
	text-align: center;
	color: ${(props: Both): string => (props.ct ? 'var(--ct-col)' : 'var(--t-col)')};
	margin: ${(props: Both): string => (props.right ? '0 39px 0 0' : '0 0 0 39px')};
	height: 72px;
    line-height: 68px;
`;

const SingleGrid = styled.div`
	display: grid;
`;

const TeamName = styled(Text)`
	font-size: 47px;
	max-width: 500px;
	text-transform: uppercase;
	color: ${(props: CTProps) => (props.ct ? 'var(--ct-col)' : 'var(--t-col)')};
	grid-column: 1;
	grid-row: 1;
`;

const TeamLogo = styled.img`
	height: 50px;
	width: auto;
	margin: ${(props: OnRightProps) => (props.right ? '0 22px 0 49px' : '0 49px 0 22px')};
	grid-column: 1;
	grid-row: 1;
`;

const matchWinsSize = 15;
const MatchWinsBox = styled.div`
	height: 100%;
	width: ${matchWinsSize}px;
	margin: 0 15px;
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
`;

const MatchWins = styled.div`
	width: ${matchWinsSize}px;
	height: ${matchWinsSize}px;
	background: ${(props: MatchWin) => (props.win ? (props.ct ? 'var(--ct-col)' : 'var(--t-col)') : '')};
	border: 1px solid ${(props: MatchWin) => (props.ct ? 'var(--ct-col)' : 'var(--t-col)')};
`;

interface MatchWin extends CTProps {
	win?: boolean;
}

interface OnRightProps {
	right?: boolean;
}

interface CTProps {
	ct?: boolean;
}

interface Both extends CTProps, OnRightProps {}

interface Props {
	displayingTeam: Team | undefined;
	oppositeTeam: Team | undefined;
	right?: boolean;
	ct?: boolean;
	score: string;
	matchesWonThisSeries: number;
}

export const Wing: React.FunctionComponent<Props> = React.memo((props: Props) => {
	const matchType = useSelector((state: stateType) => state.currentMatch?.matchType);

	let numberOfBoxes = 0;

	switch (matchType) {
		case 'bo1':
			numberOfBoxes = 1;
			break;
		case 'bo3':
			numberOfBoxes = 2;
			break;
		case 'bo5':
			numberOfBoxes = 3;
			break;
		default:
			break;
	}

	// Fill match boxes
	const matchWinsBoxes: JSX.Element[] = [];
	for (let i = 0; i < numberOfBoxes; i++) {
		matchWinsBoxes.push(<MatchWins key={i} win={props.matchesWonThisSeries >= i + 1} ct={props.ct} />);
	}

	return (
		<Container right={props.right} ct={props.ct}>
			<SingleGrid>
				{/* Super hacky way to get both wings the same width.
				Put an invisible verison of the other team behind it */}
				<TeamLogo src={props.displayingTeam?.logo || ''} right={props.right} />
				<TeamLogo src={props.oppositeTeam?.logo || ''} right={props.right} style={{ opacity: 0 }} />
			</SingleGrid>

			<SingleGrid>
				{/* Super hacky way to get both wings the same width.
				Put an invisible verison of the other team behind it */}
				<TeamName
					style={{ color: 'rgba(0, 0, 0, 0)', textShadow: 'none' }}
					text={props.oppositeTeam?.name || ''}
				/>

				<TeamName ct={props.ct} text={props.displayingTeam?.name || ''} />
			</SingleGrid>

			<Score right={props.right} ct={props.ct}>
				{props.score}
			</Score>
			<MatchWinsBox>{matchWinsBoxes}</MatchWinsBox>
		</Container>
	);
});

Wing.displayName = 'ScoreBugWing';
