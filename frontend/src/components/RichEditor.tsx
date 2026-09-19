import {Box, Text} from '@mantine/core';
import {uploadImage} from '../api';
import {useEffect, useRef} from 'react';

export default function RichEditor({label, value, onChange}: {
    label: string;
    value: string;
    onChange: (v: string) => void
}) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (ref.current && ref.current.innerHTML !== value) ref.current.innerHTML = value
    }, [value]);
    const emit = () => onChange(ref.current?.innerHTML ?? '');
    const paste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
        const fs = [...e.clipboardData.files].filter(x => x.type.startsWith('image/'));
        if (!fs.length) return;
        e.preventDefault();
        for (const f of fs) {
            const u = await uploadImage(f);
            document.execCommand('insertHTML', false, `<img src="${u}" alt=""/>`)
        }
        emit()
    };
    const drop = async (e: React.DragEvent<HTMLDivElement>) => {
        const fs = [...e.dataTransfer.files].filter(x => x.type.startsWith('image/'));
        if (!fs.length) return;
        e.preventDefault();
        for (const f of fs) {
            const u = await uploadImage(f);
            document.execCommand('insertHTML', false, `<img src="${u}" alt=""/>`)
        }
        emit()
    };
    return <Box><Text size="sm" fw={600} mb={6}>{label}</Text><Box ref={ref} contentEditable
                                                                   suppressContentEditableWarning onInput={emit}
                                                                   onPaste={paste} onDrop={drop}
                                                                   onDragOver={e => e.preventDefault()} style={{
        minHeight: 220,
        border: '1px solid var(--mantine-color-default-border)',
        borderRadius: 8,
        padding: 14,
        overflowY: 'auto'
    }}/></Box>
}
