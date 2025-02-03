export async function chatService({ parsedBody, server, signal, onMessage }) {
  try {
    const response = await fetch(server, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(parsedBody),
      signal
    })

    if (!response.ok) throw new Error('Network response was not ok')
    if (!response.body) throw new Error('Response body is null')

    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')

    let reading = true
    while (reading) {
      const { done, value } = await reader.read()
      reading = !done

      if (done) break

      const chunk = decoder.decode(value)

      chunk
        .split('\n')
        .map((line) => line.replace(/^data: /, '').trim())
        .filter((line) => line && line !== '[DONE]')
        .forEach((line) => {
          try {
            const parsedLine = JSON.parse(line)
            const { choices, id } = parsedLine
            const content = choices[0]?.delta?.content
            if (content) onMessage(content, true, id)
          } catch (error) {
            onMessage('', false)
            throw new Error('An error occurred while processing the chat stream')
          }
        })
    }
  } catch (error) {
    onMessage('', false)
    if (error && error.name !== 'AbortError') {
      throw new Error('An error occurred while processing the chat stream')
    } else {
      throw error
    }
  } finally {
    onMessage('', false)
  }
}
