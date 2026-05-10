// DevFlow Solutions — shared components: icons, badges, banner, toast, sidebar, header

const Icon = ({ name, size = 18, color = 'currentColor', strokeWidth = 1.6, ...rest }) => {
  const paths = {
    dashboard:    <><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></>,
    projects:     <><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></>,
    devs:         <><path d="m8 9-4 3 4 3"/><path d="m16 9 4 3-4 3"/><path d="m14 6-4 12"/></>,
    clients:      <><path d="M3 21V8l9-5 9 5v13"/><path d="M9 21V12h6v9"/><path d="M3 21h18"/></>,
    api:          <><path d="M4 17v3a1 1 0 0 0 1 1h3"/><path d="M4 7V4a1 1 0 0 1 1-1h3"/><path d="M20 7V4a1 1 0 0 0-1-1h-3"/><path d="M20 17v3a1 1 0 0 1-1 1h-3"/><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/></>,
    cloud:        <><path d="M17.5 19a4.5 4.5 0 1 0-1-8.9A6 6 0 0 0 5 12a4 4 0 0 0 0 8z"/></>,
    users:        <><circle cx="9" cy="8" r="3.5"/><path d="M3 20a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2.5"/><path d="M15 20a5 5 0 0 1 6.5-4.7"/></>,
    chevron_left: <><path d="m15 6-6 6 6 6"/></>,
    chevron_right:<><path d="m9 6 6 6-6 6"/></>,
    chevron_down: <><path d="m6 9 6 6 6-6"/></>,
    plus:         <><path d="M12 5v14M5 12h14"/></>,
    search:       <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
    edit:         <><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z"/></>,
    trash:        <><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M10 11v6M14 11v6"/></>,
    close:        <><path d="M18 6 6 18M6 6l12 12"/></>,
    eye:          <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></>,
    eye_off:      <><path d="M9.88 4.27A9.7 9.7 0 0 1 12 4c6.5 0 10 7 10 7a17.6 17.6 0 0 1-3.32 4.16M6.61 6.6A17.5 17.5 0 0 0 2 11s3.5 7 10 7c1.95 0 3.7-.6 5.18-1.5"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/><path d="m2 2 20 20"/></>,
    warning:      <><path d="M12 9v4M12 17h.01"/><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></>,
    danger:       <><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></>,
    check:        <><path d="m20 6-11 11-5-5"/></>,
    info:         <><circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/></>,
    logout:       <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></>,
    download:     <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></>,
    building:     <><rect x="4" y="2" width="16" height="20" rx="1.5"/><path d="M9 7h.01M15 7h.01M9 11h.01M15 11h.01M9 15h.01M15 15h.01"/><path d="M10 22v-4h4v4"/></>,
    calendar:     <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></>,
    arrow_right:  <><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></>,
    file:         <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></>,
    clock:        <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    help:         <><circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></>,
    chart:        <><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></>,
    bell:         <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    settings:     <><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...rest}>
      {paths[name]}
    </svg>
  );
};

const Badge = ({ value, type = 'projeto' }) => {
  const dict = type === 'sprint' ? STATUS_SPRINT
             : type === 'senioridade' ? SENIORIDADE
             : type === 'role' ? ROLES
             : STATUS_PROJETO;
  const cfg = dict[value];
  if (!cfg) return <span className="badge" style={{ background: '#F1F5F9', color: '#475569' }}>{value}</span>;
  return (
    <span className="badge" style={{ background: cfg.bg, color: cfg.fg }}>
      <span className="badge-dot" />
      {cfg.label}
    </span>
  );
};

const ProvedorBadge = ({ value, kind = 'api' }) => {
  const dict = kind === 'cloud' ? PROVEDOR_CLOUD : PROVEDOR_API;
  const cfg = dict[value] || { bg: '#F1F5F9', fg: '#475569' };
  return <span className="badge" style={{ background: cfg.bg, color: cfg.fg }}>{value}</span>;
};

const Banner = ({ kind = 'warning', title, children, pulse = false }) => (
  <div className={`banner banner-${kind} ${pulse ? 'pulse' : ''}`} role="alert">
    <span className="banner-icon"><Icon name={kind === 'danger' ? 'danger' : 'warning'} size={18}/></span>
    <div className="grow">
      {title ? <div style={{ fontWeight: 600, marginBottom: 2 }}>{title}</div> : null}
      <div>{children}</div>
    </div>
  </div>
);

const ToastContext = React.createContext(null);
const useToast = () => React.useContext(ToastContext);

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = React.useState([]);
  const push = React.useCallback((kind, msg) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, kind, msg }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }, []);
  const api = React.useMemo(() => ({
    success: m => push('success', m),
    error:   m => push('error', m),
    warning: m => push('warning', m),
  }), [push]);
  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.kind}`}>
            <span style={{ color: t.kind === 'success' ? '#22C55E' : t.kind === 'error' ? '#EF4444' : '#F59E0B', flexShrink:0, marginTop:1 }}>
              <Icon name={t.kind === 'success' ? 'check' : t.kind === 'error' ? 'danger' : 'warning'} size={16}/>
            </span>
            <div style={{ flex: 1, lineHeight: 1.4 }}>{t.msg}</div>
            <button className="btn-ghost" style={{ color: 'var(--text-muted)', display:'flex' }} onClick={() => setToasts(ts => ts.filter(x => x.id !== t.id))}>
              <Icon name="close" size={14}/>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ConfirmModal = ({ open, title, message, confirmLabel = 'Confirmar', danger = true, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <>
      <div className="scrim" onClick={onCancel} />
      <div className="modal" style={{ width: 420 }}>
        <div className="modal-header">
          <div className="modal-title">{title}</div>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onCancel}><Icon name="close" size={14}/></button>
        </div>
        <div className="modal-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.55 }}>{message}</div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
          <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </>
  );
};

// ——————————————————————————————————————————————
// Sidebar — DoDo-style (light/white, user profile at top, help at bottom)
// ——————————————————————————————————————————————
const Sidebar = ({ collapsed, onToggle, currentPath, onNavigate, user, onLogout }) => {
  const items = [
    { key: 'projetos',        path: '/projetos',        label: 'Projetos',        icon: 'projects', match: ['/projetos'] },
    { key: 'desenvolvedores', path: '/desenvolvedores', label: 'Desenvolvedores', icon: 'devs',     match: ['/desenvolvedores'] },
    { key: 'clientes',        path: '/clientes',        label: 'Clientes',        icon: 'clients',  match: ['/clientes'] },
    { key: 'custos-api',      path: '/custos-api',      label: 'Custos de API',   icon: 'api',      match: ['/custos-api'] },
    { key: 'custos-cloud',    path: '/custos-cloud',    label: 'Custos de Cloud', icon: 'cloud',    match: ['/custos-cloud'] },
    { key: 'usuarios',        path: '/usuarios',        label: 'Usuários',        icon: 'users',    match: ['/usuarios'], roles: ['ADMIN'] },
  ];

  const isActive = (item) => item.match.some(m => currentPath === m || currentPath.startsWith(m + '/'));

  return (
    <aside className="sidebar-dodo">
      {/* Toggle button */}
      <button
        onClick={onToggle}
        title={collapsed ? 'Expandir' : 'Recolher'}
        style={{
          position: 'absolute', left: '100%', marginLeft: -12, top: 22, zIndex: 5,
          width: 24, height: 24, borderRadius: '50%',
          background: 'white', border: '1px solid var(--border)',
          boxShadow: '0 1px 4px rgba(15,23,42,0.10)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#64748B',
        }}
      >
        <Icon name={collapsed ? 'chevron_right' : 'chevron_left'} size={12}/>
      </button>

      {/* Logo */}
      <div style={{
        padding: collapsed ? '20px 12px' : '20px 20px 16px',
        borderBottom: '1px solid var(--border)',
      }}>
        {collapsed ? (
          <div style={{ display:'flex', justifyContent:'center' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #6366F1, #7C3AED)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 16,
              boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
            }}>D</div>
          </div>
        ) : (
          <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #6366F1, #7C3AED)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 16,
              boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
            }}>D</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.01em' }}>DevFlow</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: '#6366F1', letterSpacing: '0.04em' }}>&lt;solutions/&gt;</div>
            </div>
          </div>
        )}
      </div>

      {/* User profile */}
      {!collapsed && (
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366F1, #7C3AED)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: 13, fontWeight: 700, flexShrink: 0,
              boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
            }}>{initials(user.nome)}</div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.nome}</div>
              <div style={{ fontSize: 11.5, color: '#6366F1', fontWeight: 500 }}>{ROLES[user.role]?.label}</div>
            </div>
            <button
              onClick={onLogout}
              title="Sair"
              style={{ color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer', padding: 5, display: 'flex', borderRadius: 6, transition: 'all .15s' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.background = '#FEE2E2'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = 'none'; }}
            >
              <Icon name="logout" size={14}/>
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '10px 10px', overflowY: 'auto' }}>
        {collapsed && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366F1, #7C3AED)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: 11, fontWeight: 700,
            }}>{initials(user.nome)}</div>
          </div>
        )}
        {!collapsed && (
          <div style={{ fontSize: 10.5, fontWeight: 600, color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '6px 14px 8px' }}>
            Menu
          </div>
        )}
        {items.filter(i => !i.roles || i.roles.includes(user.role)).map(item => {
          const active = isActive(item);
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.path)}
              title={collapsed ? item.label : undefined}
              className={`sidebar-nav-item ${active ? 'active' : ''}`}
              style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
            >
              <Icon name={item.icon} size={18}/>
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && active && (
                <span style={{
                  marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%',
                  background: '#6366F1',
                }}/>
              )}
            </button>
          );
        })}
      </nav>

      {/* Help section (DoDo-style) */}
      {!collapsed && (
        <div className="sidebar-help">
          <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366F1, #7C3AED)',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700, flexShrink: 0,
            }}>?</div>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: '#312E81' }}>Central de Ajuda</span>
          </div>
          <p style={{ fontSize: 11.5, color: '#4F46E5', margin: '0 0 10px', lineHeight: 1.45 }}>
            Tem algum problema? Fale com o suporte.
          </p>
          <button style={{
            width: '100%', height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #6366F1, #7C3AED)',
            color: 'white', fontSize: 11.5, fontWeight: 600,
            border: 'none', cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
          }}>Ir para suporte</button>
        </div>
      )}
    </aside>
  );
};

const Header = ({ breadcrumb, user }) => (
  <header style={{
    height: 'var(--header-height)',
    borderBottom: '1px solid var(--border)',
    background: 'white',
    padding: '0 28px',
    display: 'flex', alignItems: 'center', gap: 24,
    boxShadow: '0 1px 0 var(--border)',
  }}>
    <div className="grow" style={{ display:'flex', alignItems:'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
      {breadcrumb.map((b, i) => (
        <React.Fragment key={i}>
          {i > 0 && <Icon name="chevron_right" size={12} color="var(--text-muted)"/>}
          {b.onClick ? (
            <button onClick={b.onClick} style={{ color: 'var(--text-secondary)', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer' }}
              onMouseEnter={e=>e.currentTarget.style.color='var(--purple)'}
              onMouseLeave={e=>e.currentTarget.style.color='var(--text-secondary)'}
            >{b.label}</button>
          ) : (
            <span style={{ color: i === breadcrumb.length-1 ? 'var(--text-primary)' : undefined, fontWeight: i === breadcrumb.length-1 ? 600 : 400 }}>{b.label}</span>
          )}
        </React.Fragment>
      ))}
    </div>
    <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
      <button style={{ color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 6, borderRadius: 8 }}
        onMouseEnter={e => e.currentTarget.style.background='#F1F5F9'}
        onMouseLeave={e => e.currentTarget.style.background='none'}>
        <Icon name="bell" size={18}/>
      </button>
      <div style={{ width: 1, height: 24, background: 'var(--border)' }}/>
      <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize: 12.5, fontWeight: 600 }}>{user.nome}</div>
          <div style={{ fontSize: 10.5, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.04em' }}>{ROLES[user.role]?.label}</div>
        </div>
        <div className="avatar" style={{ background: 'linear-gradient(135deg, #6366F1, #7C3AED)', width: 34, height: 34 }}>{initials(user.nome)}</div>
      </div>
    </div>
  </header>
);

const Drawer = ({ open, title, onClose, children, footer }) => {
  if (!open) return null;
  return (
    <>
      <div className="scrim" onClick={onClose}/>
      <aside className="drawer">
        <div className="drawer-header">
          <div className="drawer-title">{title}</div>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}><Icon name="close" size={14}/></button>
        </div>
        <div className="drawer-body">{children}</div>
        {footer && <div className="drawer-footer">{footer}</div>}
      </aside>
    </>
  );
};

const Modal = ({ open, title, onClose, children, footer, size }) => {
  if (!open) return null;
  return (
    <>
      <div className="scrim" onClick={onClose}/>
      <div className={`modal ${size === 'lg' ? 'modal-lg' : ''}`}>
        <div className="modal-header">
          <div className="modal-title">{title}</div>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}><Icon name="close" size={14}/></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </>
  );
};

const Progress = ({ pct, color, height = 8 }) => {
  const clamped = Math.min(Math.max(pct, 0), 100);
  return (
    <div style={{ width:'100%', height, background:'var(--bg-subtle)', borderRadius: 999, overflow:'hidden', position:'relative', boxShadow: 'inset 0 1px 2px rgba(15,23,42,0.06)' }}>
      <div className="progress-bar" style={{
        width: `${clamped}%`, height:'100%',
        background: `linear-gradient(90deg, ${color} 0%, ${color} 70%, ${color}dd 100%)`,
        borderRadius: 999,
        transition: 'width .8s cubic-bezier(.2,.8,.25,1), background .2s',
        boxShadow: `0 0 8px ${color}55`,
        transformOrigin:'left',
        animation: 'draw-bar .9s cubic-bezier(.2,.8,.25,1)',
      }}/>
      {pct > 100 && (
        <div style={{
          position:'absolute', top:0, right:0,
          width: `${Math.min(pct - 100, 30)}%`, height:'100%',
          background: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.5), rgba(255,255,255,0.5) 4px, transparent 4px, transparent 8px)',
          borderRadius: '0 999px 999px 0',
        }}/>
      )}
    </div>
  );
};

const Empty = ({ title, desc, action }) => (
  <div className="empty">
    <div className="empty-title">{title}</div>
    {desc && <div style={{ marginBottom: 12 }}>{desc}</div>}
    {action}
  </div>
);

Object.assign(window, {
  Icon, Badge, ProvedorBadge, Banner,
  ToastContext, ToastProvider, useToast,
  ConfirmModal, Sidebar, Header, Drawer, Modal, Progress, Empty,
});
