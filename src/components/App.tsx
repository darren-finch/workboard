import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppBar, Container, Grid, IconButton, Toolbar } from '@mui/material';
import { Paper } from '@mui/material';
import styled from '@mui/material/styles';
import { padding, width } from '@mui/system';
import { Menu } from '@mui/icons-material';

const theme = createTheme();

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* <AppBar>
        <Toolbar>
          <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label='menu'
          sx={{mr: 2}}>
            <Menu />
          </IconButton>
        </Toolbar>
      </AppBar> */}
      <Container fixed>
        <Grid container spacing={2}>
          <Grid xs={8}>
            <Paper sx={{
              padding: 1
            }}>xs=8</Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper>xs=4</Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper>xs=4</Paper>
          </Grid>
          <Grid item xs={8}>
            <Paper>xs=8</Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;