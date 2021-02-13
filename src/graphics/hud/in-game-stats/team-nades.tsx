import React, { useEffect, useImperativeHandle, useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { useSelector } from 'react-redux';

import { stateType } from '../../replicant-store';

import { Grid } from '@material-ui/core';
import { Grenades } from '../../components/grenades';
import { ComponentAnimation } from '../../../types/animations';
import { CSGOPhaseCountdowns } from '../../../types/csgo-gsi';

const Container = styled.div`
	position: relative;
	background: var(--bg-col);
	width: 349px;
	height: 50px;
	color: #fff;
	border: 1px solid ${(props: CT): string => (props.ct ? 'var(--ct-col)' : 'var(--t-col)')};
	padding: 5px;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;
`;

const NadeHolder = styled.div`
	width: 50px;
	display: flex;
	justify-content: space-around;
	align-items: flex-end;
`;

const NadeImage = styled(Grenades)`
	height: 30px;
	width: auto;
`;

const NadeText = styled.span`
	display: block;
	font-family: Roboto;
	font-size: 25px;
	font-family: Roboto;
	line-height: 14px;
`;

interface CT {
	ct?: boolean;
}

interface Props {
	phase: CSGOPhaseCountdowns['phase'];
	ct?: boolean;
	right?: boolean;
	style?: React.CSSProperties;
	className?: string;
	teamTwo?: boolean;
}

export const TeamNade = React.forwardRef<ComponentAnimation, Props>((props, ref) => {
	const teamData = useSelector((state: stateType) => (props.teamTwo ? state.teamTwo : state.teamOne));
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
			case 'bomb':
				const tl = gsap.timeline();
				tl.call(show);
				tl.call(hide, [], '+=10');
				break;
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
				justify="space-evenly"
				alignItems="center"
				spacing={4}
				style={{ overflow: 'hidden', flexWrap: 'nowrap' }}>
				<NadeHolder>
					<NadeImage item="hegrenade" />
					<NadeText>
						<span style={{ fontSize: 17 }}>x</span>
						{teamData.grenades.he}
					</NadeText>
				</NadeHolder>
				<NadeHolder>
					<NadeImage item="flashbang" />
					<NadeText>
						<span style={{ fontSize: 17 }}>x</span>
						{teamData.grenades.flash}
					</NadeText>
				</NadeHolder>
				<NadeHolder>
					<NadeImage item="smokegrenade" />
					<NadeText>
						<span style={{ fontSize: 17 }}>x</span>
						{teamData.grenades.smoke}
					</NadeText>
				</NadeHolder>
				<NadeHolder>
					<NadeImage item={props.ct ? 'incgrenade' : 'molotov'} />
					<NadeText>
						<span style={{ fontSize: 17 }}>x</span>
						{teamData.grenades.fire}
					</NadeText>
				</NadeHolder>
			</Grid>
		</Container>
	);
});
