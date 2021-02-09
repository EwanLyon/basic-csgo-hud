/* eslint-disable camelcase */
import React from 'react';

export const MapRawImages = {
	de_dust2: require('../images/maps/de_dust2.png'),
	de_inferno: require('../images/maps/de_inferno.png'),
	de_nuke: require('../images/maps/de_nuke.png'),
	de_nuke_lower: require('../images/maps/de_nuke_lower.png'),
	de_mirage: require('../images/maps/de_mirage.png'),
	de_cache: require('../images/maps/de_cache.png'),
	de_overpass: require('../images/maps/de_overpass.png'),
	de_train: require('../images/maps/de_train.png'),
	de_vertigo: require('../images/maps/de_vertigo.png'),
	de_vertigo_lower: require('../images/maps/de_vertigo_lower.png'),
};

interface Props {
	map: keyof typeof MapRawImages;
	className?: string;
}

export type MapList = keyof typeof MapRawImages;

export const MapImages: React.FC<Props> = (props: Props) => {
	return <img className={props.className} src={MapRawImages[props.map]} />;
};
