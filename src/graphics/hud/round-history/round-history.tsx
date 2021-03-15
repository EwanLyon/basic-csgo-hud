import React, { useImperativeHandle, useRef } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import gsap from 'gsap';

import { ComponentAnimation } from '../../../types/animations';

import { stateType } from '../../replicant-store';
import { RoundIcon } from './round-icon';

const RoundHistoryContainer = styled.div`
	display: flex;
	align-items: center;
	background: var(--bg-col);
	height: 50px;
	padding: 10px;
	border: 1px solid white;
	opacity: 0;
	transform: translate(0, -50px);
`;

const HalfDivider = styled.div`
	width: 3px;
	height: 100%;
	background: rgba(255, 255, 255, 0.5);
`;

interface Props {
	simple?: boolean;
	style?: React.CSSProperties;
	className?: string;
}

export const RoundHistory = React.forwardRef<ComponentAnimation, Props>((props, ref) => {
	const roundWins = useSelector((state: stateType) => state.matchStats.round_wins);
	const currentRound = useSelector((state: stateType) => state.matchStats.round);
	const containerRef = useRef<HTMLDivElement>(null);

	useImperativeHandle(ref, () => ({
		show: () => {
			gsap.to(containerRef.current, { y: 0, opacity: 1, duration: 1 });
		},
		hide: () => {
			gsap.to(containerRef.current, { y: -50, opacity: 0, duration: 1 });
		},
	}));

	const roundIcons = [];

	for (let i = 1; i < 31; i++) {
		if (roundWins && roundWins[i]) {
			roundIcons.push(
				<RoundIcon
					currentRound={currentRound + 1}
					round={i}
					wintype={roundWins[i]}
					key={i}
					simple={props.simple}
				/>,
			);
		} else {
			roundIcons.push(<RoundIcon currentRound={currentRound + 1} round={i} wintype={'empty'} key={i} />);
		}

		if (i === 15) roundIcons.push(<HalfDivider key={i + 'hd'} />);
	}

	return (
		<RoundHistoryContainer className={props.className} style={props.style} ref={containerRef}>
			{roundIcons}
		</RoundHistoryContainer>
	);
});

RoundHistory.displayName = 'RoundHistory';
