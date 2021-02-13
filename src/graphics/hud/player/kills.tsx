import React from 'react';
import styled from 'styled-components';

const KillsContainer = styled.div`
	margin: 0 2px;
`;

const KillBox = styled.div`
	display: inline-block;
	height: 70px;
	width: 5px;
	margin: 0 2px;
	background-color: ${(props: StyleProps): string =>
		props.ct ? 'var(--t-col)' : 'var(--ct-col)'};
`;

interface StyleProps {
	ct?: boolean;
}

interface Props {
	ct?: boolean;
	killsNumber: number;
}

export const Kills: React.FC<Props> = (props: Props) => {
	const KillBoxes = [];
	for (let i = 0; i < props.killsNumber; i++) {
		KillBoxes.push(<KillBox ct={props.ct} key={i} />);
	}

	return <KillsContainer>{KillBoxes}</KillsContainer>;
};
