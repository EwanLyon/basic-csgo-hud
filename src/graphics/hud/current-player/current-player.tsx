import React, { useState } from 'react';
import styled from 'styled-components';

import { StatsText } from './stats-text';
// Import { ProfilePicture } from './profile-picture';
import { HealthBar } from './health-bar';
import { GrenadesBox } from './grenades-box';
import { WeaponsBox } from './weapons-box';
// Import { CSGOOutputPlayer, Weapon, MatchStats } from '../../../../types/csgo-gsi';
// import { PlayerDataAll } from '../../../../types/extra-data';
import { GrenadeList } from '../../components/grenades';
import { ProfilePicture } from './profile-picture';
import { useSelector } from 'react-redux';
import { stateType } from '../../replicant-store';

const Container = styled.div`
	width: 743px;
	color: white;
`;

const TopBar = styled.div`
	display: flex;
	align-items: flex-end;
`;

const BottomBar = styled.div`
	height: 70px;
	width: 100%;
	display: flex;
	justify-content: space-between;
`;

const InfoBox = styled.div`
	background-color: rgba(0, 0, 0, 0.32);
`;

const StatsBox = styled(InfoBox)`
	width: 200px;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: space-around;
	background: rgba(0, 0, 0, 0.32);
`;

interface Props {
	className?: string;
}

export const CurrentPlayer: React.FunctionComponent<Props> = React.memo((props: Props) => {
	const curPlayer = useSelector((state: stateType) => state.observingPlayer);
	const extraData = useSelector((state: stateType) => state.playerData);
	const allPlayers = useSelector((state: stateType) => state.allPlayers);
	const [hadArmour, setHadArmour] = useState(false);
	const [currentSteamID, setCurrentSteamID] = useState('0');

	if (!curPlayer) return <></>;

	const observedPlayerAllPlayers = allPlayers.find(
		(player) =>
			// Find player object
			// If player is spectating then they wont have an observer slot field
			player.steamId === curPlayer.steamid && typeof player.observer_slot === 'number',
	);

	if (!observedPlayerAllPlayers) return <></>;

	const playerStats = observedPlayerAllPlayers.match_stats;
	const playerWeapons = Object.values(observedPlayerAllPlayers.weapons);

	const currentExtraDataPlayer = extraData[curPlayer.steamid];

	const grenadeWeaponList = playerWeapons.filter((weapon) => {
		if (weapon.type === 'Grenade') return weapon;
		return undefined;
	});

	const justGrenadeNames = grenadeWeaponList.map((weapon) => {
		return weapon.name.replace('weapon_', '') as GrenadeList;
	});

	const primaryWeapon = playerWeapons.find((weapon) => {
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

	const secondaryWeapon = playerWeapons.find((weapon) => {
		if (weapon.type === 'Pistol') return weapon;
		return undefined;
	});

	// Prevents name and health from moving down when player runs out of armour, just removes a moving part
	if (curPlayer.steamid !== currentSteamID) {
		setCurrentSteamID(curPlayer.steamid);
		if (curPlayer.state.armor === 0) {
			setHadArmour(false);
		} else {
			setHadArmour(true);
		}
	} else if (!hadArmour && curPlayer.state.armor !== 0) {
		setHadArmour(true);
	}

	return (
		<Container className={props.className}>
			<TopBar>
				{currentExtraDataPlayer?.image && (
					<ProfilePicture
						country={currentExtraDataPlayer.country}
						url={currentExtraDataPlayer.image}
					/>
				)}
				<HealthBar
					health={curPlayer.state.health}
					armour={curPlayer.state.armor}
					helmet={curPlayer.state.helmet}
					player={curPlayer.name}
					ct={curPlayer.team === 'CT'}
					nonCenterText={hadArmour}
					realName={currentExtraDataPlayer?.name}
					country={currentExtraDataPlayer?.image ? '' : currentExtraDataPlayer?.country}
				/>
			</TopBar>
			<BottomBar>
				<StatsBox
					style={{
						border:
							curPlayer.team === 'CT'
								? '1px solid var(--ct-col)'
								: '1px solid var(--t-col)',
						borderTop: 'none',
					}}>
					<StatsText text="K" stat={playerStats.kills} />
					<StatsText text="D" stat={playerStats.deaths} />
					<StatsText text="A" stat={playerStats.assists} />
					<StatsText text="ADR" stat={~~currentExtraDataPlayer?.adr || 0} />
				</StatsBox>
				<GrenadesBox
					grenades={justGrenadeNames}
					style={{
						border:
							curPlayer.team === 'CT'
								? '1px solid var(--ct-col)'
								: '1px solid var(--t-col)',
						borderTop: 'none',
					}}
				/>
				<WeaponsBox
					kills={curPlayer.state.round_kills}
					primCur={primaryWeapon?.ammo_clip}
					secCur={secondaryWeapon?.ammo_clip}
					primMax={primaryWeapon?.ammo_reserve}
					secMax={secondaryWeapon?.ammo_reserve}
					primPossible={primaryWeapon?.ammo_clip_max}
					secPossible={secondaryWeapon?.ammo_clip_max}
					ct={curPlayer.team !== 'CT'}
				/>
			</BottomBar>
		</Container>
	);
});

CurrentPlayer.displayName = 'CurrentPlayer';
