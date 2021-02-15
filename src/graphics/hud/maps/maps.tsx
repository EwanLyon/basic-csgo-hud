import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { stateType } from '../../replicant-store';

import { Map } from './map';

const MapsContainer = styled.div`
	display: flex;
	flex-direction: column;
	/* height: 300px; */
	/* width: 400px; */
	background: var(--bg-col);
	color: white;
`;

const Titles = styled.div`
	display: flex;
	font-weight: bold;
	padding: 5px 0;

	& > span {
		width: 60px;
		text-align: center;
	}
`;

interface Props {
	className?: string;
	style?: React.CSSProperties;
}

export const Maps: React.FC<Props> = (props: Props) => {
	const currentMatch = useSelector((state: stateType) => state.currentMatch);

	if (!currentMatch) return <></>;

	const pickedMaps = currentMatch.maps.filter((map) => !map.ban);
	const mapEls = pickedMaps.map((map) => <Map key={map.map} matchData={currentMatch} map={map} />);

	return (
		<MapsContainer className={props.className} style={props.style}>
			<Titles>
				<div style={{width: 100}} />
				<span>Picked</span>
				<span>Winner</span>
				<span>Score</span>
			</Titles>
			{mapEls}
		</MapsContainer>
	);
};
