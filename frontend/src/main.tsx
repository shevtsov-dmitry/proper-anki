import React from 'react'
import ReactDOM from 'react-dom/client'

import {
  MantineProvider,
  ColorSchemeScript,
} from '@mantine/core'

import {
  useMantineColorScheme,
  useComputedColorScheme,
} from '@mantine/core'

import '@mantine/core/styles.css'
import './index.css'

import App from './App'
import { theme } from './theme'


function Root() {
  return (
    <MantineProvider
      theme={theme}
      defaultColorScheme="auto"
    >
      <App />
    </MantineProvider>
  )
}


ReactDOM.createRoot(
  document.getElementById('root')!
).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)
