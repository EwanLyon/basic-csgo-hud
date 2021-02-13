import React, { useEffect, useImperativeHandle, useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { useSelector } from 'react-redux';

import { stateType } from '../../replicant-store';
import { ComponentAnimation } from '../../../types/animations';

import { Grid } from '@material-ui/core';
import { CSGO } from '../../../types/nodecg-csgo-manager';

const Container = styled.div`
	position: relative;
	background: var(--bg-col);
	width: 349px;
	height: 70px;
	color: #fff;
	border: 1px solid ${(props: CT): string => (props.ct ? 'var(--ct-col)' : 'var(--t-col)')};
	padding: 5px;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;
`;

const TitleText = styled.span`
	color: #ddd;
	font-size: 15px;
	white-space: nowrap;
`;

const MoneyText = styled.span`
	display: block;
	font-size: 25px;
	margin-top: -6px;
`;

const LossContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	height: 100%;
`;

// So the flex spacing has an offset for the loss container
const EmptyContainer = styled.div`
	width: 3px;
`;

const LossBonusBox = styled.div`
	width: 15px;
	height: 15px;
	background: ${(props: LossBonusBoxProps): string =>
		props.active ? (props.ct ? 'var(--ct-col)' : 'var(--t-col)') : '#252525'};
`;

interface LossBonusBoxProps extends CT {
	active?: boolean;
}

interface CT {
	ct?: boolean;
}

interface Props {
	phase: CSGO.CSGOPhaseCountdowns['phase'];
	ct?: boolean;
	right?: boolean;
	style?: React.CSSProperties;
	className?: string;
	teamTwo?: boolean;
}

export const TeamEco = React.forwardRef<ComponentAnimation, Props>((props, ref) => {
	const teamData = useSelector((state: stateType) =>
		props.teamTwo ? state.teamTwo : state.teamOne,
	);
	const containerRef = useRef<HTMLDivElement>(null);

	useImperativeHandle(ref, () => ({
		show() {
			show();
		},
		hide() {
			hide();
		},
	}));

	useEffect(() => {
		switch (props.phase) {
			case 'freezetime':
				show();
				break;
			default:
				hide();
				break;
		}
	}, [props.phase]);

	function show() {
		const tl = gsap.timeline();
		tl.to(containerRef.current, { opacity: 1, duration: 0.5 });
		tl.to(containerRef.current, {
			ease: 'expo.out',
			width: 337,
			paddingLeft: 5,
			paddingRight: 5,
			duration: 1,
		});
	}

	function hide() {
		const tl = gsap.timeline();
		tl.to(containerRef.current, {
			ease: 'expo.out',
			width: 0,
			paddingLeft: 0,
			paddingRight: 0,
			duration: 1,
		});
		tl.to(containerRef.current, { opacity: 0, duration: 0.5 });
	}

	return (
		<Container ct={props.ct} style={props.style} className={props.className} ref={containerRef}>
			<Grid
				container
				direction={props.right ? 'row-reverse' : 'row'}
				justify="space-between"
				alignItems="center"
				style={{ overflow: 'hidden', flexWrap: 'nowrap', height: '100%' }}>
				<LossContainer>
					<LossBonusBox active={teamData.consecutiveRoundLosses >= 4} ct={props.ct} />
					<LossBonusBox active={teamData.consecutiveRoundLosses >= 3} ct={props.ct} />
					<LossBonusBox active={teamData.consecutiveRoundLosses >= 2} ct={props.ct} />
					<LossBonusBox active={teamData.consecutiveRoundLosses >= 1} ct={props.ct} />
				</LossContainer>
				<Grid item style={{ textAlign: props.right ? 'right' : 'left' }}>
					<TitleText>Loss Bonus</TitleText>
					<MoneyText>
						<span style={{ fontSize: 15 }}>$</span>
						{Math.max(teamData.consecutiveRoundLosses * 500 + 1400)}
					</MoneyText>
				</Grid>
				<Grid item style={{ textAlign: props.right ? 'right' : 'left' }}>
					<TitleText>Team Money</TitleText>
					<MoneyText>
						<span style={{ fontSize: 15 }}>$</span>
						{teamData.totalMoney}
					</MoneyText>
				</Grid>
				<Grid item style={{ textAlign: props.right ? 'right' : 'left' }}>
					<TitleText>Equipment Value</TitleText>
					<MoneyText>
						<span style={{ fontSize: 15 }}>$</span>
						{teamData.equipmentValue}
					</MoneyText>
				</Grid>
				<EmptyContainer />
			</Grid>
		</Container>
	);
});

TeamEco.displayName = 'TeamEco';
