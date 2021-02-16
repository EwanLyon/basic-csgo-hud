import React, { useImperativeHandle, useRef } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import gsap from 'gsap';

import { ComponentAnimation } from '../../../types/animations';
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

export const Maps = React.forwardRef<ComponentAnimation, Props>((props, ref) => {
	const containerRef = useRef<HTMLDivElement>(null);
	
	useImperativeHandle(ref, () => ({
		show: () => {
			gsap.to(containerRef.current, { opacity: 1, duration: 1 });
		},
		hide: () => {
			gsap.to(containerRef.current, { opacity: 0, duration: 1 });
		},
	}));
	const currentMatch = useSelector((state: stateType) => state.currentMatch);

	if (!currentMatch || currentMatch.maps.length === 0) return <></>;

	const pickedMaps = currentMatch.maps.filter((map) => !map.ban);
	const mapEls = pickedMaps.map((map) => <Map key={map.map} matchData={currentMatch} map={map} />);

	return (
		<MapsContainer ref={containerRef} className={props.className} style={props.style}>
			<Titles>
				<div style={{width: 100}} />
				<span>Picked</span>
				<span>Winner</span>
				<span>Score</span>
			</Titles>
			{mapEls}
		</MapsContainer>
	);
});
