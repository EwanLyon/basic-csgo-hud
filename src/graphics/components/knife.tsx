/* eslint-disable camelcase */
import React from 'react';

export const secondaryWeaponImages = {
	knife: require('../images/weapons/knife.svg'),
	knife_bowie: require('../images/weapons/knife_bowie.svg'),
	knife_butterfly: require('../images/weapons/knife_butterfly.svg'),
	knife_canis: require('../images/weapons/knife_canis.svg'),
	knife_cord: require('../images/weapons/knife_cord.svg'),
	knife_css: require('../images/weapons/knife_css.svg'),
	knife_falchion: require('../images/weapons/knife_falchion.svg'),
	knife_flip: require('../images/weapons/knife_flip.svg'),
	knife_gut: require('../images/weapons/knife_gut.svg'),
	knife_gypsy_jackknife: require('../images/weapons/knife_gypsy_jackknife.svg'),
	knife_karambit: require('../images/weapons/knife_karambit.svg'),
	knife_m9_bayonet: require('../images/weapons/knife_m9_bayonet.svg'),
	knife_outdoor: require('../images/weapons/knife_outdoor.svg'),
	knife_shadow_dagger: require('../images/weapons/knife_shadow_dagger.svg'),
	knife_skeleton: require('../images/weapons/knife_skeleton.svg'),
	knife_stiletto: require('../images/weapons/knife_stiletto.svg'),
	knife_survival_bowie: require('../images/weapons/knife_survival_bowie.svg'),
	knife_t: require('../images/weapons/knife_t.svg'),
	knife_tactical: require('../images/weapons/knife_tactical.svg'),
	knife_ursus: require('../images/weapons/knife_ursus.svg'),
	knife_widowmaker: require('../images/weapons/knife_widowmaker.svg'),
	knifegg: require('../images/weapons/knife_gg.svg'),
};

interface Props {
	item: keyof typeof secondaryWeaponImages;
	active?: boolean;
	flip?: boolean;
	className?: string;
	style?: React.CSSProperties;
}

export type SecondaryWeaponList = keyof typeof secondaryWeaponImages;

export const SecondaryWeapon: React.FunctionComponent<Props> = (props: Props) => {
	return (
		<img
			className={props.className}
			style={Object.assign(
				{
					transform: props.flip ? 'scaleX(-1)' : '',
					opacity: props.active ? '1' : '0.7',
				},
				props.style,
			)}
			src={secondaryWeaponImages[props.item]}
		/>
	);
};
