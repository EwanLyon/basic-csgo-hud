import React from 'react';

const otherImages = {
	bomb: require('../images/equipment/bomb_white.png'),
	defuse: require('../images/equipment/defuse.png'),
};

interface Props {
	item: keyof typeof otherImages;
	className?: string;
}

export const OtherIcons: React.FunctionComponent<Props> = (props: Props) => {
	return <img className={props.className} src={otherImages[props.item]} />;
};
