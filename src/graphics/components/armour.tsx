import React from 'react';

const armourImages = {
	helmet: require('../images/equipment/armour_helmet.svg'),
	normal: require('../images/equipment/armour.svg'),
};

interface Props {
	helmet?: boolean;
	className?: string;
}

export const Armour: React.FunctionComponent<Props> = (props: Props) => {
	return (
		<img
			className={props.className}
			src={props.helmet ? armourImages.helmet : armourImages.normal}
		/>
	);
};
