import React from 'react';

const armourImages = {
	helmet: require('../images/equipment/ArmourHelmet.svg'),
	normal: require('../images/equipment/Armour.svg'),
};

interface Props {
	helmet?: boolean;
	className?: string;
}

export const Armour: React.FunctionComponent<Props> = (props: Props) => {
	return <img className={props.className} src={props.helmet ? armourImages.helmet : armourImages.normal} />;
};
