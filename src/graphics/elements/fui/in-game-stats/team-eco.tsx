import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Grid } from '@material-ui/core';
import gsap from 'gsap';
import { useSelector } from 'react-redux';
import { stateType } from '../../../replicant-store';

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
	font-size: 18px;
	white-space: nowrap;
`;

const MoneyText = styled.span`
	display: block;
	font-size: 30px;
	margin-top: -6px;
`;

interface CT {
	ct?: boolean;
}

interface Props {
	ct?: boolean;
	right?: boolean;
	style?: React.CSSProperties;
	className?: string;
	show?: boolean;
	teamTwo?: boolean;
}

export const TeamEco: React.FC<Props> = (props: Props) => {
	const teamData = useSelector((state: stateType) =>
		props.teamTwo ? state.teamTwo : state.teamOne,
	);
	const tl = useRef<gsap.core.Timeline>();
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		tl.current = gsap.timeline({ paused: true });

		// Console.log('Initialising InGameStat animation');

		tl.current.addLabel('Show');

		tl.current.set(containerRef.current, {
			opacity: 0,
			width: 0,
			paddingLeft: 0,
			paddingRight: 0,
		});
		tl.current.to(containerRef.current, 0.5, { opacity: 1 });
		tl.current.to(containerRef.current, 1, {
			ease: 'expo.out',
			width: 349,
			paddingLeft: 5,
			paddingRight: 5,
		});

		tl.current.addPause('+=0.1');

		tl.current.addLabel('Hide');

		tl.current.set(containerRef.current, {
			opacity: 1,
			width: 349,
			paddingLeft: 5,
			paddingRight: 5,
		});
		tl.current.to(containerRef.current, 1, {
			ease: 'expo.out',
			width: 0,
			paddingLeft: 0,
			paddingRight: 0,
		});
		tl.current.to(containerRef.current, 0.5, { opacity: 0 });
	}, []);

	const goToAnimation = (stage: string): void => {
		if (tl && tl.current) {
			const currentTime = tl.current.time();
			const labelTime = tl.current.labels[stage];
			// Console.log('current time', currentTime);

			tl.current.resume();
			if (currentTime >= labelTime) {
				// Console.log('jumping to ' + stage, labelTime);
				tl.current.play(labelTime);
			} else {
				// Console.log('tweening to ' + stage, labelTime);
				gsap.to(tl.current, {
					duration: 0.3,
					time: labelTime,
					ease: 'none',
					onComplete: () => {
						if (tl && tl.current) {
							tl.current.resume();
						}
					},
				});
			}
		}
	};

	useEffect(() => {
		if (props.show) {
			goToAnimation('Show');
		} else {
			goToAnimation('Hide');
		}
	}, [props.show]);

	return (
		<Container ct={props.ct} style={props.style} className={props.className} ref={containerRef}>
			<Grid
				container
				direction={props.right ? 'row-reverse' : 'row'}
				justify="center"
				alignItems="center"
				spacing={4}
				style={{ overflow: 'hidden', flexWrap: 'nowrap' }}>
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
			</Grid>
		</Container>
	);
};
