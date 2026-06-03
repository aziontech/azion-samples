import { ErrorComponent, Link } from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  return (
    <div style={{ padding: '24px', background: '#111111', minHeight: '100vh', fontFamily: 'monospace' }}>
      <ErrorComponent error={error} />
      <Link
        to="/"
        style={{ color: '#FE601F', textDecoration: 'none', marginTop: '16px', display: 'inline-block', fontSize: '13px' }}
      >
        Go home
      </Link>
    </div>
  )
}
