import { AppShell, Box } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useState } from 'react';
import AddContent from './components/AddContent';
import DeckList from './components/DeckList';
import Review from './components/Review';
import type { Deck } from './api';

type Screen = 'decks' | 'review' | 'add';

function App() {
  const [screen, setScreen] = useState<Screen>('decks');
  const [deck, setDeck] = useState<Deck | null>(null);

  const openDeck = (selected: Deck) => {
    setDeck(selected);
    setScreen('review');
  };

  return (
    <AppShell>
      <AppShell.Main>
        <Box h="100dvh" p="md">
          {screen === 'decks' && <DeckList onSelect={openDeck} onAdd={() => setScreen('add')} />}
          {screen === 'review' && deck && (
            <Review deck={deck} onBack={() => setScreen('decks')} />
          )}
          {screen === 'add' && <AddContent onBack={() => setScreen('decks')} />}
        </Box>
      </AppShell.Main>
      <Notifications position="bottom-right" />
    </AppShell>
  );
}

export default App;
