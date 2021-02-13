import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import gsap from 'gsap';

import { stateType } from '../../replicant-store';

import { CSGOBomb } from '../../../types/csgo-gsi';

const Container = styled.div`
	width: 654px;
	height: 50px;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 1px solid #eebe11;
	background: rgba(0, 0, 0, 0.5);
	opacity: 0;
	transform: translate(0, -50px);
`;

const ProgressContainer = styled.div`
	width: 630px;
	height: 22px;
	position: relative;
`;

const PlantProgress = styled.div`
	position: absolute;
	left: 0;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
`;

const BombProgress = styled.div`
	position: absolute;
	left: 0;
	height: 100%;
	background: linear-gradient(to left, #f46666, rgba(244, 102, 102, 0.3) 50%);
`;

const DefuseProgress = styled.div`
	position: absolute;
	left: 0;
	height: 100%;
	background: linear-gradient(to left, #0c7bc0, rgba(12, 123, 192, 0.3) 70%);
`;

const PlayerText = styled.span`
	color: #fff;
	position: absolute;
	left: ${(props: HasKit): string => (props.kit ? '38' : '16')}px;
	top: 15.7px;
	z-index: 2;
`;

const TenSecondMark = styled.div`
	position: absolute;
	top: 12px;
	left: ${(630 / 40) * (40 - 10)}px;
	height: 26px;
	width: 3px;
	background-color: #fff;
`;

const KitImage = styled.img`
	position: absolute;
	left: 16px;
	top: 18px;
	width: 16px;
	height: auto;
	z-index: 1;
`;

interface HasKit {
	kit?: boolean;
}

interface Props {
	bomb: CSGOBomb;
	playerName: string;
	className?: string;
	kit?: boolean;
	ref?: React.Ref<HTMLDivElement>;
	style?: React.CSSProperties;
}

const playerConditions = ['planting', 'defusing'];

export const BombPlanted: React.FC<Props> = (props) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const plantRef = useRef<HTMLDivElement>(null);
	const bombRef = useRef<HTMLDivElement>(null);
	const defuseRef = useRef<HTMLDivElement>(null);
	const gameSettings = useSelector((state: stateType) => state.gameSettings);

	useEffect(() => {
		switch (props.bomb.state) {
			case 'planting':
				gsap.to(containerRef.current, { y: 0, duration: 1, opacity: 1 });	// Show element
				gsap.to(plantRef.current, { width: '100%', duration: gameSettings.bombPlantTime, ease: 'none' });
				break;

			case 'planted':
				gsap.to(bombRef.current, { width: '100%', duration: gameSettings.bombTime, ease: 'none' });
				break;

			case 'defusing': {
				gsap.to(defuseRef.current, {
					width: '100%',
					duration: props.kit ? gameSettings.kitDefusedTime : gameSettings.noKitDefuseTime,
					ease: 'none'
				});
				break;
			}
			case 'exploded':
			case 'defused':
			case 'carried':
				gsap.killTweensOf([bombRef.current, plantRef.current, defuseRef.current]);	// Stop all animations
				gsap.set([bombRef.current, plantRef.current, defuseRef.current], { width: '0%' });	// Reset all animations
				gsap.to(containerRef.current, { y: -50, duration: 1, opacity: 0 });	// Hide element
				break;
			default:
				break;
		}
	}, [props.bomb.state]);

	return (
		<Container className={props.className} ref={containerRef} style={props.style}>
			<ProgressContainer>
				<PlantProgress ref={plantRef} />
				<BombProgress ref={bombRef} />
				<DefuseProgress ref={defuseRef} />
			</ProgressContainer>
			<KitImage
				src={require('../../images/equipment/defuser.svg')}
				style={{ display: props.kit ? '' : 'none' }}
			/>
			<PlayerText kit={props.kit}>
				{playerConditions.includes(props.bomb.state)
					? `${props.playerName} ${props.bomb.state === 'defusing' ? 'is defusing' : 'is planting'}`
					: ''}
			</PlayerText>
			{props.bomb.state === 'planted' || props.bomb.state === 'defusing' ? <TenSecondMark /> : ''}
		</Container>
	);
};

BombPlanted.displayName = 'BombPlanted';
