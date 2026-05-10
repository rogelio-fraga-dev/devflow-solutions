// DevFlow Solutions — Landing Page, Login, Projetos e demais telas de projeto

// ——————————————————————————————————————————————
// LANDING PAGE (inspiração: F5 Sistema — dark, impactante)
// ——————————————————————————————————————————————
const LandingPage = ({ onEnter }) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <div className="landing-page">
      {/* Ambient radial glows */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }}>
        <div style={{ position:'absolute', top:'-10%', left:'15%', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle, rgba(99,102,241,0.18), transparent 60%)' }}/>
        <div style={{ position:'absolute', bottom:'-5%', right:'10%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(124,58,237,0.14), transparent 60%)' }}/>
        {/* Grid */}
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize:'44px 44px',
          maskImage:'radial-gradient(ellipse 100% 80% at 50% 30%, black, transparent)',
          WebkitMaskImage:'radial-gradient(ellipse 100% 80% at 50% 30%, black, transparent)',
        }}/>
      </div>

      {/* NAV */}
      <nav className="landing-nav">
        <div style={{ display:'flex', alignItems:'center', gap:10, marginRight:48, flexShrink:0 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#6366F1,#7C3AED)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontFamily:'var(--font-mono)', fontWeight:700, fontSize:17, boxShadow:'0 4px 18px rgba(99,102,241,0.45)' }}>D</div>
          <div>
            <div style={{ fontWeight:700, fontSize:15, lineHeight:1 }}>DevFlow</div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'#818CF8', letterSpacing:'0.04em' }}>&lt;solutions/&gt;</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:32, flex:1 }}>
          {['Recursos','Funcionalidades','Planos','Suporte'].map(l => (
            <button key={l} className="landing-nav-link">{l}</button>
          ))}
        </div>
        <div style={{ display:'flex', gap:10, flexShrink:0 }}>
          <button className="landing-btn-ghost" onClick={onEnter}>Entrar</button>
          <button className="landing-btn-primary">Contratar</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', padding:'96px 40px 60px' }}>
        {/* Live badge */}
        <div style={{
          display:'inline-flex', alignItems:'center', gap:8,
          padding:'6px 18px', marginBottom:28,
          background:'rgba(99,102,241,0.14)', border:'1px solid rgba(99,102,241,0.32)',
          borderRadius:999, fontSize:12.5, color:'#A5B4FC',
          animation:'float-in .6s ease backwards',
        }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:'#4ADE80', display:'inline-block', boxShadow:'0 0 10px #4ADE80', animation:'pulse-dot 2s ease-in-out infinite' }}/>
          Plataforma online · Disponível 24h · Sem instalação
        </div>

        {/* Main headline */}
        <h1 style={{
          fontSize:'clamp(32px,5.5vw,66px)', fontWeight:900, lineHeight:1.06,
          letterSpacing:'-0.035em', margin:'0 0 18px', maxWidth:820,
          background:'linear-gradient(145deg, #FFFFFF 0%, #C7D2FE 50%, #A5B4FC 100%)',
          WebkitBackgroundClip:'text', backgroundClip:'text',
          WebkitTextFillColor:'transparent', color:'transparent',
          animation:'float-in .7s .1s ease backwards',
        }}>
          Otimize sua gestão com uma plataforma confiável, robusta e intuitiva.
        </h1>

        <p style={{ fontSize:17, color:'rgba(255,255,255,0.5)', maxWidth:520, lineHeight:1.7, margin:'0 0 40px', animation:'float-in .7s .2s ease backwards' }}>
          Controle orçamentos, sprints, equipes e custos de cloud e API em um único lugar, com visibilidade total do início ao fim.
        </p>

        {/* CTAs */}
        <div style={{ display:'flex', gap:14, alignItems:'center', flexWrap:'wrap', justifyContent:'center', animation:'float-in .7s .3s ease backwards' }}>
          <button onClick={onEnter} style={{
            height:52, padding:'0 34px', border:'none', borderRadius:13,
            background:'linear-gradient(135deg,#6366F1 0%,#7C3AED 100%)',
            color:'white', fontSize:15, fontWeight:700, cursor:'pointer',
            boxShadow:'0 8px 32px rgba(99,102,241,0.48), 0 2px 8px rgba(0,0,0,0.28)',
            transition:'all .2s', display:'flex', alignItems:'center', gap:10,
            fontFamily:'var(--font-sans)',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 14px 40px rgba(99,102,241,0.55), 0 4px 12px rgba(0,0,0,0.3)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 8px 32px rgba(99,102,241,0.48), 0 2px 8px rgba(0,0,0,0.28)'; }}>
            Teste por 7 dias
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M8 3l5 5-5 5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 18px', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:10, fontSize:12.5, color:'rgba(255,255,255,0.65)' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1l1.5 4H13l-3.5 2.5 1.3 4L7 9 3.2 11.5l1.3-4L1 5h4.5L7 1z" fill="#4ADE80"/></svg>
            100% Seguro · LGPD compliant
          </div>
        </div>

        {/* Dashboard preview */}
        <div style={{
          marginTop:64, width:'100%', maxWidth:960,
          background:'rgba(255,255,255,0.035)', border:'1px solid rgba(255,255,255,0.1)',
          borderRadius:20, padding:24, backdropFilter:'blur(12px)',
          boxShadow:'0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
          animation:'float-in .8s .4s ease backwards',
        }}>
          {/* Mini stats row */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12, marginBottom:16 }}>
            {[
              { label:'Budget consolidado', value:'R$ 1,21M', color:'#818CF8', icon:'📊' },
              { label:'Custo acumulado',    value:'R$ 913k',  color:'#FCD34D', icon:'💰' },
              { label:'Margem disponível',  value:'R$ 296k',  color:'#4ADE80', icon:'✅' },
              { label:'Em risco',           value:'2 projetos',color:'#F87171', icon:'⚠️' },
            ].map(s => (
              <div key={s.label} style={{ padding:'14px 16px', background:'rgba(255,255,255,0.06)', borderRadius:12, border:'1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize:10.5, color:'rgba(255,255,255,0.38)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6 }}>{s.icon} {s.label}</div>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:20, fontWeight:700, color:s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
          {/* Mini project cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:10 }}>
            {[
              { name:'Atena — Sísmica',    pct:86,  color:'#F97316', badge:'ALERTA' },
              { name:'Cortex — Catálogo',  pct:41,  color:'#4ADE80', badge:'EM ANDAMENTO' },
              { name:'Hermes — PIX',       pct:108, color:'#F87171', badge:'ESTOURADO' },
              { name:'Lumen — Mobile',     pct:15,  color:'#818CF8', badge:'PLANEJADO' },
            ].map(p => (
              <div key={p.name} style={{ padding:'12px 14px', background:'rgba(255,255,255,0.04)', borderRadius:10, border:'1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.82)', marginBottom:8, lineHeight:1.3 }}>{p.name}</div>
                <div style={{ height:5, background:'rgba(255,255,255,0.1)', borderRadius:999, marginBottom:6, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${Math.min(p.pct,100)}%`, background:p.color, borderRadius:999, boxShadow:`0 0 6px ${p.color}88` }}/>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:10 }}>
                  <span style={{ color:'rgba(255,255,255,0.35)', fontSize:9.5, textTransform:'uppercase', letterSpacing:'0.04em' }}>{p.badge}</span>
                  <span style={{ fontFamily:'var(--font-mono)', fontWeight:700, color:p.color }}>{p.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Client strip */}
      <div style={{
        position:'relative', zIndex:1,
        borderTop:'1px solid rgba(255,255,255,0.07)',
        padding:'28px 64px',
        display:'flex', alignItems:'center', gap:40, justifyContent:'center', flexWrap:'wrap',
      }}>
        <span style={{ fontSize:11, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.1em', whiteSpace:'nowrap' }}>Quem usa e recomenda</span>
        <div style={{ width:1, height:20, background:'rgba(255,255,255,0.12)' }}/>
        {['Petrobras S.A.','Magalu Tecnologia','Banco Inter','Movile'].map(c => (
          <div key={c} style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.35)', padding:'7px 18px', border:'1px solid rgba(255,255,255,0.09)', borderRadius:8, letterSpacing:'0.01em' }}>{c}</div>
        ))}
      </div>

      {/* Features strip */}
      <div style={{ position:'relative', zIndex:1, padding:'48px 64px 60px', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ fontSize:11, color:'#818CF8', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:10 }}>Funcionalidades</div>
          <h2 style={{ fontSize:28, fontWeight:700, color:'white', margin:0, letterSpacing:'-0.02em' }}>Tudo que você precisa em um só lugar</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:20 }}>
          {[
            { icon:'📋', title:'Gestão de Projetos', desc:'Acompanhe status, orçamento e datas de entrega de todos os projetos em tempo real.' },
            { icon:'⏱️', title:'Timesheet & Sprints', desc:'Registre apontamentos de horas, gerencie sprints por fase e controle o custo por desenvolvedor.' },
            { icon:'💸', title:'Controle Financeiro', desc:'DRE automático, custos de API/cloud, change requests e burn rate com alertas inteligentes.' },
          ].map(f => (
            <div key={f.title} style={{
              padding:'24px', background:'rgba(255,255,255,0.04)',
              border:'1px solid rgba(255,255,255,0.09)', borderRadius:16,
              transition:'all .2s', cursor:'default',
            }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(99,102,241,0.1)'; e.currentTarget.style.borderColor='rgba(99,102,241,0.3)'; e.currentTarget.style.transform='translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.09)'; e.currentTarget.style.transform=''; }}>
              <div style={{ fontSize:28, marginBottom:14 }}>{f.icon}</div>
              <div style={{ fontSize:15, fontWeight:700, color:'white', marginBottom:8 }}>{f.title}</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', lineHeight:1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ——————————————————————————————————————————————
// LOGIN (inspiração: split branco/roxo)
// ——————————————————————————————————————————————
const LoginPage = ({ onLogin, onBack }) => {
  const [email, setEmail] = React.useState('marina@devflow.io');
  const [senha, setSenha] = React.useState('••••••••');
  const [showPwd, setShowPwd] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [remember, setRemember] = React.useState(false);
  const [error, setError] = React.useState('');

  const submit = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !senha) { setError('Preencha e-mail e senha.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(email); }, 700);
  };

  return (
    <div className="login-split">
      {/* LEFT — form */}
      <div className="login-left">
        {/* Back */}
        {onBack && (
          <button onClick={onBack} style={{
            position:'absolute', top:24, left:24,
            display:'flex', alignItems:'center', gap:6,
            color:'#6366F1', fontSize:13, fontWeight:500,
            background:'none', border:'none', cursor:'pointer', fontFamily:'var(--font-sans)',
            padding:'6px 10px', borderRadius:8, transition:'background .15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background='#EEF2FF'}
          onMouseLeave={e => e.currentTarget.style.background='none'}>
            ← Voltar ao início
          </button>
        )}

        {/* Logo */}
        <div style={{ position:'absolute', top:22, right:28, display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:30, height:30, borderRadius:8, background:'linear-gradient(135deg,#6366F1,#7C3AED)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontFamily:'var(--font-mono)', fontWeight:700, fontSize:14 }}>D</div>
          <span style={{ fontWeight:700, fontSize:14, color:'#0F172A' }}>DevFlow</span>
        </div>

        <div style={{ width:'100%', maxWidth:360 }}>
          <h1 style={{ fontSize:38, fontWeight:900, margin:'0 0 6px', letterSpacing:'-0.03em', color:'#0F172A' }}>Olá! 👋</h1>
          <p style={{ color:'#64748B', fontSize:15, margin:'0 0 36px', lineHeight:1.5 }}>Entre na sua conta</p>

          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {/* Email */}
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:'#475569', display:'block', marginBottom:7 }}>E-mail</label>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'#94A3B8', display:'flex' }}>
                  <Icon name="users" size={15}/>
                </span>
                <input
                  className="login-field"
                  type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="voce@empresa.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:'#475569', display:'block', marginBottom:7 }}>Senha</label>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'#94A3B8', display:'flex' }}>
                  <Icon name="eye" size={15}/>
                </span>
                <input
                  className="login-field"
                  style={{ paddingRight:42 }}
                  type={showPwd ? 'text' : 'password'} value={senha}
                  onChange={e => setSenha(e.target.value)}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPwd(s => !s)}
                  style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', color:'#94A3B8', background:'none', border:'none', cursor:'pointer', display:'flex' }}>
                  <Icon name={showPwd ? 'eye_off' : 'eye'} size={16}/>
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:13, color:'#64748B', userSelect:'none' }}>
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} style={{ accentColor:'#6366F1', width:15, height:15 }}/>
                Lembrar-me
              </label>
              <button type="button" style={{ fontSize:13, color:'#6366F1', background:'none', border:'none', cursor:'pointer', fontWeight:500, fontFamily:'var(--font-sans)' }}>
                Esqueci a senha
              </button>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background:'#FEE2E2', color:'#991B1B', padding:'10px 14px', borderRadius:10, fontSize:12.5, display:'flex', gap:8, alignItems:'center' }}>
                <Icon name="danger" size={14}/>
                {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading} className="login-submit" style={{ marginTop:4 }}>
              {loading ? (
                <>
                  <span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.4)', borderTopColor:'white', borderRadius:'50%', animation:'spin .7s linear infinite', display:'inline-block' }}/>
                  Entrando…
                </>
              ) : 'Entrar →'}
            </button>
          </form>

          <div style={{ marginTop:28, textAlign:'center', fontSize:12.5, color:'#94A3B8' }}>
            Não tem acesso?{' '}
            <a href="#" style={{ color:'#6366F1', fontWeight:600, textDecoration:'none' }}>Fale com o administrador</a>
          </div>
        </div>

        {/* API hint */}
        <div style={{ position:'absolute', bottom:20, left:'50%', transform:'translateX(-50%)', fontFamily:'var(--font-mono)', fontSize:11, color:'#CBD5E1', whiteSpace:'nowrap' }}>
          POST /api/v1/auth/login
        </div>
      </div>

      {/* RIGHT — purple welcome */}
      <div className="login-right">
        {/* Decorative circles */}
        <div style={{ position:'absolute', top:-70, right:-60, width:220, height:220, borderRadius:'50%', background:'rgba(255,255,255,0.07)' }}/>
        <div style={{ position:'absolute', bottom:-90, left:-50, width:280, height:280, borderRadius:'50%', background:'rgba(255,255,255,0.05)' }}/>
        <div style={{ position:'absolute', top:'38%', right:-40, width:140, height:140, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }}/>
        {/* Grid */}
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize:'32px 32px', pointerEvents:'none',
        }}/>

        <div style={{ position:'relative', textAlign:'center', color:'white' }}>
          {/* Logo mark */}
          <div style={{
            width:68, height:68, borderRadius:18,
            background:'rgba(255,255,255,0.18)', backdropFilter:'blur(12px)',
            display:'flex', alignItems:'center', justifyContent:'center',
            margin:'0 auto 28px',
            fontSize:30, fontWeight:800, fontFamily:'var(--font-mono)',
            boxShadow:'0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.25)',
          }}>D</div>

          <h2 style={{ fontSize:34, fontWeight:900, margin:'0 0 14px', letterSpacing:'-0.03em', lineHeight:1.08 }}>
            Bem-vindo<br/>de volta!
          </h2>

          <p style={{ fontSize:14.5, lineHeight:1.7, color:'rgba(255,255,255,0.72)', margin:'0 0 36px' }}>
            Acesse sua conta DevFlow Solutions e continue gerenciando seus projetos com total controle e eficiência.
          </p>

          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
            {[
              { value:'4+', label:'Projetos' },
              { value:'6+', label:'Devs' },
              { value:'R$1,2M', label:'Budget' },
            ].map(s => (
              <div key={s.label} style={{ background:'rgba(255,255,255,0.14)', borderRadius:14, padding:'14px 10px', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:22, fontWeight:800, lineHeight:1 }}>{s.value}</div>
                <div style={{ fontSize:11, opacity:.72, marginTop:4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div style={{ marginTop:28, display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
            {['🔒 100% Seguro','✅ LGPD','⚡ Alta disponibilidade'].map(b => (
              <div key={b} style={{ fontSize:11.5, color:'rgba(255,255,255,0.65)', padding:'5px 12px', background:'rgba(255,255,255,0.1)', borderRadius:999, border:'1px solid rgba(255,255,255,0.12)' }}>{b}</div>
            ))}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

// ——————————————————————————————————————————————
// PROJETOS — LISTA
// ——————————————————————————————————————————————
const ProjetosLista = ({ projetos, clientes, onOpen, onNew, onSprints, onFinanceiro }) => {
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState('TODOS');

  const filtered = projetos.filter(p => {
    if (filter !== 'TODOS' && p.status !== filter) return false;
    if (search && !p.nome.toLowerCase().includes(search.toLowerCase()) && !p.stackTecnologica.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    TODOS: projetos.length,
    EM_ANDAMENTO: projetos.filter(p => p.status === 'EM_ANDAMENTO').length,
    ALERTA: projetos.filter(p => p.status === 'ALERTA').length,
    ESTOURADO: projetos.filter(p => p.status === 'ESTOURADO').length,
    PLANEJADO: projetos.filter(p => p.status === 'PLANEJADO').length,
    CONCLUIDO: projetos.filter(p => p.status === 'CONCLUIDO').length,
  };

  const totBudget = projetos.reduce((s,p) => s + p.budgetTotal, 0);
  const totCusto = projetos.reduce((s,p) => s + p.custoAtualAcumulado, 0);
  const totAlerta = projetos.filter(p => p.status === 'ALERTA' || p.status === 'ESTOURADO').length;

  return (
    <div className="page-fade">
      <div style={{ position:'relative', marginBottom:24, padding:'4px 0 0' }}>
        <div className="page-header" style={{ marginBottom:18 }}>
          <div>
            <h1 className="page-title gradient-text" style={{ fontSize:28 }}>Projetos</h1>
            <div className="page-sub">
              <span className="live-dot" style={{ display:'inline-block', color:'var(--success)', marginRight:8, verticalAlign:'middle' }}/>
              Mostrando <strong style={{ color:'var(--text-primary)' }}>{filtered.length}</strong> de {projetos.length} projetos · sincronizado <span className="mono">agora</span>
            </div>
          </div>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <div className="search">
              <Icon name="search" size={14}/>
              <input placeholder="Buscar por nome ou stack…" value={search} onChange={e => setSearch(e.target.value)}/>
            </div>
            <button className="btn btn-primary" onClick={onNew}><Icon name="plus" size={14}/>Novo projeto</button>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12, marginBottom:22 }}>
          <MiniStat label="Budget consolidado" value={formatBRLCompact(totBudget)} sub={`${projetos.length} projetos ativos`} accent="#6366F1" icon="file"/>
          <MiniStat label="Custo acumulado" value={formatBRLCompact(totCusto)} sub={`${((totCusto/totBudget)*100).toFixed(1)}% do total`} accent="#F59E0B" icon="api"/>
          <MiniStat label="Margem disponível" value={formatBRLCompact(totBudget - totCusto)} sub="margem bruta combinada" accent="#22C55E" icon="check"/>
          <MiniStat label="Em risco" value={totAlerta} sub={totAlerta === 1 ? 'projeto requer atenção' : 'projetos requerem atenção'} accent="#EF4444" icon="warning"/>
        </div>
      </div>

      <div className="chip-row" style={{ marginBottom:20 }}>
        {[
          { k:'TODOS', label:'Todos' },
          { k:'EM_ANDAMENTO', label:'Em andamento' },
          { k:'ALERTA', label:'Alerta' },
          { k:'ESTOURADO', label:'Estourado' },
          { k:'PLANEJADO', label:'Planejado' },
          { k:'CONCLUIDO', label:'Concluído' },
        ].map(c => (
          <button key={c.k} className={`chip ${filter === c.k ? 'active' : ''}`} onClick={() => setFilter(c.k)}>
            {c.label}
            {counts[c.k] !== undefined && <span style={{ opacity:.7, fontWeight:400 }}>· {counts[c.k]}</span>}
          </button>
        ))}
      </div>

      <div className="stagger" style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:16 }}>
        {filtered.map(p => {
          const pct = burnRate(p);
          const color = burnColor(pct);
          const cliente = clientes.find(c => c.id === p.clienteId);
          const isAlerta = p.status === 'ALERTA';
          const isEstourado = p.status === 'ESTOURADO';
          const accentClass = isEstourado ? 'card-alerta card-estourado' : isAlerta ? 'card-alerta' : '';
          return (
            <div key={p.id} className={`card card-lift ${accentClass}`}
              style={{ padding:20, borderColor: isEstourado ? '#FCA5A5' : isAlerta ? '#FCD34D' : 'var(--border)', borderWidth: isEstourado || isAlerta ? 1.5 : 1, cursor:'pointer', overflow:'hidden' }}
              onClick={() => onOpen(p.id)}>
              {(isAlerta || isEstourado) && (
                <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background: isEstourado ? 'linear-gradient(90deg,#EF4444,#FB923C,#EF4444)' : 'linear-gradient(90deg,#F59E0B,#FBBF24,#F59E0B)', backgroundSize:'200% 100%', animation:'gradient-shift 4s ease-in-out infinite' }}/>
              )}
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, marginBottom:10 }}>
                <div className="grow" style={{ minWidth:0 }}>
                  <div style={{ fontSize:16, fontWeight:600, letterSpacing:'-0.01em', marginBottom:6 }}>{p.nome}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:12, color:'var(--text-muted)', flexWrap:'wrap' }}>
                    <span style={{ fontFamily:'var(--font-mono)', fontSize:11, padding:'2px 7px', background:'linear-gradient(135deg,#F1F5F9,#E2E8F0)', borderRadius:4, color:'var(--text-secondary)', border:'1px solid var(--border)' }}>{p.stackTecnologica}</span>
                    <span style={{ display:'flex', alignItems:'center', gap:4 }}><Icon name="building" size={12}/>{cliente?.nome || '—'}</span>
                  </div>
                </div>
                <Badge value={p.status} type="projeto"/>
              </div>
              <div style={{ marginBottom:6, marginTop:12 }}>
                <Progress pct={pct} color={color} height={9}/>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', fontSize:12, marginBottom:14 }}>
                <span className="mono" style={{ color:'var(--text-secondary)' }}>{formatBRLCompact(p.custoAtualAcumulado)} de {formatBRLCompact(p.budgetTotal)}</span>
                <span className="mono" style={{ fontWeight:700, color, fontSize:13 }}>{pct}%</span>
              </div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:12, borderTop:'1px solid var(--border)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11.5, color:'var(--text-muted)', fontFamily:'var(--font-mono)' }}>
                  <Icon name="calendar" size={12}/>
                  {formatDateShort(p.dataInicio)} → {formatDateShort(p.dataPrevisaoEntrega)}
                </div>
                <div style={{ display:'flex', gap:4 }} onClick={e => e.stopPropagation()}>
                  <button className="btn btn-ghost btn-sm" onClick={() => onSprints(p.id)} style={{ fontSize:11.5 }}>Sprints</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => onFinanceiro(p.id)} style={{ fontSize:11.5 }}>Financeiro<Icon name="arrow_right" size={11}/></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MiniStat = ({ label, value, sub, accent, icon }) => (
  <div className="card kpi-pop" style={{ padding:16, display:'flex', alignItems:'center', gap:14, overflow:'hidden', position:'relative' }}>
    <div style={{ width:40, height:40, borderRadius:10, background:`linear-gradient(135deg, ${accent}22, ${accent}11)`, color:accent, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:`inset 0 0 0 1px ${accent}33` }}>
      <Icon name={icon} size={18}/>
    </div>
    <div style={{ minWidth:0, flex:1 }}>
      <div style={{ fontSize:10.5, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', fontWeight:600, marginBottom:2 }}>{label}</div>
      <div className="mono" style={{ fontSize:19, fontWeight:700, lineHeight:1.1 }}>{value}</div>
      <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }} className="truncate">{sub}</div>
    </div>
    <div style={{ position:'absolute', right:-20, bottom:-20, width:80, height:80, borderRadius:'50%', background:`radial-gradient(circle, ${accent}10, transparent 70%)`, pointerEvents:'none' }}/>
  </div>
);

// ——————————————————————————————————————————————
// PROJETO — DETALHE
// ——————————————————————————————————————————————
const ProjetoDetalhe = ({ projeto, cliente, sprints, changeRequests, onUpdate, onDelete, onSprints, onChangeRequests, onFinanceiro, onTimesheets }) => {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(projeto);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const toast = useToast();

  React.useEffect(() => setDraft(projeto), [projeto]);

  const pct = burnRate(projeto);
  const color = burnColor(pct);
  const margem = projeto.budgetTotal - projeto.custoAtualAcumulado;
  const isAlerta = projeto.status === 'ALERTA';
  const isEstourado = projeto.status === 'ESTOURADO';
  const projSprints = sprints.filter(s => s.projetoId === projeto.id).slice(-3).reverse();
  const projCRs = changeRequests.filter(cr => cr.projetoId === projeto.id).slice(-3).reverse();

  const save = () => { onUpdate(draft); setEditing(false); toast.success('Projeto atualizado.'); };

  return (
    <div>
      {(isAlerta || isEstourado) && (
        <div style={{ marginBottom:20 }}>
          {isAlerta && <Banner kind="warning">⚠ Atenção: projeto atingiu {pct}% do orçamento. Monitore os custos com cuidado.</Banner>}
          {isEstourado && <Banner kind="danger" pulse title="Budget esgotado">Projeto ultrapassou 100% do orçamento aprovado ({pct}%). Nenhum novo custo pode ser registrado até a aprovação de um Change Request.</Banner>}
        </div>
      )}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:24, alignItems:'start' }}>
        <div>
          <div style={{ marginBottom:24 }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16, marginBottom:6 }}>
              <div className="grow" style={{ minWidth:0 }}>
                {editing ? (
                  <input className="input" value={draft.nome} onChange={e => setDraft({...draft, nome: e.target.value})} style={{ fontSize:22, fontWeight:600, height:44, marginBottom:8 }}/>
                ) : (
                  <h1 style={{ fontSize:26, fontWeight:700, letterSpacing:'-0.02em', margin:'0 0 8px' }}>{projeto.nome}</h1>
                )}
                <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
                  <Badge value={projeto.status} type="projeto"/>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:11.5, padding:'3px 8px', background:'var(--bg-subtle)', borderRadius:4, color:'var(--text-secondary)' }}>{projeto.stackTecnologica}</span>
                  <span style={{ fontSize:12, color:'var(--text-muted)', display:'flex', alignItems:'center', gap:4 }}><Icon name="building" size={12}/>{cliente?.nome}</span>
                </div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                {editing ? (
                  <>
                    <button className="btn btn-secondary" onClick={() => { setDraft(projeto); setEditing(false); }}>Cancelar</button>
                    <button className="btn btn-primary" onClick={save}><Icon name="check" size={14}/>Salvar</button>
                  </>
                ) : (
                  <button className="btn btn-secondary" onClick={() => setEditing(true)}><Icon name="edit" size={14}/>Editar</button>
                )}
              </div>
            </div>
          </div>

          <div className="card" style={{ padding:20, marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:14 }}>Detalhes do projeto</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:18 }}>
              <DetalheField label="Data de início" editing={editing} value={editing ? draft.dataInicio : formatDate(projeto.dataInicio)} type="date" onChange={v => setDraft({...draft, dataInicio: v})}/>
              <DetalheField label="Previsão de entrega" editing={editing} value={editing ? draft.dataPrevisaoEntrega : formatDate(projeto.dataPrevisaoEntrega)} type="date" onChange={v => setDraft({...draft, dataPrevisaoEntrega: v})}/>
              <DetalheField label="Budget total" editing={editing} value={editing ? draft.budgetTotal : formatBRL(projeto.budgetTotal)} type="number" onChange={v => setDraft({...draft, budgetTotal: parseFloat(v)||0})}/>
              <DetalheField label="Status" editing={editing} value={editing ? draft.status : <Badge value={projeto.status} type="projeto"/>} type="select" options={Object.keys(STATUS_PROJETO)} optionsLabels={STATUS_PROJETO} onChange={v => setDraft({...draft, status: v})}/>
            </div>
            {editing && <div className="field" style={{ marginTop:18 }}><label className="field-label">Stack tecnológica</label><input className="input" value={draft.stackTecnologica} onChange={e => setDraft({...draft, stackTecnologica: e.target.value})}/></div>}
            <div style={{ marginTop:18 }}>
              <div className="field-label" style={{ marginBottom:6 }}>Descrição</div>
              {editing ? (
                <textarea className="textarea" value={draft.descricao || ''} onChange={e => setDraft({...draft, descricao: e.target.value})}/>
              ) : (
                <div style={{ color:'var(--text-secondary)', lineHeight:1.6, fontSize:13.5 }}>{projeto.descricao || 'Sem descrição.'}</div>
              )}
            </div>
          </div>

          <SectionCard title="Sprints recentes" actionLabel="Ver todas" onAction={() => onSprints(projeto.id)}>
            {projSprints.length === 0 ? <Empty title="Nenhuma sprint ainda" desc="Crie a primeira sprint deste projeto."/> : (
              <div style={{ display:'flex', flexDirection:'column' }}>
                {projSprints.map(s => (
                  <div key={s.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 0', borderTop:'1px solid var(--border)' }}>
                    <div style={{ width:6, height:6, borderRadius:'50%', background:'var(--purple)', flexShrink:0 }}/>
                    <div className="grow">
                      <div style={{ fontWeight:600, fontSize:13 }}>{FASE_SPRINT[s.nomeFase]}</div>
                      <div style={{ fontSize:11.5, color:'var(--text-muted)', fontFamily:'var(--font-mono)' }}>{formatDateShort(s.dataInicio)} → {formatDateShort(s.dataFim)} · {daysBetween(s.dataInicio, s.dataFim)+1} dias</div>
                    </div>
                    <Badge value={s.status} type="sprint"/>
                    <button className="btn btn-ghost btn-sm" onClick={() => onTimesheets(projeto.id, s.id)}>Timesheets</button>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard title="Change Requests" actionLabel="Ver todos" onAction={() => onChangeRequests(projeto.id)} style={{ marginTop:16 }}>
            {projCRs.length === 0 ? <Empty title="Nenhum change request" desc="Mudanças de escopo aparecerão aqui."/> : (
              <div className="col gap-12">
                {projCRs.map(cr => (
                  <div key={cr.id} style={{ display:'flex', justifyContent:'space-between', gap:16, paddingTop:12, borderTop:'1px solid var(--border)' }}>
                    <div className="grow" style={{ minWidth:0 }}>
                      <div style={{ fontSize:11.5, color:'var(--text-muted)', fontFamily:'var(--font-mono)', marginBottom:4 }}>CR #{cr.id} · {formatDate(cr.dataAprovacao)}</div>
                      <div style={{ fontSize:13, lineHeight:1.5, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{cr.descricaoMudanca}</div>
                    </div>
                    <div className="mono" style={{ fontWeight:600, color:'var(--success-text)', fontSize:14, whiteSpace:'nowrap' }}>+{formatBRL(cr.valorAdicional)}</div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <div style={{ marginTop:32, paddingTop:20, borderTop:'1px solid var(--border)' }}>
            <button className="btn btn-danger-ghost" onClick={() => setConfirmOpen(true)}><Icon name="trash" size={14}/>Excluir projeto</button>
          </div>
        </div>

        {/* Side — Resumo financeiro */}
        <div className="card" style={{ padding:0, position:'sticky', top:0, overflow:'hidden' }}>
          <div style={{ padding:'18px 20px', background:'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', color:'white', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle at 90% 20%, rgba(255,255,255,0.15), transparent 50%)' }}/>
            <div style={{ position:'relative' }}>
              <div style={{ fontSize:10.5, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', color:'rgba(255,255,255,0.6)', marginBottom:8 }}>Resumo financeiro</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.7)', marginBottom:4 }}>Budget total</div>
              <div className="mono" style={{ fontSize:24, fontWeight:700, color:'white', letterSpacing:'-0.01em' }}>{formatBRL(projeto.budgetTotal)}</div>
            </div>
          </div>
          <div style={{ padding:20 }}>
            <div style={{ marginBottom:12 }}><Progress pct={pct} color={color} height={10}/></div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:20 }}>
              <span className="mono muted">{formatBRL(projeto.custoAtualAcumulado)}</span>
              <span className="mono" style={{ fontWeight:700, color }}>{pct}%</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:12, paddingTop:16, borderTop:'1px solid var(--border)' }}>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span style={{ color:'var(--text-secondary)', fontSize:12.5 }}>Custo acumulado</span>
                <span className="mono" style={{ fontWeight:600, fontSize:13 }}>{formatBRL(projeto.custoAtualAcumulado)}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span style={{ color:'var(--text-secondary)', fontSize:12.5 }}>Margem disponível</span>
                <span className="mono" style={{ fontWeight:600, fontSize:13, color: margem < 0 ? 'var(--danger)' : 'var(--success-text)' }}>{formatBRL(margem)}</span>
              </div>
            </div>
            <button className="btn btn-secondary" style={{ width:'100%', marginTop:18 }} onClick={() => onFinanceiro(projeto.id)}>
              Ver análise completa <Icon name="arrow_right" size={14}/>
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Excluir este projeto?"
        message={<>Esta ação removerá o projeto <strong>{projeto.nome}</strong> e todos os dados associados. Não pode ser desfeita.</>}
        confirmLabel="Excluir definitivamente"
        onConfirm={() => { setConfirmOpen(false); onDelete(); }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

const SectionCard = ({ title, actionLabel, onAction, children, style }) => (
  <div className="card" style={{ padding:20, ...style }}>
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
      <div style={{ fontSize:14, fontWeight:600 }}>{title}</div>
      {actionLabel && <button className="btn btn-ghost btn-sm" onClick={onAction}>{actionLabel}<Icon name="arrow_right" size={12}/></button>}
    </div>
    {children}
  </div>
);

const DetalheField = ({ label, value, editing, onChange, type='text', options, optionsLabels }) => (
  <div className="field">
    <div className="field-label">{label}</div>
    {editing ? (
      type === 'select' ? (
        <select className="select" value={value} onChange={e => onChange(e.target.value)}>
          {options.map(o => <option key={o} value={o}>{optionsLabels?.[o]?.label || o}</option>)}
        </select>
      ) : <input className="input" type={type} value={value} onChange={e => onChange(e.target.value)}/>
    ) : <div style={{ fontSize:14, fontWeight:500 }}>{value}</div>}
  </div>
);

// ——————————————————————————————————————————————
// SPRINTS
// ——————————————————————————————————————————————
const SprintsPage = ({ projeto, sprints, onCreate, onUpdate, onDelete, onTimesheets }) => {
  const [modal, setModal] = React.useState(null);
  const projSprints = [...sprints].sort((a,b) => a.dataInicio.localeCompare(b.dataInicio));
  const toast = useToast();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Sprints</h1>
          <div className="page-sub">{projSprints.length} sprints planejadas neste projeto</div>
        </div>
        <button className="btn btn-primary" onClick={() => setModal({ mode:'new', data:{ nomeFase:'DESENVOLVIMENTO', dataInicio:'', dataFim:'', status:'PLANEJADA' } })}>
          <Icon name="plus" size={14}/>Nova sprint
        </button>
      </div>

      <div style={{ position:'relative', maxWidth:880 }}>
        <div style={{ position:'absolute', left:19, top:12, bottom:12, width:2, background:'var(--border)' }}/>
        {projSprints.map(s => {
          const dias = daysBetween(s.dataInicio, s.dataFim) + 1;
          const dotColor = STATUS_SPRINT[s.status]?.fg || '#94A3B8';
          return (
            <div key={s.id} style={{ position:'relative', paddingLeft:56, marginBottom:16 }}>
              <div style={{ position:'absolute', left:12, top:16, width:16, height:16, borderRadius:'50%', background:'white', border:`3px solid ${dotColor}` }}/>
              <div className="card" style={{ padding:18, display:'flex', alignItems:'center', gap:16 }}>
                <div style={{ flex:'0 0 180px' }}>
                  <div style={{ fontSize:11, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:2 }}>Fase</div>
                  <div style={{ fontWeight:600, fontSize:14 }}>{FASE_SPRINT[s.nomeFase]}</div>
                </div>
                <div className="grow">
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}><Badge value={s.status} type="sprint"/></div>
                  <div className="mono" style={{ fontSize:12.5, color:'var(--text-secondary)' }}>{formatDateShort(s.dataInicio)} → {formatDateShort(s.dataFim)} · {dias} dias</div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => onTimesheets(s.id)}>Timesheets</button>
                <div style={{ display:'flex', gap:4 }}>
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setModal({ mode:'edit', data:s })}><Icon name="edit" size={13}/></button>
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => { if (confirm('Excluir sprint?')) { onDelete(s.id); toast.success('Sprint removida.'); } }}><Icon name="trash" size={13}/></button>
                </div>
              </div>
            </div>
          );
        })}
        {projSprints.length === 0 && <Empty title="Nenhuma sprint" desc="Crie a primeira sprint deste projeto."/>}
      </div>

      <SprintModal open={!!modal} mode={modal?.mode} data={modal?.data} onClose={() => setModal(null)}
        onSave={data => {
          if (modal.mode === 'new') { onCreate(data); toast.success('Sprint criada.'); }
          else { onUpdate({ ...modal.data, ...data }); toast.success('Sprint atualizada.'); }
          setModal(null);
        }}
      />
    </div>
  );
};

const SprintModal = ({ open, mode, data, onClose, onSave }) => {
  const [draft, setDraft] = React.useState(data || {});
  const [error, setError] = React.useState('');
  React.useEffect(() => { setDraft(data || {}); setError(''); }, [data]);
  const submit = () => {
    if (!draft.nomeFase || !draft.dataInicio || !draft.dataFim) { setError('Preencha todos os campos obrigatórios.'); return; }
    if (draft.dataFim <= draft.dataInicio) { setError('Data fim deve ser maior que data início.'); return; }
    onSave(draft);
  };
  return (
    <Modal open={open} title={mode === 'new' ? 'Nova sprint' : 'Editar sprint'} onClose={onClose}
      footer={<><button className="btn btn-secondary" onClick={onClose}>Cancelar</button><button className="btn btn-primary" onClick={submit}>Salvar</button></>}>
      <div className="form-grid">
        <div className="field"><label className="field-label">Fase *</label>
          <select className="select" value={draft.nomeFase || ''} onChange={e => setDraft({...draft, nomeFase: e.target.value})}>
            {Object.entries(FASE_SPRINT).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div className="form-grid form-grid-2">
          <div className="field"><label className="field-label">Data início *</label><input className="input" type="date" value={draft.dataInicio || ''} onChange={e => setDraft({...draft, dataInicio: e.target.value})}/></div>
          <div className="field"><label className="field-label">Data fim *</label><input className="input" type="date" value={draft.dataFim || ''} onChange={e => setDraft({...draft, dataFim: e.target.value})}/></div>
        </div>
        <div className="field"><label className="field-label">Status *</label>
          <select className="select" value={draft.status || 'PLANEJADA'} onChange={e => setDraft({...draft, status: e.target.value})}>
            {Object.entries(STATUS_SPRINT).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        {error && <div className="field-error" style={{ background:'var(--danger-soft)', padding:'10px 12px', borderRadius:6 }}>{error}</div>}
      </div>
    </Modal>
  );
};

// ——————————————————————————————————————————————
// TIMESHEET
// ——————————————————————————————————————————————
const TimesheetPage = ({ projeto, sprint, timesheets, desenvolvedores, onCreate, onUpdate, onDelete }) => {
  const [drawer, setDrawer] = React.useState(null);
  const toast = useToast();
  const isEstourado = projeto.status === 'ESTOURADO';
  const totalHoras = timesheets.reduce((s,t) => s + (t.horasTrabalhadas || 0), 0);
  const totalExtras = timesheets.reduce((s,t) => s + (t.horasExtras || 0), 0);
  const totalCusto = timesheets.reduce((s,t) => {
    const dev = desenvolvedores.find(d => d.id === t.desenvolvedorId);
    if (!dev) return s;
    return s + (t.horasTrabalhadas * dev.valorHoraCusto) + (t.horasExtras * dev.valorHoraExtra);
  }, 0);
  const dias = daysBetween(sprint.dataInicio, sprint.dataFim) + 1;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Timesheet — {FASE_SPRINT[sprint.nomeFase]}</h1>
          <div className="page-sub">{formatDate(sprint.dataInicio)} a {formatDate(sprint.dataFim)} · {dias} dias</div>
        </div>
        <button className="btn btn-primary" disabled={isEstourado}
          title={isEstourado ? 'Budget esgotado — nenhum novo custo pode ser registrado' : ''}
          onClick={() => setDrawer({ mode:'new', data:{ dataRegistro: new Date().toISOString().slice(0,10), desenvolvedorId:'', descricaoTarefa:'', horasTrabalhadas:0, horasExtras:0 } })}>
          <Icon name="plus" size={14}/>Novo registro
        </button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:24 }}>
        <KpiCard label="Horas trabalhadas" value={totalHoras.toLocaleString('pt-BR') + 'h'} sub={`${timesheets.length} registros`} icon="clock"/>
        <KpiCard label="Horas extras" value={totalExtras.toLocaleString('pt-BR') + 'h'} sub={totalExtras > 0 ? 'Inclui finais de semana' : 'Sem extras'} icon="warning" tone="warning"/>
        <KpiCard label="Custo estimado" value={formatBRL(totalCusto)} sub="Calculado no front-end" icon="api" tone="primary"/>
      </div>

      {timesheets.length === 0 ? <div className="card"><Empty title="Nenhum registro" desc="Adicione apontamentos de horas para esta sprint."/></div> : (
        <div className="card" style={{ overflow:'hidden' }}>
          <table className="table">
            <thead><tr><th>Data</th><th>Desenvolvedor</th><th>Tarefa</th><th style={{ textAlign:'right' }}>Horas</th><th style={{ textAlign:'right' }}>Extras</th><th style={{ textAlign:'right' }}>Custo estimado</th><th className="col-actions"></th></tr></thead>
            <tbody>
              {timesheets.map(t => {
                const dev = desenvolvedores.find(d => d.id === t.desenvolvedorId);
                const custo = dev ? (t.horasTrabalhadas * dev.valorHoraCusto) + (t.horasExtras * dev.valorHoraExtra) : 0;
                return (
                  <tr key={t.id}>
                    <td className="col-mono">{formatDate(t.dataRegistro)}</td>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div className="avatar" style={{ width:26, height:26, fontSize:10 }}>{initials(dev?.nome)}</div>
                        <div><div style={{ fontWeight:500 }}>{dev?.nome}</div><Badge value={dev?.senioridade} type="senioridade"/></div>
                      </div>
                    </td>
                    <td><div style={{ maxWidth:320 }} className="truncate" title={t.descricaoTarefa}>{t.descricaoTarefa}</div></td>
                    <td className="col-mono" style={{ textAlign:'right' }}>{t.horasTrabalhadas.toLocaleString('pt-BR')}h</td>
                    <td className="col-mono" style={{ textAlign:'right', color: t.horasExtras > 0 ? 'var(--warning-text)' : 'var(--text-muted)' }}>{t.horasExtras > 0 ? t.horasExtras.toLocaleString('pt-BR') + 'h' : '—'}</td>
                    <td className="col-mono" style={{ textAlign:'right', fontWeight:600 }}>{formatBRL(custo)}</td>
                    <td className="col-actions">
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setDrawer({ mode:'edit', data:t })}><Icon name="edit" size={13}/></button>
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => { if(confirm('Excluir registro?')) { onDelete(t.id); toast.success('Registro removido.'); } }}><Icon name="trash" size={13}/></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} style={{ textAlign:'right' }}>Totais</td>
                <td className="col-mono" style={{ textAlign:'right' }}>{totalHoras}h</td>
                <td className="col-mono" style={{ textAlign:'right' }}>{totalExtras}h</td>
                <td className="col-mono" style={{ textAlign:'right' }}>{formatBRL(totalCusto)}</td>
                <td/>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <Drawer open={!!drawer} title={drawer?.mode === 'new' ? 'Novo apontamento' : 'Editar apontamento'} onClose={() => setDrawer(null)}
        footer={<>
          <button className="btn btn-secondary" onClick={() => setDrawer(null)}>Cancelar</button>
          <button className="btn btn-primary" onClick={() => {
            const d = drawer.data;
            if (!d.desenvolvedorId || !d.dataRegistro || !d.descricaoTarefa || d.horasTrabalhadas <= 0) { toast.error('Preencha todos os campos obrigatórios.'); return; }
            if (d.dataRegistro > new Date().toISOString().slice(0,10)) { toast.error('Data não pode ser futura.'); return; }
            if (drawer.mode === 'new') { onCreate(d); toast.success('Registro criado.'); }
            else { onUpdate(d); toast.success('Registro atualizado.'); }
            setDrawer(null);
          }}>Salvar</button>
        </>}>
        {drawer && (
          <div className="form-grid">
            <div className="field"><label className="field-label">Data do registro *</label><input className="input" type="date" value={drawer.data.dataRegistro || ''} onChange={e => setDrawer({...drawer, data:{...drawer.data, dataRegistro: e.target.value}})}/><div className="field-hint">Não pode ser data futura</div></div>
            <div className="field"><label className="field-label">Desenvolvedor *</label>
              <select className="select" value={drawer.data.desenvolvedorId || ''} onChange={e => setDrawer({...drawer, data:{...drawer.data, desenvolvedorId: parseInt(e.target.value)}})}>
                <option value="">Selecione…</option>
                {desenvolvedores.map(d => <option key={d.id} value={d.id}>{d.nome} · {SENIORIDADE[d.senioridade].label}</option>)}
              </select>
            </div>
            <div className="field"><label className="field-label">Descrição da tarefa *</label><textarea className="textarea" placeholder="O que foi feito?" value={drawer.data.descricaoTarefa || ''} onChange={e => setDrawer({...drawer, data:{...drawer.data, descricaoTarefa: e.target.value}})}/></div>
            <div className="form-grid form-grid-2">
              <div className="field"><label className="field-label">Horas trabalhadas *</label><input className="input" type="number" step="0.5" min="0" value={drawer.data.horasTrabalhadas || 0} onChange={e => setDrawer({...drawer, data:{...drawer.data, horasTrabalhadas: parseFloat(e.target.value)||0}})}/></div>
              <div className="field"><label className="field-label">Horas extras</label><input className="input" type="number" step="0.5" min="0" value={drawer.data.horasExtras || 0} onChange={e => setDrawer({...drawer, data:{...drawer.data, horasExtras: parseFloat(e.target.value)||0}})}/></div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

const KpiCard = ({ label, value, sub, icon, tone }) => {
  const toneColor = tone === 'warning' ? 'var(--warning-text)' : tone === 'primary' ? 'var(--purple)' : tone === 'danger' ? 'var(--danger)' : tone === 'success' ? 'var(--success-text)' : 'var(--text-secondary)';
  const toneBg = tone === 'warning' ? 'var(--warning-soft)' : tone === 'primary' ? 'var(--purple-soft)' : tone === 'danger' ? 'var(--danger-soft)' : tone === 'success' ? 'var(--success-soft)' : 'var(--bg-subtle)';
  return (
    <div className="card kpi-pop" style={{ padding:18, overflow:'hidden', position:'relative' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
        <div style={{ width:34, height:34, borderRadius:9, background:toneBg, color:toneColor, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`inset 0 0 0 1px ${toneColor}22` }}>
          <Icon name={icon} size={16}/>
        </div>
        <div style={{ fontSize:11, color:'var(--text-secondary)', letterSpacing:'0.06em', textTransform:'uppercase', fontWeight:600 }}>{label}</div>
      </div>
      <div className="mono" style={{ fontSize:24, fontWeight:700, marginBottom:2, letterSpacing:'-0.01em' }}>{value}</div>
      {sub && <div style={{ fontSize:11.5, color:'var(--text-muted)' }}>{sub}</div>}
      <div style={{ position:'absolute', right:-30, top:-30, width:90, height:90, borderRadius:'50%', background:`radial-gradient(circle, ${toneBg}, transparent 70%)`, pointerEvents:'none', opacity:0.7 }}/>
    </div>
  );
};

// ——————————————————————————————————————————————
// CHANGE REQUESTS
// ——————————————————————————————————————————————
const ChangeRequestsPage = ({ projeto, changeRequests, onCreate, onUpdate, onDelete }) => {
  const [modal, setModal] = React.useState(null);
  const [expanded, setExpanded] = React.useState({});
  const toast = useToast();
  const total = changeRequests.reduce((s,c) => s + (c.valorAdicional || 0), 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Change Requests</h1>
          <div className="page-sub">{changeRequests.length} CRs aprovados · total adicional <span className="mono" style={{ color:'var(--success-text)', fontWeight:600 }}>+{formatBRL(total)}</span></div>
        </div>
        <button className="btn btn-primary" onClick={() => setModal({ mode:'new', data:{ descricaoMudanca:'', valorAdicional:0, dataAprovacao: new Date().toISOString().slice(0,10) } })}>
          <Icon name="plus" size={14}/>Registrar Change Request
        </button>
      </div>

      <div className="col gap-12" style={{ maxWidth:880 }}>
        {changeRequests.length === 0 && <div className="card"><Empty title="Nenhum CR registrado" desc="Mudanças de escopo aparecerão aqui."/></div>}
        {changeRequests.map(cr => {
          const isExpanded = expanded[cr.id];
          return (
            <div key={cr.id} className="card" style={{ padding:20 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontFamily:'var(--font-mono)', fontWeight:600, fontSize:13 }}>CR #{cr.id}</span>
                  <span style={{ display:'flex', alignItems:'center', gap:6, color:'var(--text-muted)', fontSize:12 }}><Icon name="calendar" size={12}/>{formatDate(cr.dataAprovacao)}</span>
                </div>
                <div style={{ display:'flex', gap:4 }}>
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setModal({ mode:'edit', data:cr })}><Icon name="edit" size={13}/></button>
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => { if(confirm('Excluir CR?')) { onDelete(cr.id); toast.success('CR removido.'); } }}><Icon name="trash" size={13}/></button>
                </div>
              </div>
              <div style={{ fontSize:13.5, lineHeight:1.6, marginBottom:14, ...(isExpanded ? {} : { display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }) }}>{cr.descricaoMudanca}</div>
              {cr.descricaoMudanca.length > 200 && <button className="btn btn-ghost btn-sm" style={{ marginBottom:14, padding:'0 4px' }} onClick={() => setExpanded(s => ({...s, [cr.id]: !isExpanded}))}>{isExpanded ? 'ver menos' : 'ver mais'}</button>}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', paddingTop:12, borderTop:'1px solid var(--border)' }}>
                <span style={{ fontSize:11, color:'var(--text-muted)', marginRight:10 }}>Valor adicional aprovado</span>
                <span className="mono" style={{ color:'var(--success-text)', fontWeight:700, fontSize:18 }}>+{formatBRL(cr.valorAdicional)}</span>
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={!!modal} size="lg" title={modal?.mode === 'new' ? 'Registrar Change Request' : 'Editar Change Request'} onClose={() => setModal(null)}
        footer={<>
          <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancelar</button>
          <button className="btn btn-primary" onClick={() => {
            const d = modal.data;
            if (!d.descricaoMudanca || !d.valorAdicional || !d.dataAprovacao) { toast.error('Preencha todos os campos.'); return; }
            if (modal.mode === 'new') { onCreate(d); toast.success('CR registrado.'); }
            else { onUpdate(d); toast.success('CR atualizado.'); }
            setModal(null);
          }}>Salvar</button>
        </>}>
        {modal && (
          <div className="form-grid">
            <div className="field"><label className="field-label">Descrição da mudança *</label><textarea className="textarea" style={{ minHeight:140 }} placeholder="Descreva a alteração de escopo aprovada…" value={modal.data.descricaoMudanca || ''} onChange={e => setModal({...modal, data:{...modal.data, descricaoMudanca: e.target.value}})}/></div>
            <div className="form-grid form-grid-2">
              <div className="field"><label className="field-label">Valor adicional (R$) *</label><input className="input" type="number" step="0.01" value={modal.data.valorAdicional || 0} onChange={e => setModal({...modal, data:{...modal.data, valorAdicional: parseFloat(e.target.value)||0}})}/></div>
              <div className="field"><label className="field-label">Data de aprovação *</label><input className="input" type="date" value={modal.data.dataAprovacao || ''} onChange={e => setModal({...modal, data:{...modal.data, dataAprovacao: e.target.value}})}/></div>
            </div>
            <div style={{ background:'var(--purple-soft)', border:'1px solid var(--purple-border)', borderRadius:8, padding:12, color:'var(--purple-dark)', fontSize:12.5, display:'flex', gap:8 }}>
              <Icon name="info" size={14}/><span>Este valor será adicionado ao budget do projeto e poderá impactar o status do Budget Guard.</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// ——————————————————————————————————————————————
// FINANCEIRO — DRE
// ——————————————————————————————————————————————
const FinanceiroPage = ({ projeto, custosApi, custosCloud, timesheets, sprints, desenvolvedores, changeRequests }) => {
  const toast = useToast();
  const projSprints = sprints.filter(s => s.projetoId === projeto.id).map(s => s.id);
  const projTimesheets = timesheets.filter(t => projSprints.includes(t.sprintId));
  const custoDevs = projTimesheets.reduce((s,t) => {
    const dev = desenvolvedores.find(d => d.id === t.desenvolvedorId);
    if (!dev) return s;
    return s + (t.horasTrabalhadas * dev.valorHoraCusto) + (t.horasExtras * dev.valorHoraExtra);
  }, 0);
  const custoApiTotal = custosApi.filter(c => c.projetoId === projeto.id).reduce((s,c) => s + c.quantidadeChamadas * c.custoPorChamada, 0);
  const custoCloudTotal = custosCloud.filter(c => c.projetoId === projeto.id).reduce((s,c) => s + c.valorMensal, 0);
  const crTotal = changeRequests.filter(c => c.projetoId === projeto.id).reduce((s,c) => s + c.valorAdicional, 0);
  const budget = projeto.budgetTotal;
  const custo = projeto.custoAtualAcumulado;
  const margem = budget - custo;
  const margemPct = budget > 0 ? (margem / budget) * 100 : 0;
  const burn = burnRate(projeto);
  const alerta = projeto.status === 'ESTOURADO' || projeto.status === 'ALERTA';

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title gradient-text">Análise Financeira</h1>
          <div className="page-sub" style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span>{projeto.nome}</span><Badge value={projeto.status} type="projeto"/>
          </div>
        </div>
        <button className="btn btn-secondary" onClick={() => toast.success('Closeout PDF gerado (mock).')}>
          <Icon name="download" size={14}/>Baixar PDF Closeout
        </button>
      </div>

      {alerta && (
        <div style={{ marginBottom:20 }}>
          {projeto.status === 'ESTOURADO' && <Banner kind="danger" pulse title="Risco imediato — budget esgotado">Custo acumulado ultrapassou {burn}% do budget aprovado. Bloqueio automático de novos custos ativo.</Banner>}
          {projeto.status === 'ALERTA' && <Banner kind="warning">Projeto em zona de alerta ({burn}% do budget). Revise alocação de horas e custos recorrentes.</Banner>}
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
        <KpiCard label="Budget total"  value={formatBRLCompact(budget)} sub={formatBRL(budget)} icon="file" tone="primary"/>
        <KpiCard label="Custo atual"   value={formatBRLCompact(custo)}  sub={formatBRL(custo)}  icon="api" tone="warning"/>
        <KpiCard label="Margem bruta"  value={formatBRLCompact(margem)} sub={`${margemPct.toFixed(1)}% da receita`} icon="check" tone={margem >= 0 ? 'success' : 'danger'}/>
        <KpiCard label="Burn rate"     value={`${burn}%`} sub={burn >= 100 ? 'Estourado' : burn >= 80 ? 'Alerta' : 'Saudável'} icon="warning" tone={burn >= 100 ? 'danger' : burn >= 80 ? 'warning' : 'success'}/>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'320px 1fr', gap:20 }}>
        <div className="card" style={{ padding:24, display:'flex', flexDirection:'column', alignItems:'center', overflow:'hidden', position:'relative' }}>
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at top, rgba(99,102,241,0.06), transparent 60%)', pointerEvents:'none' }}/>
          <div style={{ fontSize:11, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:12, alignSelf:'flex-start', position:'relative' }}>Burn Rate</div>
          <div style={{ position:'relative' }}><Gauge pct={burn}/></div>
          <div style={{ marginTop:16, textAlign:'center', position:'relative' }}>
            <div className="mono" style={{ fontSize:36, fontWeight:800, color:burnColor(Math.min(burn,100)), letterSpacing:'-0.02em', lineHeight:1 }}>{burn}%</div>
            <div style={{ fontSize:12, color:'var(--text-secondary)', marginTop:6 }}>do budget consumido</div>
          </div>
        </div>

        <div className="card" style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'18px 20px 12px', borderBottom:'1px solid var(--border)' }}>
            <div style={{ fontSize:11, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color:'var(--text-muted)' }}>DRE — Demonstrativo de Resultado</div>
          </div>
          <table className="table">
            <tbody>
              <DRERow label="Budget aprovado" value={budget} positive bold/>
              <DRERow label="(+) Change Requests aprovados" value={crTotal} positive sub={`${changeRequests.filter(c=>c.projetoId===projeto.id).length} CRs`}/>
              <DRERow label="(−) Custo de desenvolvedores" value={-custoDevs} sub={`${projTimesheets.length} apontamentos`}/>
              <DRERow label="(−) Custo de APIs" value={-custoApiTotal} sub={custosApi.filter(c=>c.projetoId===projeto.id).length + ' lançamentos'}/>
              <DRERow label="(−) Custo de cloud" value={-custoCloudTotal} sub={custosCloud.filter(c=>c.projetoId===projeto.id).length + ' serviços ativos'}/>
            </tbody>
            <tfoot>
              <tr>
                <td>Margem disponível</td>
                <td className="col-mono" style={{ textAlign:'right', color: margem < 0 ? 'var(--danger)' : 'var(--success-text)' }}>{formatBRL(margem)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

const Gauge = ({ pct }) => {
  const clamped = Math.min(Math.max(pct, 0), 110);
  const [animated, setAnimated] = React.useState(0);
  React.useEffect(() => {
    let raf, start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / 1100, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimated(clamped * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [clamped]);

  const cx = 110, cy = 110, radius = 90;
  const polar = (deg, r) => { const rad = (deg - 90) * Math.PI / 180; return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]; };
  const arcPath = (from, to) => {
    const a1 = (from / 100) * 180, a2 = (to / 100) * 180;
    const [x1,y1] = polar(a1, radius), [x2,y2] = polar(a2, radius);
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${(a2-a1) > 180 ? 1 : 0} 1 ${x2} ${y2}`;
  };
  const angle = (animated / 100) * 180 - 90;
  const needleRad = angle * Math.PI / 180;
  const nx = cx + (radius - 6) * Math.cos(needleRad);
  const ny = cy + (radius - 6) * Math.sin(needleRad);

  return (
    <svg viewBox="0 0 220 130" style={{ width:220, height:130, filter:'drop-shadow(0 4px 12px rgba(15,23,42,0.08))' }}>
      <defs>
        <linearGradient id="g-green" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#16A34A"/><stop offset="1" stopColor="#22C55E"/></linearGradient>
        <linearGradient id="g-amber" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#F59E0B"/><stop offset="1" stopColor="#FBBF24"/></linearGradient>
        <linearGradient id="g-orange" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#F97316"/><stop offset="1" stopColor="#FB923C"/></linearGradient>
        <linearGradient id="g-red" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#EF4444"/><stop offset="1" stopColor="#DC2626"/></linearGradient>
      </defs>
      <path d={arcPath(0,100)} stroke="#E2E8F0" strokeWidth="14" fill="none" strokeLinecap="round"/>
      <path d={arcPath(0,60)} stroke="url(#g-green)" strokeWidth="14" fill="none" strokeLinecap="round"/>
      <path d={arcPath(60,80)} stroke="url(#g-amber)" strokeWidth="14" fill="none" strokeLinecap="round"/>
      <path d={arcPath(80,100)} stroke="url(#g-orange)" strokeWidth="14" fill="none" strokeLinecap="round"/>
      {pct >= 100 && <path d={arcPath(100, Math.min(110,pct))} stroke="url(#g-red)" strokeWidth="14" fill="none" strokeLinecap="round"/>}
      {[0,25,50,75,100].map(t => { const [x1,y1]=polar((t/100)*180,radius-12); const [x2,y2]=polar((t/100)*180,radius+4); return <line key={t} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94A3B8" strokeWidth="1"/>; })}
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#0F172A" strokeWidth="3" strokeLinecap="round"/>
      <circle cx={cx} cy={cy} r="8" fill="#0F172A"/>
      <circle cx={cx} cy={cy} r="3" fill="white"/>
    </svg>
  );
};

const DRERow = ({ label, value, sub, positive, bold }) => (
  <tr>
    <td>
      <div style={{ fontWeight: bold ? 600 : 500, fontSize:13.5 }}>{label}</div>
      {sub && <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>{sub}</div>}
    </td>
    <td className="col-mono" style={{ textAlign:'right', fontWeight: bold ? 600 : 500, fontSize:14, color: positive ? 'var(--success-text)' : value < 0 ? 'var(--danger-dark)' : undefined }}>
      {value < 0 ? '−' : ''}{formatBRL(Math.abs(value))}
    </td>
  </tr>
);

Object.assign(window, {
  LandingPage, LoginPage,
  ProjetosLista, ProjetoDetalhe, SprintsPage, TimesheetPage, ChangeRequestsPage, FinanceiroPage,
});
