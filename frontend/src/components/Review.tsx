import { Alert, Box, Button, Center, Group, Loader, Paper, Stack, Text, Title } from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import { getNotesForDeck, type Deck, type Note } from '../api';

interface ReviewProps {
  deck: Deck;
  onBack: () => void;
}

type ReviewItem = {
  note: Note;
  revealed: boolean;
};

function Content({ html }: { html: string }) {
  return (
    <Box
      className="card-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default function Review({ deck, onBack }: ReviewProps) {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    getNotesForDeck(deck.id)
      .then((notes) => {
        if (active) setItems(notes.map((note) => ({ note, revealed: false })));
      })
      .catch((e) => {
        if (active) setError(e instanceof Error ? e.message : 'Failed to load notes');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [deck.id]);

  const current = items[0];
  const remaining = items.length;

  const reveal = () => {
    setItems((queue) => queue.length
      ? [{ ...queue[0], revealed: true }, ...queue.slice(1)]
      : queue);
  };

  const answer = (again: boolean) => {
    setItems((queue) => {
      if (!queue.length) return queue;
      const [item, ...rest] = queue;
      if (again) return [...rest, { ...item, revealed: false }];
      return rest;
    });
  };

  const answerButtons = useMemo(() => {
    if (!current?.revealed) return null;
    return (
      <Group justify="center" gap="sm">
        <Button onClick={() => answer(false)}>
          Okay
        </Button>
        <Button variant="light" color="orange" onClick={() => answer(true)}>
          Bad
        </Button>
      </Group>
    );
  }, [current?.revealed]);

  return (
    <Stack h="100%" maw={900} mx="auto">
      <Group justify="space-between">
        <Button variant="subtle" onClick={onBack}>← Decks</Button>
        <Title order={3}>{deck.name}</Title>
        <Text size="sm" c="dimmed">{remaining} remaining</Text>
      </Group>

      {loading && <Center style={{ flex: 1 }}><Loader /></Center>}

      {error && <Alert color="red" title="Failed to load notes">{error}</Alert>}

      {!loading && !error && !current && (
        <Center style={{ flex: 1 }}>
          <Stack align="center">
            <Title order={3}>Deck complete</Title>
            <Text c="dimmed">There are no notes left in the current queue.</Text>
            <Button onClick={onBack}>Back to decks</Button>
          </Stack>
        </Center>
      )}

      {!loading && !error && current && (
        <Stack style={{ flex: 1, minHeight: 0 }}>
          <Paper withBorder radius="md" p="xl" style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
            <Content html={current.note.front} />
          </Paper>

          {current.revealed && (
            <Paper withBorder radius="md" p="xl" style={{ maxHeight: '42%', overflowY: 'auto' }}>
              <Content html={current.note.back} />
            </Paper>
          )}

          <Center>
            {!current.revealed ? (
              <Button size="md" onClick={reveal}>Look</Button>
            ) : answerButtons}
          </Center>
        </Stack>
      )}
    </Stack>
  );
}
