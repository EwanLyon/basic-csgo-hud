import React from 'react';
import styled from 'styled-components';

import { CSGO } from '../../../types/nodecg-csgo-manager';

import { FitText, Text as FitTextText } from '../../components/fit-text';
import { ProgressBarBox } from '../../components/progress-bar-box';
import * as Weapon from '../../components/weapons';
// import { Weapon as CSGOWeapon } from '../../../types/csgo-gsi';

const HealthBarContainer = styled.div`
	position: relative;
`;

const PlayerName = styled(FitText)`
	justify-content: ${(props: StyleProps): string =>
		props.right ? 'flex-end' : 'flex-start'} !important;
	color: ${(props: StyleProps): string => (props.dead ? 'rgba(255, 255, 255, 0.7)' : '#FFF')};
	font-size: 25px;
	line-height: 38px;
	min-width: 150px;
	max-width: 150px;

	& > ${FitTextText} {
		transform-origin: ${(props: StyleProps): string => (props.right ? 'right' : 'left')};
	}
`;

const HealthText = styled.span`
	text-align: center;
	width: 37px;
	font-size: 21px;
	color: #dadada;
	margin: 0 10px;
	font-weight: bold;
	z-index: 2;
`;

const HealthBarDynamic = styled(ProgressBarBox)`
	height: 38px;
	width: 100%;
	position: absolute;
`;

const HealthBarOverlay = styled.div`
	display: flex;
	flex-direction: ${(props: StyleProps): string => (props.right ? 'row-reverse' : 'row')};
	justify-content: space-between;
	align-items: center;
`;

// This makes the weapon stay at the end of the health bar as scale down centres the image
const WeaponContainer = styled.div`
	width: 142px;
`;

const MainWeapon = styled(Weapon.PrimaryWeapon)`
	height: 30px;
	padding: 0 10px;
	object-fit: scale-down;
	float: ${(props: StyleProps): string => (props.right ? 'left' : 'right')};
`;

interface StyleProps {
	right?: boolean;
	active?: boolean;
	dead?: boolean;
	observed?: boolean;
}

interface Props {
	right?: boolean;
	playerData: CSGO.CSGOAllplayer;
	ct?: boolean;
	observed?: boolean;
	primaryWeapon?: CSGO.Weapon | undefined;
}

export const HealthBar: React.FC<Props> = (props: Props) => {
	const dead = props.playerData.state.health <= 0;

	const healthBarColour: React.CSSProperties = {
		background: props.ct ? 'var(--ct-col)' : 'var(--t-col)',
	};
	return (
		<HealthBarContainer>
			<HealthBarDynamic
				progressBarStyle={healthBarColour}
				right={props.right}
				progress={props.playerData.state.health}
			/>
			<HealthBarOverlay right={props.right}>
				<HealthText>{props.playerData.state.health}</HealthText>
				<PlayerName
					right={props.right}
					text={props.playerData.name}
					dead={dead}
					observed={props.observed}
				/>

				<WeaponContainer>
					{props.primaryWeapon && (
						<MainWeapon
							active={props.primaryWeapon.state === 'active'}
							flip={props.right}
							right={props.right}
							item={
								props.primaryWeapon.name.replace(
									'weapon_',
									'',
								) as Weapon.PrimaryWeaponList
							}
						/>
					)}
				</WeaponContainer>
			</HealthBarOverlay>
		</HealthBarContainer>
	);
};
