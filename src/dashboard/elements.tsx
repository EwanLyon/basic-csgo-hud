import React from 'react';
import { render } from 'react-dom';

// React imports
import { theme } from './theme';
import { ButtonGroup, Grid } from '@material-ui/core';
import { GreenButton, RedButton } from './styled-ui';
import { ThemeProvider } from '@material-ui/styles';


export const Elements: React.FunctionComponent = () => {
	function showElement(elementName: string) {
		console.log('Showing ' + elementName);
		nodecg.sendMessage('basicShow', elementName);
	}

	function hideElement(elementName: string) {
		console.log('Hiding ' + elementName);
		nodecg.sendMessage('basicHide', elementName);
	}

	return (
		<ThemeProvider theme={theme}>
			<Grid container>
				<ButtonGroup fullWidth style={{ marginBottom: 8 }}>
					<GreenButton variant="contained" onClick={() => showElement('teamEco')}>Team Eco</GreenButton>
					<RedButton variant="contained" onClick={() => hideElement('teamEco')}>Team Eco</RedButton>
				</ButtonGroup>
				<ButtonGroup fullWidth>
					<GreenButton variant="contained" onClick={() => showElement('teamNades')}>
						Team Nades
					</GreenButton>
					<RedButton variant="contained" onClick={() => hideElement('teamNades')}>
						Team Nades
					</RedButton>
				</ButtonGroup>
			</Grid>
		</ThemeProvider>
	);
};

render(<Elements />, document.getElementById('elements'));
