import { useSettings } from '../hooks/useSettings'
import { ChatPanel } from './ChatPanel'

interface Props {
  apiUrl?: string
}

export function Chat({ apiUrl }: Props) {
  const settings = useSettings()
  return <ChatPanel settings={settings} apiUrl={apiUrl} />
}
