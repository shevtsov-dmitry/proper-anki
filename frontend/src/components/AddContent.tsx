import { Box } from "@mantine/core"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"

const AddContent = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
    ],
    content: "",
  })

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

    editor
      ?.chain()
      .focus()
      .setImage({ src: url })
      .run()
  }

  if (!editor) {
    return null
  }

  return (
    <Box
      style={{
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 16,
      }}
      onPaste={handlePaste}
    >
      <EditorContent editor={editor} />
    </Box>
  )
}

export default AddContent
