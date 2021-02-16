import React from 'react';
import styled from 'styled-components';

import { OtherIcons } from '../../components/other-icons'; // Defuse, BombExplode

const RoundIconContainer = styled.div`
	height: 100%;
	width: 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	margin: 0 2px;
`;

const SizedIcon = styled(OtherIcons)`
	width: 100%;
	height: 20px;
	object-fit: contain;
	filter: ${(props: StyleProps) =>
		props.ct ? 'var(--ct-col-filter)' : 'brightness(0) saturate(100%) var(--t-col-filter)'};
`;

const SimpleIcon = styled.div`
	width: 15px;
	height: 15px;
	border-radius: 50%;
	background: ${(props: StyleProps) => (props.ct ? 'var(--ct-col)' : 'var(--t-col)')};
`;

const EmptySpace = styled.div`
	height: 20px;
	width: 15px;
`;

const RoundNumber = styled.span`
	color: white;
	visibility: ${(props: StyleProps) => (props.active ? 'visible' : 'hidden')};
`;

const RoundBorder = styled.div`
	width: 100%;
	height: 3px;
	background: ${(props: StyleProps) => (props.active ? '#ffffff' : 'rgba(255, 255, 255, 0.5)')};
	margin: 2px 0;
`;

interface StyleProps {
	ct?: boolean;
	top?: boolean;
	active?: boolean;
}

interface Props {
	wintype: string;
	round: number;
	currentRound: number;
	simple?: boolean;
	style?: React.CSSProperties;
	className?: string;
}

export const RoundIcon: React.FC<Props> = (props) => {
	let icon = <EmptySpace />;
	const ct = props.wintype.charAt(0) === 'c';
	// Const firstHalf = props.round <= 15;

	switch (props.wintype) {
		case 't_win_elimination':
			icon = <SizedIcon item="skull" />;
			break;
		case 't_win_bomb':
			icon = <SizedIcon item="bombExplode" />;
			break;
		case 'ct_win_elimination':
			icon = <SizedIcon ct item="skull" />;
			break;
		case 'ct_win_defuse':
			icon = <SizedIcon ct item="defuse" />;
			break;
		case 't_win_time':
			icon = <SizedIcon ct item="timeExpire" />;
			break;

		case 'empty':
		default:
			break;
	}

	if (props.simple) {
		icon = ct ? <SimpleIcon ct /> : <SimpleIcon />;
	}

	return (
		<RoundIconContainer className={props.className} style={props.style}>
			{icon}
			<RoundBorder active={props.round === props.currentRound} />
			<RoundNumber active={props.round % 5 === 0 || props.round === 1}>{props.round}</RoundNumber>
		</RoundIconContainer>
	);
};
