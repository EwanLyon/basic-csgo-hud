import React from 'react';

const otherImages = {
	bomb: require('../images/equipment/bomb.svg'),
	defuse: require('../images/equipment/defuser.svg'),
};

interface Props {
	item: keyof typeof otherImages;
	className?: string;
}

export const OtherIcons: React.FunctionComponent<Props> = (props: Props) => {
	return <img className={props.className} src={otherImages[props.item]} />;
};
