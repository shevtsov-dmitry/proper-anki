import { AppShell, AppShellFooter, Center, Text } from '@mantine/core'
import AddContent from './components/AddContent'

const App = () => <AppShell
  style={{
    height: "100dvh",
    widows: "100dvw",
  }}
>
  <AddContent />
  <AppShellFooter>
    <Center>
      <Text fz={"sm"} color='#bfbfbf'>to save the file on a server use CTRL+Enter</Text>
    </Center>
  </AppShellFooter>
</AppShell>

export default App
