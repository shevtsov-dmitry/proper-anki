import { Alert, Box, Button, Center, Group, Loader, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { getDecks, type Deck } from '../api';

interface DeckListProps {
  onSelect: (deck: Deck) => void;
  onAdd: () => void;
}

export default function DeckList({ onSelect, onAdd }: DeckListProps) {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDecks()
      .then(setDecks)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load decks'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Center h="100%"><Loader /></Center>;
  }

  if (error) {
    return <Alert color="red" title="Failed to load decks">{error}</Alert>;
  }

  return (
    <Stack h="100%">
      <Group justify="space-between">
        <Title order={2}>Decks</Title>
        <Button onClick={onAdd}>Add content</Button>
      </Group>
      {decks.length === 0 ? (
        <Paper withBorder p="xl">
          <Stack align="center" gap="sm">
            <Text c="dimmed">There are no decks yet.</Text>
            <Button component="a" href="/">Go to add content</Button>
          </Stack>
        </Paper>
      ) : (
        <Box style={{ overflowY: 'auto', flex: 1 }}>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
            {decks.map((deck) => (
              <Paper
                key={deck.id}
                withBorder
                p="lg"
                radius="md"
                onClick={() => onSelect(deck)}
                style={{ cursor: 'pointer' }}
              >
                <Text fw={600}>{deck.name}</Text>
              </Paper>
            ))}
          </SimpleGrid>
        </Box>
      )}
    </Stack>
  );
}
