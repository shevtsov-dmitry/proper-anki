import { Button, Stack } from "@mantine/core"
import { useEffect, useState } from "react"

const Decks = () => {

  const [decks, setDecks] = useState()

  useEffect(() => {


    async function fetchAllDecks() {

    }

    fetchAllDecks()

  }, [])

  return (<Stack>
    <Button>
    </Button>
  </Stack>)
}
