import { AppShell, AppShellFooter, Box, Center, Text } from '@mantine/core'
import AddContent from './components/AddContent'
import { Notifications } from '@mantine/notifications'

// const App = () => <AppShell
//   style={{
//     height: "100dvh",
//     widows: "100dvw",
//   }}
// >
//   <AddContent />
//   <AppShellFooter>
//     <Center>
//       <Text fz={"sm"} color='#bfbfbf'>to save the file on a server use CTRL+Enter</Text>
//     </Center>
//   </AppShellFooter>
// </AppShell>

function App() {
  return <AppShell footer={{ height: 34 }}><AppShell.Main><Box h="calc(100dvh - 34px)"
    p="md"><AddContent /></Box></AppShell.Main><AppShell.Footer><Center
      h="100%"><Text size="sm" c="dimmed">Ctrl+Enter sends the current note to the
        server</Text></Center></AppShell.Footer><Notifications position="bottom-right" /></AppShell>
}

export default App
