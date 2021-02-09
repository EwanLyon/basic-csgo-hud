import React from 'react';

export const grenadeImages = {
	flashbang: require('../images/grenades/flashbang.svg'),
	decoy: require('../images/grenades/decoy.svg'),
	hegrenade: require('../images/grenades/hegrenade.svg'),
	incgrenade: require('../images/grenades/incgrenade.svg'),
	molotov: require('../images/grenades/molotov.svg'),
	smokegrenade: require('../images/grenades/smokegrenade.svg'),
};

interface Props {
	item: keyof typeof grenadeImages;
	active?: boolean;
	className?: string;
}

export type GrenadeList = keyof typeof grenadeImages;

export const Grenades: React.FunctionComponent<Props> = (props: Props) => {
	return (
		<img
			className={props.className}
			style={{
				opacity: props.active ? '1' : '0.7',
			}}
			src={grenadeImages[props.item]}
		/>
	);
};
