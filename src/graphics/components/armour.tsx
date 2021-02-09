import React from 'react';

const armourImages = {
	helmet: require('../images/equipment/ArmourHelmet.svg'),
	normal: require('../images/equipment/Armour.svg'),
};

interface Props {
	item: keyof typeof armourImages;
	className?: string;
}

export const Armour: React.FunctionComponent<Props> = (props: Props) => {
	return <img className={props.className} src={armourImages[props.item]} />;
};
