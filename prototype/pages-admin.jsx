// ============================================================
// pages-admin.jsx — Admin pages: Usuários, Desenvolvedores,
// Clientes, Custos API, Custos Cloud
// ============================================================

// ============================================================
// UsuariosPage
// ============================================================
const UsuariosPage = ({ usuarios, onSave, onDelete }) => {
  const { showToast } = useToast();
  const [search, setSearch] = React.useState('');
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [confirmDelete, setConfirmDelete] = React.useState(null);
  const [form, setForm] = React.useState({ nome: '', email: '', role: 'VIEWER', ativo: true });

  const filtered = usuarios.filter(u =>
    u.nome.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    setEditing(null);
    setForm({ nome: '', email: '', role: 'VIEWER', ativo: true });
    setDrawerOpen(true);
  };

  const openEdit = (u) => {
    setEditing(u);
    setForm({ nome: u.nome, email: u.email, role: u.role, ativo: u.ativo });
    setDrawerOpen(true);
  };

  const handleSave = () => {
    if (!form.nome.trim() || !form.email.trim()) {
      showToast('Preencha nome e e-mail.', 'error'); return;
    }
    onSave({ ...editing, ...form });
    setDrawerOpen(false);
    showToast(editing ? 'Usuário atualizado!' : 'Usuário criado!', 'success');
  };

  const handleDelete = (u) => setConfirmDelete(u);

  const confirmDel = () => {
    onDelete(confirmDelete.id);
    setConfirmDelete(null);
    showToast('Usuário removido.', 'success');
  };

  const roleColor = (r) => {
    const map = { ADMIN: 'var(--purple)', MANAGER: '#0EA5E9', VIEWER: '#64748B' };
    return map[r] || '#64748B';
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Usuários</h1>
          <p className="page-subtitle">Gerenciamento de acesso ao sistema</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <Icon name="plus" size={16} /> Novo Usuário
        </button>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Icon name="search" size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              className="input"
              style={{ paddingLeft: 36 }}
              placeholder="Buscar por nome ou e-mail..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>{filtered.length} usuário(s)</span>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Usuário</th>
              <th>E-mail</th>
              <th>Perfil</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={5}><Empty message="Nenhum usuário encontrado" /></td></tr>
            )}
            {filtered.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--purple), #7C3AED)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0
                    }}>{initials(u.nome)}</div>
                    <span style={{ fontWeight: 600 }}>{u.nome}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                <td>
                  <span style={{
                    padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                    background: roleColor(u.role) + '20', color: roleColor(u.role)
                  }}>{u.role}</span>
                </td>
                <td>
                  <span className={`chip ${u.ativo ? 'success' : 'error'}`}>
                    {u.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                    <button className="btn btn-ghost" style={{ padding: '6px 10px' }} onClick={() => openEdit(u)}>
                      <Icon name="edit" size={15} />
                    </button>
                    <button className="btn btn-ghost" style={{ padding: '6px 10px', color: '#EF4444' }} onClick={() => handleDelete(u)}>
                      <Icon name="trash" size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={editing ? 'Editar Usuário' : 'Novo Usuário'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="label">Nome *</label>
            <input className="input" placeholder="Nome completo" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} />
          </div>
          <div>
            <label className="label">E-mail *</label>
            <input className="input" type="email" placeholder="email@empresa.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label className="label">Perfil</label>
            <select className="select" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input type="checkbox" id="ativo" checked={form.ativo} onChange={e => setForm(f => ({ ...f, ativo: e.target.checked }))} />
            <label htmlFor="ativo" className="label" style={{ margin: 0, cursor: 'pointer' }}>Usuário ativo</label>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setDrawerOpen(false)}>Cancelar</button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}>Salvar</button>
          </div>
        </div>
      </Drawer>

      <ConfirmModal
        open={!!confirmDelete}
        title="Remover Usuário"
        message={`Tem certeza que deseja remover "${confirmDelete?.nome}"?`}
        onConfirm={confirmDel}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

// ============================================================
// DesenvolvedoresPage
// ============================================================
const DesenvolvedoresPage = ({ desenvolvedores, projetos, onSave, onDelete }) => {
  const { showToast } = useToast();
  const [search, setSearch] = React.useState('');
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [confirmDelete, setConfirmDelete] = React.useState(null);
  const [form, setForm] = React.useState({
    nome: '', email: '', senioridade: 'PLENO', projeto: '',
    taxaHora: '', ativo: true
  });

  const filtered = desenvolvedores.filter(d =>
    d.nome.toLowerCase().includes(search.toLowerCase()) ||
    (d.email || '').toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    setEditing(null);
    setForm({ nome: '', email: '', senioridade: 'PLENO', projeto: '', taxaHora: '', ativo: true });
    setDrawerOpen(true);
  };

  const openEdit = (d) => {
    setEditing(d);
    setForm({
      nome: d.nome, email: d.email || '',
      senioridade: d.senioridade, projeto: d.projeto || '',
      taxaHora: d.taxaHora || '', ativo: d.ativo !== false
    });
    setDrawerOpen(true);
  };

  const handleSave = () => {
    if (!form.nome.trim()) { showToast('Nome é obrigatório.', 'error'); return; }
    onSave({ ...editing, ...form, taxaHora: parseFloat(form.taxaHora) || 0 });
    setDrawerOpen(false);
    showToast(editing ? 'Desenvolvedor atualizado!' : 'Desenvolvedor cadastrado!', 'success');
  };

  const senColor = (s) => {
    const map = { JUNIOR: '#10B981', PLENO: '#F59E0B', SENIOR: '#EF4444', TECH_LEAD: 'var(--purple)' };
    return map[s] || '#64748B';
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Desenvolvedores</h1>
          <p className="page-subtitle">Equipe técnica e alocações</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <Icon name="plus" size={16} /> Novo Desenvolvedor
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {['JUNIOR','PLENO','SENIOR','TECH_LEAD'].map(sen => {
          const count = desenvolvedores.filter(d => d.senioridade === sen).length;
          return (
            <div key={sen} className="card" style={{ padding: '16px 20px' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{sen.replace('_',' ')}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: senColor(sen) }}>{count}</div>
            </div>
          );
        })}
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ position: 'relative' }}>
          <Icon name="search" size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="input" style={{ paddingLeft: 36 }} placeholder="Buscar desenvolvedor..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: 16 }}>
        {filtered.map(d => {
          const proj = projetos.find(p => p.id === d.projeto || p.nome === d.projeto);
          return (
            <div key={d.id} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--purple), #7C3AED)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0
                  }}>{initials(d.nome)}</div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{d.nome}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{d.email || '—'}</div>
                  </div>
                </div>
                <span style={{
                  padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700, height: 'fit-content',
                  background: senColor(d.senioridade) + '20', color: senColor(d.senioridade)
                }}>{d.senioridade}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Projeto</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{proj?.nome || d.projeto || '—'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Taxa/hora</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{d.taxaHora ? formatBRL(d.taxaHora) : '—'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Status</span>
                  <span className={`chip ${d.ativo !== false ? 'success' : 'error'}`} style={{ fontSize: 11 }}>{d.ativo !== false ? 'Ativo' : 'Inativo'}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-ghost" style={{ flex: 1, fontSize: 13 }} onClick={() => openEdit(d)}>
                  <Icon name="edit" size={14} /> Editar
                </button>
                <button className="btn btn-ghost" style={{ padding: '8px 12px', color: '#EF4444' }} onClick={() => setConfirmDelete(d)}>
                  <Icon name="trash" size={14} />
                </button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <div style={{ gridColumn: '1/-1' }}><Empty message="Nenhum desenvolvedor encontrado" /></div>}
      </div>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={editing ? 'Editar Desenvolvedor' : 'Novo Desenvolvedor'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="label">Nome *</label>
            <input className="input" placeholder="Nome completo" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} />
          </div>
          <div>
            <label className="label">E-mail</label>
            <input className="input" type="email" placeholder="dev@empresa.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label className="label">Senioridade</label>
            <select className="select" value={form.senioridade} onChange={e => setForm(f => ({ ...f, senioridade: e.target.value }))}>
              {SENIORIDADE.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Projeto</label>
            <select className="select" value={form.projeto} onChange={e => setForm(f => ({ ...f, projeto: e.target.value }))}>
              <option value="">— Sem projeto —</option>
              {projetos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Taxa por hora (R$)</label>
            <input className="input" type="number" placeholder="0.00" value={form.taxaHora} onChange={e => setForm(f => ({ ...f, taxaHora: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input type="checkbox" id="dev-ativo" checked={form.ativo} onChange={e => setForm(f => ({ ...f, ativo: e.target.checked }))} />
            <label htmlFor="dev-ativo" className="label" style={{ margin: 0, cursor: 'pointer' }}>Desenvolvedor ativo</label>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setDrawerOpen(false)}>Cancelar</button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}>Salvar</button>
          </div>
        </div>
      </Drawer>

      <ConfirmModal
        open={!!confirmDelete}
        title="Remover Desenvolvedor"
        message={`Tem certeza que deseja remover "${confirmDelete?.nome}"?`}
        onConfirm={() => { onDelete(confirmDelete.id); setConfirmDelete(null); showToast('Desenvolvedor removido.', 'success'); }}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

// ============================================================
// ClientesPage
// ============================================================
const ClientesPage = ({ clientes, onSave, onDelete }) => {
  const { showToast } = useToast();
  const [search, setSearch] = React.useState('');
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [confirmDelete, setConfirmDelete] = React.useState(null);
  const [form, setForm] = React.useState({ nome: '', email: '', empresa: '', telefone: '', ativo: true });

  const filtered = clientes.filter(c =>
    c.nome.toLowerCase().includes(search.toLowerCase()) ||
    (c.empresa || '').toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    setEditing(null);
    setForm({ nome: '', email: '', empresa: '', telefone: '', ativo: true });
    setDrawerOpen(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({ nome: c.nome, email: c.email || '', empresa: c.empresa || '', telefone: c.telefone || '', ativo: c.ativo !== false });
    setDrawerOpen(true);
  };

  const handleSave = () => {
    if (!form.nome.trim()) { showToast('Nome é obrigatório.', 'error'); return; }
    onSave({ ...editing, ...form });
    setDrawerOpen(false);
    showToast(editing ? 'Cliente atualizado!' : 'Cliente cadastrado!', 'success');
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Clientes</h1>
          <p className="page-subtitle">Base de clientes cadastrados</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <Icon name="plus" size={16} /> Novo Cliente
        </button>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Icon name="search" size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="input" style={{ paddingLeft: 36 }} placeholder="Buscar cliente ou empresa..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>{filtered.length} cliente(s)</span>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Empresa</th>
              <th>E-mail</th>
              <th>Telefone</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6}><Empty message="Nenhum cliente encontrado" /></td></tr>
            )}
            {filtered.map(c => (
              <tr key={c.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #0EA5E9, #6366F1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0
                    }}>{initials(c.nome)}</div>
                    <span style={{ fontWeight: 600 }}>{c.nome}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--text-muted)' }}>{c.empresa || '—'}</td>
                <td style={{ color: 'var(--text-muted)' }}>{c.email || '—'}</td>
                <td style={{ color: 'var(--text-muted)' }}>{c.telefone || '—'}</td>
                <td>
                  <span className={`chip ${c.ativo !== false ? 'success' : 'error'}`}>
                    {c.ativo !== false ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                    <button className="btn btn-ghost" style={{ padding: '6px 10px' }} onClick={() => openEdit(c)}>
                      <Icon name="edit" size={15} />
                    </button>
                    <button className="btn btn-ghost" style={{ padding: '6px 10px', color: '#EF4444' }} onClick={() => setConfirmDelete(c)}>
                      <Icon name="trash" size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={editing ? 'Editar Cliente' : 'Novo Cliente'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="label">Nome *</label>
            <input className="input" placeholder="Nome do contato" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} />
          </div>
          <div>
            <label className="label">Empresa</label>
            <input className="input" placeholder="Razão social / nome fantasia" value={form.empresa} onChange={e => setForm(f => ({ ...f, empresa: e.target.value }))} />
          </div>
          <div>
            <label className="label">E-mail</label>
            <input className="input" type="email" placeholder="contato@empresa.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label className="label">Telefone</label>
            <input className="input" placeholder="(11) 99999-9999" value={form.telefone} onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input type="checkbox" id="cli-ativo" checked={form.ativo} onChange={e => setForm(f => ({ ...f, ativo: e.target.checked }))} />
            <label htmlFor="cli-ativo" className="label" style={{ margin: 0, cursor: 'pointer' }}>Cliente ativo</label>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setDrawerOpen(false)}>Cancelar</button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}>Salvar</button>
          </div>
        </div>
      </Drawer>

      <ConfirmModal
        open={!!confirmDelete}
        title="Remover Cliente"
        message={`Tem certeza que deseja remover "${confirmDelete?.nome}"?`}
        onConfirm={() => { onDelete(confirmDelete.id); setConfirmDelete(null); showToast('Cliente removido.', 'success'); }}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

// ============================================================
// CustosApiPage
// ============================================================
const CustosApiPage = ({ custosApi, projetos, onSave, onDelete }) => {
  const { showToast } = useToast();
  const [filterProjeto, setFilterProjeto] = React.useState('');
  const [filterMes, setFilterMes] = React.useState('');
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [confirmDelete, setConfirmDelete] = React.useState(null);
  const [form, setForm] = React.useState({
    projeto: '', provedor: 'OPENAI', servico: '', mesRef: '', valorUSD: '', descricao: ''
  });

  const meses = [...new Set(custosApi.map(c => c.mesRef))].sort().reverse();

  const filtered = custosApi.filter(c =>
    (!filterProjeto || c.projeto === filterProjeto) &&
    (!filterMes || c.mesRef === filterMes)
  );

  const totalUSD = filtered.reduce((s, c) => s + (c.valorUSD || 0), 0);
  const totalBRL = filtered.reduce((s, c) => s + (c.valorBRL || c.valorUSD * 5 || 0), 0);

  const openNew = () => {
    setEditing(null);
    setForm({ projeto: '', provedor: 'OPENAI', servico: '', mesRef: '', valorUSD: '', descricao: '' });
    setDrawerOpen(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({ projeto: c.projeto || '', provedor: c.provedor || 'OPENAI', servico: c.servico || '', mesRef: c.mesRef || '', valorUSD: c.valorUSD || '', descricao: c.descricao || '' });
    setDrawerOpen(true);
  };

  const handleSave = () => {
    if (!form.projeto || !form.mesRef || !form.valorUSD) {
      showToast('Projeto, mês e valor são obrigatórios.', 'error'); return;
    }
    const valorUSD = parseFloat(form.valorUSD) || 0;
    onSave({ ...editing, ...form, valorUSD, valorBRL: valorUSD * 5 });
    setDrawerOpen(false);
    showToast(editing ? 'Custo atualizado!' : 'Custo registrado!', 'success');
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Custos de API</h1>
          <p className="page-subtitle">Monitoramento de gastos com APIs de IA</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <Icon name="plus" size={16} /> Registrar Custo
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Total USD (filtro)</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>$ {totalUSD.toFixed(2)}</div>
        </div>
        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Total BRL (filtro)</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--purple)' }}>{formatBRL(totalBRL)}</div>
        </div>
        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Registros</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{filtered.length}</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <select className="select" value={filterProjeto} onChange={e => setFilterProjeto(e.target.value)}>
            <option value="">Todos os projetos</option>
            {projetos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
          <select className="select" value={filterMes} onChange={e => setFilterMes(e.target.value)}>
            <option value="">Todos os meses</option>
            {meses.map(m => <option key={m} value={m}>{formatMesRef(m)}</option>)}
          </select>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Projeto</th>
              <th>Provedor</th>
              <th>Serviço</th>
              <th>Mês</th>
              <th style={{ textAlign: 'right' }}>USD</th>
              <th style={{ textAlign: 'right' }}>BRL</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7}><Empty message="Nenhum custo encontrado" /></td></tr>
            )}
            {filtered.map(c => {
              const proj = projetos.find(p => p.id === c.projeto);
              return (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{proj?.nome || c.projeto || '—'}</td>
                  <td><ProvedorBadge provedor={c.provedor} /></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{c.servico || '—'}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{formatMesRef(c.mesRef)}</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>$ {(c.valorUSD || 0).toFixed(2)}</td>
                  <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--purple)' }}>{formatBRL(c.valorBRL || c.valorUSD * 5)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button className="btn btn-ghost" style={{ padding: '6px 10px' }} onClick={() => openEdit(c)}>
                        <Icon name="edit" size={15} />
                      </button>
                      <button className="btn btn-ghost" style={{ padding: '6px 10px', color: '#EF4444' }} onClick={() => setConfirmDelete(c)}>
                        <Icon name="trash" size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={editing ? 'Editar Custo API' : 'Registrar Custo API'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="label">Projeto *</label>
            <select className="select" value={form.projeto} onChange={e => setForm(f => ({ ...f, projeto: e.target.value }))}>
              <option value="">Selecione...</option>
              {projetos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Provedor</label>
            <select className="select" value={form.provedor} onChange={e => setForm(f => ({ ...f, provedor: e.target.value }))}>
              {PROVEDOR_API.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Serviço / Modelo</label>
            <input className="input" placeholder="ex: GPT-4o, Claude 3 Opus..." value={form.servico} onChange={e => setForm(f => ({ ...f, servico: e.target.value }))} />
          </div>
          <div>
            <label className="label">Mês de Referência *</label>
            <input className="input" type="month" value={form.mesRef} onChange={e => setForm(f => ({ ...f, mesRef: e.target.value }))} />
          </div>
          <div>
            <label className="label">Valor em USD *</label>
            <input className="input" type="number" step="0.01" placeholder="0.00" value={form.valorUSD} onChange={e => setForm(f => ({ ...f, valorUSD: e.target.value }))} />
          </div>
          <div>
            <label className="label">Descrição</label>
            <textarea className="textarea" rows={3} placeholder="Observações..." value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setDrawerOpen(false)}>Cancelar</button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}>Salvar</button>
          </div>
        </div>
      </Drawer>

      <ConfirmModal
        open={!!confirmDelete}
        title="Remover Custo"
        message="Tem certeza que deseja remover este registro?"
        onConfirm={() => { onDelete(confirmDelete.id); setConfirmDelete(null); showToast('Registro removido.', 'success'); }}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

// ============================================================
// CustosCloudPage
// ============================================================
const CustosCloudPage = ({ custosCloud, projetos, onSave, onDelete }) => {
  const { showToast } = useToast();
  const [filterProjeto, setFilterProjeto] = React.useState('');
  const [filterMes, setFilterMes] = React.useState('');
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [confirmDelete, setConfirmDelete] = React.useState(null);
  const [form, setForm] = React.useState({
    projeto: '', provedor: 'AWS', servico: '', mesRef: '', valorBRL: '', descricao: ''
  });

  const meses = [...new Set(custosCloud.map(c => c.mesRef))].sort().reverse();

  const filtered = custosCloud.filter(c =>
    (!filterProjeto || c.projeto === filterProjeto) &&
    (!filterMes || c.mesRef === filterMes)
  );

  const totalBRL = filtered.reduce((s, c) => s + (c.valorBRL || 0), 0);

  const byProvedor = PROVEDOR_CLOUD
    ? PROVEDOR_CLOUD.map(p => ({
        provedor: p,
        total: filtered.filter(c => c.provedor === p).reduce((s, c) => s + (c.valorBRL || 0), 0)
      })).filter(x => x.total > 0)
    : [];

  const openNew = () => {
    setEditing(null);
    setForm({ projeto: '', provedor: 'AWS', servico: '', mesRef: '', valorBRL: '', descricao: '' });
    setDrawerOpen(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({ projeto: c.projeto || '', provedor: c.provedor || 'AWS', servico: c.servico || '', mesRef: c.mesRef || '', valorBRL: c.valorBRL || '', descricao: c.descricao || '' });
    setDrawerOpen(true);
  };

  const handleSave = () => {
    if (!form.projeto || !form.mesRef || !form.valorBRL) {
      showToast('Projeto, mês e valor são obrigatórios.', 'error'); return;
    }
    onSave({ ...editing, ...form, valorBRL: parseFloat(form.valorBRL) || 0 });
    setDrawerOpen(false);
    showToast(editing ? 'Custo atualizado!' : 'Custo registrado!', 'success');
  };

  const provedorColor = (p) => {
    const map = { AWS: '#FF9900', AZURE: '#0078D4', GCP: '#4285F4', ORACLE: '#C74634', DIGITALOCEAN: '#0080FF' };
    return map[p] || '#64748B';
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Custos Cloud</h1>
          <p className="page-subtitle">Monitoramento de infraestrutura em nuvem</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <Icon name="plus" size={16} /> Registrar Custo
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Total BRL (filtro)</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--purple)' }}>{formatBRL(totalBRL)}</div>
        </div>
        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Por Provedor</div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {byProvedor.length === 0 && <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>—</span>}
            {byProvedor.map(x => (
              <div key={x.provedor} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: provedorColor(x.provedor), display: 'inline-block' }} />
                <span style={{ fontSize: 12, fontWeight: 600 }}>{x.provedor}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatBRLCompact(x.total)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <select className="select" value={filterProjeto} onChange={e => setFilterProjeto(e.target.value)}>
            <option value="">Todos os projetos</option>
            {projetos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
          <select className="select" value={filterMes} onChange={e => setFilterMes(e.target.value)}>
            <option value="">Todos os meses</option>
            {meses.map(m => <option key={m} value={m}>{formatMesRef(m)}</option>)}
          </select>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Projeto</th>
              <th>Provedor</th>
              <th>Serviço</th>
              <th>Mês</th>
              <th style={{ textAlign: 'right' }}>Valor BRL</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6}><Empty message="Nenhum custo encontrado" /></td></tr>
            )}
            {filtered.map(c => {
              const proj = projetos.find(p => p.id === c.projeto);
              return (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{proj?.nome || c.projeto || '—'}</td>
                  <td>
                    <span style={{
                      padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                      background: provedorColor(c.provedor) + '20', color: provedorColor(c.provedor)
                    }}>{c.provedor}</span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{c.servico || '—'}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{formatMesRef(c.mesRef)}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--purple)' }}>{formatBRL(c.valorBRL || 0)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button className="btn btn-ghost" style={{ padding: '6px 10px' }} onClick={() => openEdit(c)}>
                        <Icon name="edit" size={15} />
                      </button>
                      <button className="btn btn-ghost" style={{ padding: '6px 10px', color: '#EF4444' }} onClick={() => setConfirmDelete(c)}>
                        <Icon name="trash" size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={editing ? 'Editar Custo Cloud' : 'Registrar Custo Cloud'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="label">Projeto *</label>
            <select className="select" value={form.projeto} onChange={e => setForm(f => ({ ...f, projeto: e.target.value }))}>
              <option value="">Selecione...</option>
              {projetos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Provedor</label>
            <select className="select" value={form.provedor} onChange={e => setForm(f => ({ ...f, provedor: e.target.value }))}>
              {(PROVEDOR_CLOUD || ['AWS','AZURE','GCP','ORACLE','DIGITALOCEAN']).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Serviço</label>
            <input className="input" placeholder="ex: EC2, S3, RDS..." value={form.servico} onChange={e => setForm(f => ({ ...f, servico: e.target.value }))} />
          </div>
          <div>
            <label className="label">Mês de Referência *</label>
            <input className="input" type="month" value={form.mesRef} onChange={e => setForm(f => ({ ...f, mesRef: e.target.value }))} />
          </div>
          <div>
            <label className="label">Valor em BRL *</label>
            <input className="input" type="number" step="0.01" placeholder="0.00" value={form.valorBRL} onChange={e => setForm(f => ({ ...f, valorBRL: e.target.value }))} />
          </div>
          <div>
            <label className="label">Descrição</label>
            <textarea className="textarea" rows={3} placeholder="Observações..." value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setDrawerOpen(false)}>Cancelar</button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}>Salvar</button>
          </div>
        </div>
      </Drawer>

      <ConfirmModal
        open={!!confirmDelete}
        title="Remover Custo"
        message="Tem certeza que deseja remover este registro?"
        onConfirm={() => { onDelete(confirmDelete.id); setConfirmDelete(null); showToast('Registro removido.', 'success'); }}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

// ============================================================
// Exports
// ============================================================
Object.assign(window, {
  UsuariosPage,
  DesenvolvedoresPage,
  ClientesPage,
  CustosApiPage,
  CustosCloudPage,
});
