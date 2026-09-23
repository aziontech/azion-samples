import { Link } from '@tanstack/react-router'

export function NotFound() {
  return (
    <div style={{ padding: '24px', background: '#111111', minHeight: '100vh', fontFamily: 'monospace', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontSize: '48px', margin: '0 0 12px', color: '#333333' }}>404</p>
      <p style={{ color: '#666666', margin: '0 0 20px', fontSize: '14px' }}>Page not found</p>
      <Link to="/" style={{ color: '#FE601F', textDecoration: 'none', fontSize: '12px', letterSpacing: '0.06em' }}>
        GO HOME
      </Link>
    </div>
  )
}
