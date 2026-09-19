import { Box, Button, Group, Input, List, Title } from "@mantine/core"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"

const AddContent = () => {
  const editorBack = useEditor({
    extensions: [
      StarterKit,
      Image,
    ],
    content: "",
  })

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()

    const file = Array.from(event.dataTransfer.files).find((file) =>
      file.type.startsWith("image/")
    )

    if (!file) {
      return
    }

    const url = URL.createObjectURL(file)

    editorBack
      ?.chain()
      .focus()
      .setImage({ src: url })
      .run()
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const items = Array.from(event.clipboardData.items)

    const imageItem = items.find((item) =>
      item.type.startsWith("image/")
    )

    if (!imageItem) {
      return
    }

    event.preventDefault()

    const file = imageItem.getAsFile()

    if (!file) {
      return
    }

    const url = URL.createObjectURL(file)

    editorBack
      ?.chain()
      .focus()
      .setImage({ src: url })
      .run()
  }

  if (!editorBack) {
    return null
  }

  return (
    <>
      <style>
        {`
        .tiptap {
          flex: 1;
          height: 100%;
          outline: none;
        }
      `}
      </style>

      <Box
        style={{
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: 16,
          minHeight: "100%",
          display: "flex",
          flexDirection: "column",
          margin: "2px 5%",
        }}
        onPaste={handlePaste}
        onDrop={handleDrop}
      >
        <Title>
          FRONT
        </Title>
        <EditorContent
          editor={editorFront}
          style={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
          }}
        />

        <Title>
          BACK
        </Title>
        <EditorContent
          editor={editorBack}
          style={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
          }}
        />
        <Title>
          FLAGS
        </Title>
        <Group>
          ${flags.map((id, v) => (<Input id={id} placeholder="flag" />))}
          <Button >+</Button>{/*  //add new flag */}
        </Group>
      </Box>
    </But >
  )
}

export default AddContent
