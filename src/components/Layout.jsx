import { NavLink, Outlet } from 'react-router-dom'

const tabs = [
  { to: '/about', label: 'About' },
  { to: '/chat', label: 'Chat', highlight: true },
  { to: '/debate', label: 'Debate', highlight: true },
  { to: '/referendum', label: 'Referendum' },
]

export default function Layout() {
  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="app-header">
        <div className="app-title" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/vtaiwan-logo.svg" alt="vTaiwan" style={{ height: '2rem', marginRight: '0.8rem' }} />
          _Agent_Democracy_模擬市民大會
        </div>
        <nav className="tabbar" aria-label="Primary">
          {tabs.map(t => (
            <NavLink
              key={t.to}
              to={t.to}
              className={({ isActive }) => isActive ? 'tab active' : 'tab'}
              style={({ isActive }) => t.highlight ? { fontWeight: 'bold', color: isActive ? undefined : 'var(--text-color)' } : {}}
            >
              [{t.label}]
            </NavLink>
          ))}
        </nav>
      </header>
      <div className="tab-content">
        <Outlet />
      </div>
    </div>
  )
}
