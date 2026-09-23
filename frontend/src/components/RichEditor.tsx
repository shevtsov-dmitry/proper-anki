import { Box, Text } from '@mantine/core';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { useEffect } from 'react';
import { uploadImage } from '../api';

interface RichEditorProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

export default function RichEditor({ label, value, onChange }: RichEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Keep editor content synchronized with external `value` state changes (e.g., loaded draft)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  // Handle pasted image files by uploading them and inserting into TipTap
  const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const files = Array.from(e.clipboardData.files).filter((file) =>
      file.type.startsWith('image/')
    );

    if (!files.length) return;
    e.preventDefault();

    for (const file of files) {
      try {
        const url = await uploadImage(file);
        editor?.chain().focus().setImage({ src: url }).run();
      } catch (err) {
        console.error('Failed to upload image', err);
      }
    }
  };

  // Handle dropped image files by uploading them and inserting into TipTap
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    );

    if (!files.length) return;
    e.preventDefault();

    for (const file of files) {
      try {
        const url = await uploadImage(file);
        editor?.chain().focus().setImage({ src: url }).run();
      } catch (err) {
        console.error('Failed to upload image', err);
      }
    }
  };

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <Text size="sm" fw={600} mb={6}>
        {label}
      </Text>

      <style>{`
      .tiptap {
        outline: none;
        min-height: 100%;
      }
    `}</style>

      <Box
        onPaste={handlePaste}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          height: 220,
          flex: 1,
          minHeight: 0,
          border: '1px solid var(--mantine-color-default-border)',
          borderRadius: 8,
          padding: 14,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <EditorContent editor={editor} style={{ flex: 1, minHeight: 0 }} />
      </Box>
    </Box>
  );
}
