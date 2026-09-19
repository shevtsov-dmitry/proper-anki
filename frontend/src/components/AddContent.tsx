import { Alert, Box, Button, Group, Modal, Select, Stack, TextInput, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useEffect, useMemo, useState } from 'react';
import { createDeck, getDecks, saveNote, type Deck } from '../api';
import RichEditor from './RichEditor';

const KEY = 'draft_note_data';

export default function AddContent() {
  const [d, setD] = useState<Deck[]>([]);
  const [deckId, setDeckId] = useState<string | null>(null);
  const [noteId, setNoteId] = useState<number | null>(null);
  const [front, setFront] = useState<string>('');
  const [back, setBack] = useState<string>('');
  const [flagIds, setFlagIds] = useState<number[]>([]);
  const [name, setName] = useState<string>('');
  const [modal, setModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch initial list of decks
  useEffect(() => {
    getDecks()
        .then((decks) => setD(decks))
        .catch((e) =>
            notifications.show({
              title: 'Failed to load decks',
              message: e instanceof Error ? e.message : 'Unknown error',
              color: 'red',
            })
        );
  }, []);

  // Format decks for Mantine Select component
  const opts = useMemo(() => {
    return d.map((deck) => ({
      value: String(deck.id),
      label: deck.name,
    }));
  }, [d]);

  // Load saved draft from LocalStorage
  useEffect(() => {
    try {
      const x = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (x) {
        setDeckId(x.deckId ?? null);
        setNoteId(x.noteId ?? null);
        setFront(x.front ?? '');
        setBack(x.back ?? '');
        setFlagIds(x.flagIds ?? []);
      }
    } catch {
      // Ignore JSON parse errors
    }
  }, []);

  // Auto-save draft changes to LocalStorage
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify({ deckId, noteId, front, back, flagIds }));
  }, [deckId, noteId, front, back, flagIds]);

  const add = async () => {
    if (!name.trim()) return;
    try {
      const x = await createDeck(name);
      setD((v) => [...v, x]);
      setDeckId(String(x.id));
      setName('');
      setModal(false);
      notifications.show({ title: 'Deck created', message: x.name });
    } catch (e) {
      notifications.show({
        title: 'Could not create deck',
        message: e instanceof Error ? e.message : 'Unknown error',
        color: 'red',
      });
    }
  };

  const save = async () => {
    if (!deckId) {
      notifications.show({
        title: 'Choose a deck',
        message: 'Create or select a deck first',
        color: 'yellow',
      });
      return;
    }
    setLoading(true);
    try {
      const x = await saveNote({ id: noteId ?? undefined, deckId: Number(deckId), front, back, flagIds });
      setNoteId(x.id);
      notifications.show({ title: 'Saved', message: 'Sent to server' });
      localStorage.setItem(KEY, JSON.stringify({ deckId, noteId: x.id, front, back, flagIds }));
    } catch (e) {
      notifications.show({
        title: 'Not saved',
        message: e instanceof Error ? e.message : 'Unknown error',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  // Keyboard shortcut listener (Ctrl+Enter to Save)
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        void save();
      }
    };
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  });

  return (
      <>
        <Stack h="100%">
          <Group justify="space-between">
            <Title order={2}>Add content</Title>
            <Button onClick={() => setModal(true)}>+ Deck</Button>
          </Group>
          <Select
              label="Deck"
              data={opts}
              value={deckId}
              onChange={setDeckId}
              placeholder="Select a deck"
              searchable
          />
          <Box style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, flex: 1, minHeight: 0 }}>
            <RichEditor label="Front" value={front} onChange={setFront} />
            <RichEditor label="Back" value={back} onChange={setBack} />
          </Box>
          <Alert>
            Draft is saved in this browser automatically. <b>Ctrl+Enter</b> sends it to the server.
          </Alert>
          <Group justify="flex-end">
            <Button loading={loading} onClick={() => void save()}>
              Send to server
            </Button>
          </Group>
        </Stack>

        <Modal opened={modal} onClose={() => setModal(false)} title="Create deck">
          <Stack>
            <TextInput
                label="Name"
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void add();
                }}
                autoFocus
            />
            <Button onClick={() => void add()}>Create</Button>
          </Stack>
        </Modal>
      </>
  );
}