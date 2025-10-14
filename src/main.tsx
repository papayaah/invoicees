import { render } from 'preact';
import { MantineProvider } from '@mantine/core';
import { App } from './App';
import '@mantine/core/styles.css';
import './index.css';

render(
  <MantineProvider>
    <App />
  </MantineProvider>,
  document.getElementById('app')!
);

