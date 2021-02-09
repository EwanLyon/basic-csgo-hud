import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { stateType } from '../../replicant-store';

import * as Weapon from '../../components/weapons';
import { Armour } from '../../components/armour';
import { OtherIcons } from '../../components/other-icons';
import { HealthBar } from './health-bar';
import { Kills } from './kills';

const Container = styled.div`
	display: flex;
	flex-direction: ${(props: StyleProps): string => (props.right ? 'row-reverse' : 'row')};
`;

const PlayerContainer = styled.div`
	background: var(--bg-col);
	width: 349px;
	height: 70px;
	${(props: StyleProps): string => (props.observed ? 'box-shadow: 0 0 0px 4px #fff;' : '')}
`;

const MoneyText = styled.div`
	font-size: 23px;
	min-width: 72px;
	text-align: ${(props: StyleProps) => (props.right ? 'right' : 'left')};
`;

const DollarSign = styled.span`
	font-size: 15px;
`;

const SecondaryWeapon = styled(Weapon.SecondaryWeapon)`
	height: 20px;
	width: auto;
	min-width: 52px;
	object-fit: scale-down;
	margin: 0 10px;
`;

const LowerBar = styled.div`
	height: 32px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: rgba(255, 255, 255, 0.5);
	font-size: 23px;
	line-height: 32px;
	padding: 0 5px;
	flex-direction: ${(props: StyleProps): string => (props.right ? 'row-reverse' : 'row')};
`;

const GrenadeBar = styled.div`
	display: flex;
	align-items: bottom;
	justify-content: center;
	height: 25px;
	max-width: 90px;
	min-width: 90px;
`;

const Grenade = styled(Weapon.Grenades)`
	height: 100%;
	width: auto;
	margin: 0 4px;
`;

const ArmourBombDefuseSize = `
	height: auto;
	width: 16px;
	margin: 0 2px;
`;

const ArmourImg = styled(Armour)`
	${ArmourBombDefuseSize}
`;

const BombDefuseImg = styled(OtherIcons)`
	${ArmourBombDefuseSize}
`;

const EmptySpace = styled.div`
	${ArmourBombDefuseSize}
`;

interface Props {
	right?: boolean;
	steamId: string;
}

interface StyleProps {
	observed?: boolean;
	right?: boolean;
	ct?: boolean;
}

export const Player: React.FunctionComponent<Props> = React.memo((props: Props) => {
	const player = useSelector((state: stateType) => state.game.allplayers[props.steamId]);
	const obsPlayerId = useSelector((state: stateType) => state.observingPlayer.steamid);
	const bombId = useSelector((state: stateType) => state.bomb?.player);

	if (!player) return <></>;

	const observed = obsPlayerId === props.steamId;
	const carryingBomb = bombId === props.steamId;
	const isCT = player.team === 'CT';
	const weapons = Object.values(player.weapons);

	const grenadeList = weapons
		.filter((weapon) => {
			if (weapon.type === 'Grenade') return weapon;
			return;
		})
		.map((grenade, index) => {
			return (
				<Grenade
					item={grenade.name.replace('weapon_', '') as Weapon.GrenadeList}
					active={grenade.state === 'active'}
					key={index}
				/>
			);
		});

	const primaryWeapon = weapons.find((weapon) => {
		switch (weapon.type) {
			case 'C4':
			case 'Grenade':
			case 'Knife':
			case 'Pistol':
				return undefined;

			default:
				return weapon;
		}
	});

	const secondaryWeapon = weapons.find((weapon) => {
		if (weapon.type === 'Pistol') return weapon;
		return;
	});

	return (
		<Container right={props.right}>
			<PlayerContainer right={props.right} observed={observed} ct={isCT}>
				<HealthBar
					playerData={player}
					right={props.right}
					ct={isCT}
					observed={observed}
					primaryWeapon={primaryWeapon}
				/>

				<LowerBar right={props.right}>
					<MoneyText>
						<DollarSign>$</DollarSign>
						{player.state.money}
					</MoneyText>

					<div style={{ display: 'flex', justifyContent: 'center', minWidth: 50 }}>
						{player.state.armor && <ArmourImg helmet={player.state.helmet} />}
						{isCT ? (
							player.state.defusekit ? (
								<BombDefuseImg item="defuse" />
							) : (
								<EmptySpace />
							)
						) : (
							carryingBomb && <BombDefuseImg item="bomb" />
						)}
					</div>

					<GrenadeBar>{grenadeList}</GrenadeBar>
					{secondaryWeapon && (
						<SecondaryWeapon
							active={secondaryWeapon.state === 'active'}
							flip={props.right}
							item={secondaryWeapon.name.replace('weapon_', '') as Weapon.SecondaryWeaponList}
						/>
					)}
				</LowerBar>
			</PlayerContainer>
			<Kills killsNumber={player.state.round_kills} ct={isCT} />
		</Container>
	);
});

Player.displayName = 'Player';