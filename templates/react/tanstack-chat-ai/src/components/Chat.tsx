import { useSettings } from '../hooks/useSettings'
import { ChatPanel } from './ChatPanel'

export function Chat() {
  const settings = useSettings()
  return <ChatPanel settings={settings} />
}
