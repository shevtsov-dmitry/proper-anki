async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...options,
    headers: {
      ...(options?.body instanceof FormData
        ? {}
        : { 'Content-Type': 'application/json' }),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;

    try {
      const body = await response.json();
      message = body.message ?? message;
    } catch { }

    throw new Error(message);
  }

  return response.json();
}

export type Deck = { id: number; name: string; createdAt: string };
export type Note = {
  id: number;
  deckId: number;
  front: string;
  back: string;
  flagIds: number[];
  createdAt: string;
  updatedAt: string
};
export const getDecks = () => req<Deck[]>('/api/decks');
export const createDeck = (name: string) => req<Deck>('/api/decks', { method: 'POST', body: JSON.stringify({ name }) });
export const saveNote = (n: {
  id?: number | null;
  deckId: number;
  front: string;
  back: string;
  flagIds: number[]
}) => req<Note>('/api/notes', { method: 'POST', body: JSON.stringify(n) });

export async function uploadImage(file: File) {
  const f = new FormData();
  f.append('file', file);
  const r = await req<{ url: string }>('/api/images', { method: 'POST', body: f });
  return API + r.url
}
