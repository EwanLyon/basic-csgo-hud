import React from 'react';
import styled from 'styled-components';
import CSGOManager from '../../../types/nodecg-csgo-manager';

const DeadInfoContainer = styled.div`
	display: flex;
`;

const StatContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
	color: rgba(255, 255, 255, 0.7);
	width: 25px;
	margin: 0 3px;
`;

const Title = styled.span`
	font-weight: 300;
	font-size: 15px;
`;

const Stat = styled.span`
	font-size: 22px;
`;

interface Props {
	matchStats: CSGOManager.CSGO.MatchStats;
	className?: string;
	style?: React.CSSProperties;
}

export const DeadInfo: React.FC<Props> = (props: Props) => {
	return (
		<DeadInfoContainer className={props.className} style={props.style}>
			<StatContainer>
				<Title>K</Title>
				<Stat>{props.matchStats.kills}</Stat>
			</StatContainer>
			<StatContainer>
				<Title>A</Title>
				<Stat>{props.matchStats.assists}</Stat>
			</StatContainer>
			<StatContainer>
				<Title>D</Title>
				<Stat>{props.matchStats.deaths}</Stat>
			</StatContainer>
		</DeadInfoContainer>
	);
};
