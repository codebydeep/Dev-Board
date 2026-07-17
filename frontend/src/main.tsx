import { FormEvent, useEffect, useState, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

// ── Types ──────────────────────────────────────────────────────────────────────
type Project  = { id: number; title: string; description?: string; createdAt: string }
type Task     = { id: number; projectId: number; title: string; description?: string; status: Status; priority: Priority; dueDate?: string }
type Collab   = { id: number; projectId: number; userId: number; createdAt: string }
type Status   = 'TODO' | 'IN_PROGRESS' | 'DONE'
type Priority = 'LOW' | 'MEDIUM' | 'HIGH'
type Page<T>  = { content: T[]; totalElements: number; totalPages: number }

// ── API ────────────────────────────────────────────────────────────────────────
const api = async <T,>(path: string, opts: RequestInit = {}): Promise<T> => {
  const r = await fetch(path, { ...opts, headers: { 'Content-Type': 'application/json', ...opts.headers } })
  const b = await r.json().catch(() => null)
  if (!r.ok) throw new Error(b?.message || `Error ${r.status}`)
  return b as T
}
const kh = (k: string) => ({ 'X-API-Key': k })

// ── Avatar colours ─────────────────────────────────────────────────────────────
const AVATAR_COLORS = ['#7c3aed','#a855f7','#6366f1','#8b5cf6','#c084fc','#818cf8']
function initials(name: string) { return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2) }
function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const color = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 700, fontSize: size * 0.36, flexShrink: 0, border: '2px solid #1e1b2e' }}>
      {initials(name)}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
//  LANDING PAGE
// ══════════════════════════════════════════════════════════════════════════════
function LandingPage({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="landing">
      {/* ── Navbar ── */}
      <nav className="land-nav">
        <div className="land-logo">
          <span className="land-logo-icon">◆</span> DevBoard
        </div>
        <div className="land-nav-links">
          <a href="#">Pricing</a>
          <a href="#">Features</a>
          <a href="#">Use cases ▾</a>
        </div>
        <div className="land-nav-actions">
          <button className="land-signin" onClick={onEnter}>Sign In</button>
          <button className="land-demo" onClick={onEnter}>Get started</button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="land-hero">
        <h1 className="land-headline">
          Team collaboration for<br />
          <span className="land-headline-accent">new startups that scale</span>
        </h1>

        {/* ── Orbital diagram ── */}
        <div className="orbital-wrap">
          {/* Rings */}
          <div className="ring ring-1" />
          <div className="ring ring-2" />
          <div className="ring ring-3" />

          {/* Centre CTA */}
          <button className="orbital-cta" onClick={onEnter}>
            <span className="orbital-cta-icon">✦</span> Get started for free
          </button>

          {/* Floating avatars */}
          <div className="orb orb-top-left">
            <img src="https://i.pravatar.cc/72?img=12" alt="team member" />
          </div>
          <div className="orb orb-top-center">
            <img src="https://i.pravatar.cc/72?img=33" alt="team member" />
          </div>
          <div className="orb orb-top-right">
            <img src="https://i.pravatar.cc/72?img=47" alt="team member" />
          </div>
          <div className="orb orb-bottom-left">
            <img src="https://i.pravatar.cc/72?img=52" alt="team member" />
          </div>
          <div className="orb orb-bottom-center">
            <img src="https://i.pravatar.cc/72?img=68" alt="team member" />
          </div>
          <div className="orb orb-bottom-right">
            <img src="https://i.pravatar.cc/72?img=25" alt="team member" />
          </div>

          {/* Icon badges */}
          <div className="icon-badge badge-lock">🔒</div>
          <div className="icon-badge badge-cursor">👆</div>
          <div className="icon-badge badge-like">👍</div>
        </div>

        {/* ── Cursor decoration ── */}
        <div className="land-cursor">▶</div>
      </section>

      {/* ── Backers strip ── */}
      <footer className="land-backers">
        <p>Backed by leading e-commerce investors and founders</p>
        <div className="backer-logos">
          <span>⚡ Flash</span>
          <span>◉ Invert</span>
          <span>ℍ Hitech</span>
          <span>⚙ Proline</span>
          <span>◎ DevWise</span>
          <span>⚡ Flash</span>
        </div>
      </footer>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
//  AUTH SCREEN  (dark themed, matches app)
// ══════════════════════════════════════════════════════════════════════════════
function AuthScreen({ onAuthenticated, onBack }: { onAuthenticated: (t: string) => void; onBack: () => void }) {
  const [mode, setMode]       = useState<'login'|'register'>('login')
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [password, setPass]   = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault(); setError('')
    if (mode === 'register' && password !== confirm) return setError('Passwords do not match.')
    setLoading(true)
    try {
      if (mode === 'register')
        await api('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) })
      const { accessToken } = await api<{ accessToken: string }>('/auth/login', {
        method: 'POST', body: JSON.stringify({ email, password }),
      })
      onAuthenticated(accessToken)
    } catch (err) { setError((err as Error).message) }
    finally { setLoading(false) }
  }

  return (
    <div className="auth-screen">
      <button className="auth-back" onClick={onBack}>← Back</button>
      <div className="auth-box">
        <div className="auth-brand"><span>◆</span> DevBoard</div>
        <div className="auth-tabs">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Sign in</button>
          <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Register</button>
        </div>
        <h2 className="auth-title">{mode === 'login' ? 'Welcome back' : 'Create your workspace'}</h2>
        <form onSubmit={submit} className="auth-form">
          {mode === 'register' && (
            <label>Full name<input value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" required /></label>
          )}
          <label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required /></label>
          <label>Password<input type="password" value={password} onChange={e => setPass(e.target.value)} placeholder="Min. 8 characters" minLength={8} required /></label>
          {mode === 'register' && (
            <label>Confirm password<input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat password" required /></label>
          )}
          {error && <p className="auth-error">{error}</p>}
          <button className="auth-submit" disabled={loading}>{loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}</button>
        </form>
        <p className="auth-switch">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Register' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
//  API-KEY SETUP SCREEN
// ══════════════════════════════════════════════════════════════════════════════
function SetupScreen({ token, onReady, onLogout }: { token: string; onReady: (k: string) => void; onLogout: () => void }) {
  const [error, setError] = useState('')
  const generate = async () => {
    try {
      const { apiKey } = await api<{ apiKey: string }>('/auth/api-key', {
        method: 'POST', headers: { Authorization: `Bearer ${token}` },
      })
      localStorage.setItem('devboard_key', apiKey)
      onReady(apiKey)
    } catch (e) { setError((e as Error).message) }
  }
  return (
    <div className="setup-screen">
      <div className="setup-card">
        <div className="setup-icon">⌘</div>
        <h2>One last step</h2>
        <p>DevBoard uses an API key to secure your projects. Generate yours to continue.</p>
        {error && <p className="auth-error">{error}</p>}
        <button className="btn-primary" onClick={generate}>Generate API key</button>
        <button className="btn-ghost" onClick={onLogout}>Sign out</button>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
//  MODAL
// ══════════════════════════════════════════════════════════════════════════════
function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal-box" onMouseDown={e => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
//  KANBAN CARD
// ══════════════════════════════════════════════════════════════════════════════
const PRIORITY_COLORS: Record<Priority, string> = {
  HIGH:   '#ef4444',
  MEDIUM: '#f59e0b',
  LOW:    '#22c55e',
}
const STATUS_LABELS: Record<Status, string> = {
  TODO:        'New Request',
  IN_PROGRESS: 'In Progress',
  DONE:        'Complete',
}

function KanbanCard({ task, apiKey, onUpdate, onDelete }: {
  task: Task; apiKey: string; onUpdate: (t: Task) => void; onDelete: (id: number) => void
}) {
  const [editing, setEditing] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const move = async (status: Status) => {
    const updated = await api<Task>(`/tasks/${task.id}`, {
      method: 'PUT', headers: kh(apiKey),
      body: JSON.stringify({ title: task.title, description: task.description||'', priority: task.priority, dueDate: task.dueDate||null, status }),
    })
    onUpdate(updated)
  }

  const del = async () => {
    setMenuOpen(false)
    if (!confirm(`Delete "${task.title}"?`)) return
    await api(`/tasks/${task.id}`, { method: 'DELETE', headers: kh(apiKey) })
    onDelete(task.id)
  }

  return (
    <>
      <div className="k-card">
        <div className="k-card-head">
          <span className="k-priority-tag" style={{ background: PRIORITY_COLORS[task.priority] + '22', color: PRIORITY_COLORS[task.priority] }}>
            {task.priority}
          </span>
          <div style={{ position: 'relative' }}>
            <button className="k-menu-btn" onClick={() => setMenuOpen(v => !v)}>⋯</button>
            {menuOpen && (
              <div className="k-dropdown">
                <button onClick={() => { setMenuOpen(false); setEditing(true) }}>✎ Edit</button>
                {task.status !== 'IN_PROGRESS' && <button onClick={() => { setMenuOpen(false); move('IN_PROGRESS') }}>→ In Progress</button>}
                {task.status !== 'DONE'        && <button onClick={() => { setMenuOpen(false); move('DONE') }}>✓ Mark Done</button>}
                {task.status !== 'TODO'        && <button onClick={() => { setMenuOpen(false); move('TODO') }}>↩ Reopen</button>}
                <button className="danger" onClick={del}>✕ Delete</button>
              </div>
            )}
          </div>
        </div>
        <h4 className="k-card-title">{task.title}</h4>
        {task.description && <p className="k-card-desc">{task.description}</p>}
        <div className="k-card-foot">
          {task.dueDate && <span className="k-due">◷ {new Date(task.dueDate).toLocaleDateString()}</span>}
          <Avatar name={`User ${task.projectId}`} size={24} />
        </div>
      </div>
      {editing && (
        <EditTaskModal task={task} apiKey={apiKey}
          onSave={t => { onUpdate(t); setEditing(false) }}
          onClose={() => setEditing(false)} />
      )}
    </>
  )
}

// ── Edit Task Modal ────────────────────────────────────────────────────────────
function EditTaskModal({ task, apiKey, onSave, onClose }: {
  task: Task; apiKey: string; onSave: (t: Task) => void; onClose: () => void
}) {
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const updated = await api<Task>(`/tasks/${task.id}`, {
      method: 'PUT', headers: kh(apiKey),
      body: JSON.stringify({ title: f.get('title'), description: f.get('description')||'',
        status: f.get('status'), priority: f.get('priority'), dueDate: f.get('dueDate')||null }),
    })
    onSave(updated)
  }
  return (
    <Modal title="Edit task" onClose={onClose}>
      <form onSubmit={submit} className="modal-form">
        <label>Title<input name="title" defaultValue={task.title} required /></label>
        <label>Description<textarea name="description" defaultValue={task.description||''} /></label>
        <div className="form-row">
          <label>Status
            <select name="status" defaultValue={task.status}>
              <option value="TODO">New Request</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Complete</option>
            </select>
          </label>
          <label>Priority
            <select name="priority" defaultValue={task.priority}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </label>
        </div>
        <label>Due date<input name="dueDate" type="date" defaultValue={task.dueDate?.slice(0,10)||''} /></label>
        <button className="btn-primary full">Save changes</button>
      </form>
    </Modal>
  )
}

// ── Collaborators Modal ────────────────────────────────────────────────────────
function CollabModal({ project, apiKey, onClose }: { project: Project; apiKey: string; onClose: () => void }) {
  const [list, setList] = useState<Collab[]>([])
  const [uid, setUid]   = useState('')
  const [err, setErr]   = useState('')
  useEffect(() => {
    api<Collab[]>(`/projects/${project.id}/collaborators`, { headers: kh(apiKey) }).then(setList).catch(()=>{})
  }, [project.id])
  const add = async (e: FormEvent) => {
    e.preventDefault(); setErr('')
    try {
      const c = await api<Collab>(`/projects/${project.id}/collaborators`, {
        method: 'POST', headers: kh(apiKey), body: JSON.stringify({ userId: Number(uid) }),
      })
      setList(p => [...p, c]); setUid('')
    } catch (e) { setErr((e as Error).message) }
  }
  const remove = async (userId: number) => {
    await api(`/projects/${project.id}/collaborators/${userId}`, { method: 'DELETE', headers: kh(apiKey) })
    setList(p => p.filter(c => c.userId !== userId))
  }
  return (
    <Modal title={`Members — ${project.title}`} onClose={onClose}>
      <div className="collab-list">
        {list.length === 0 && <p className="muted-text">No members yet.</p>}
        {list.map(c => (
          <div key={c.id} className="collab-row">
            <Avatar name={`User ${c.userId}`} size={32} />
            <span>User #{c.userId}</span>
            <button className="icon-danger" onClick={() => remove(c.userId)}>✕</button>
          </div>
        ))}
      </div>
      <form onSubmit={add} className="modal-form" style={{ marginTop: 16 }}>
        <label>Add by user ID
          <input type="number" value={uid} onChange={e => setUid(e.target.value)} placeholder="e.g. 42" required min={1} />
        </label>
        {err && <p className="auth-error">{err}</p>}
        <button className="btn-primary full">Add member</button>
      </form>
    </Modal>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
//  MAIN APP (Kanban dashboard)
// ══════════════════════════════════════════════════════════════════════════════
const COLUMNS: { status: Status; label: string; color: string }[] = [
  { status: 'TODO',        label: 'New Request', color: '#7c3aed' },
  { status: 'IN_PROGRESS', label: 'In Progress', color: '#f59e0b' },
  { status: 'DONE',        label: 'Complete',    color: '#22c55e' },
]

function AppDashboard({ token, apiKey, onLogout }: { token: string; apiKey: string; onLogout: () => void }) {
  const [projects, setProjects]     = useState<Project[]>([])
  const [selected, setSelected]     = useState<Project | null>(null)
  const [tasks, setTasks]           = useState<Task[]>([])
  const [notice, setNotice]         = useState('')
  const [showNewProject, setShowNP] = useState(false)
  const [showNewTask, setShowNT]    = useState(false)
  const [showCollabs, setShowColl]  = useState(false)
  const [sidebarOpen, setSidebar]   = useState(true)

  const loadProjects = useCallback(async () => {
    try {
      const list = await api<Project[]>('/projects', { headers: kh(apiKey) })
      setProjects(list)
      setSelected(cur => list.find(p => p.id === cur?.id) || list[0] || null)
    } catch (e) { setNotice((e as Error).message) }
  }, [apiKey])

  const loadTasks = useCallback(async (pid: number) => {
    try {
      const res = await api<Page<Task>>(`/projects/${pid}/tasks?size=100`, { headers: kh(apiKey) })
      setTasks(res.content)
    } catch (e) { setNotice((e as Error).message) }
  }, [apiKey])

  useEffect(() => { loadProjects() }, [loadProjects])
  useEffect(() => { if (selected?.id != null) loadTasks(selected.id); else setTasks([]) }, [selected?.id, loadTasks])

  const createProject = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    try {
      const p = await api<Project>('/projects', { method: 'POST', headers: kh(apiKey),
        body: JSON.stringify({ title: f.get('title'), description: f.get('description') }) })
      setProjects(cur => [p, ...cur]); setSelected(p); setShowNP(false)
    } catch (e) { setNotice((e as Error).message) }
  }

  const deleteProject = async (id: number) => {
    if (!confirm('Delete this project and all its tasks?')) return
    await api(`/projects/${id}`, { method: 'DELETE', headers: kh(apiKey) })
    const rest = projects.filter(p => p.id !== id)
    setProjects(rest); setSelected(rest[0] || null)
  }

  const createTask = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selected) return
    const f = new FormData(e.currentTarget)
    try {
      const t = await api<Task>(`/projects/${selected.id}/tasks`, { method: 'POST', headers: kh(apiKey),
        body: JSON.stringify({ title: f.get('title'), description: f.get('description'),
          priority: f.get('priority'), dueDate: f.get('dueDate')||null }) })
      setTasks(cur => [t, ...cur]); setShowNT(false)
    } catch (e) { setNotice((e as Error).message) }
  }

  const exportProject = async () => {
    if (!selected) return
    const data = await api<object>(`/projects/${selected.id}/export`, { headers: kh(apiKey) })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
    a.download = `${selected.title.replace(/\s+/g,'_')}.json`; a.click()
  }

  const byStatus = (s: Status) => tasks.filter(t => t.status === s)

  return (
    <div className="dashboard">
      {/* ── Left Sidebar ── */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sb-brand">
          <span className="sb-logo">◆</span>
          {sidebarOpen && <span>DevBoard</span>}
        </div>

        <div className="sb-icon-row">
          <button className="sb-icon active" title="Projects">⊞</button>
          <button className="sb-icon" title="Search">⌕</button>
          <button className="sb-icon" title="Notifications">🔔</button>
          <button className="sb-icon" title="Settings">⚙</button>
        </div>

        {sidebarOpen && (
          <>
            <p className="sb-section-label">FAVORITES</p>
            {projects.slice(0, 3).map(p => (
              <div key={`fav-${p.id}`} className={`sb-project-item ${selected?.id === p.id ? 'active' : ''}`} onClick={() => setSelected(p)}>
                <span className="sb-dot" style={{ background: AVATAR_COLORS[p.id % AVATAR_COLORS.length] }} />
                <span className="sb-project-name">{p.title}</span>
              </div>
            ))}

            <p className="sb-section-label" style={{ marginTop: 16 }}>ALL PROJECTS</p>
            {projects.map(p => (
              <div key={`all-${p.id}`} className={`sb-project-item ${selected?.id === p.id ? 'active' : ''}`} onClick={() => setSelected(p)}>
                <span className="sb-dot" style={{ background: AVATAR_COLORS[p.id % AVATAR_COLORS.length] }} />
                <span className="sb-project-name">{p.title}</span>
                <button className="sb-del" onClick={e => { e.stopPropagation(); deleteProject(p.id) }}>✕</button>
              </div>
            ))}
          </>
        )}

        <div className="sb-bottom">
          <button className="sb-new-project" onClick={() => setShowNP(true)}>
            {sidebarOpen ? '+ New Project' : '+'}
          </button>
          <button className="sb-icon" title="Collapse" onClick={() => setSidebar(v => !v)}>
            {sidebarOpen ? '‹' : '›'}
          </button>
          <button className="sb-icon" title="Sign out" onClick={onLogout}>⏻</button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="board-area">
        {/* Top bar */}
        <header className="board-header">
          <div className="board-breadcrumb">
            <span className="board-project-icon">◈</span>
            <span className="board-project-name">{selected?.title || 'Select a project'}</span>
            {selected?.description && <span className="board-sep">›</span>}
            {selected?.description && <span className="board-sub">{selected.description}</span>}
          </div>
          <div className="board-header-actions">
            {selected && (
              <>
                <button className="btn-ghost-sm" onClick={() => setShowColl(true)}>👥 Members</button>
                <button className="btn-ghost-sm" onClick={exportProject}>↓ Export</button>
                <button className="btn-primary-sm" onClick={() => setShowNT(true)}>+ Add task</button>
              </>
            )}
            <div className="board-avatar-stack">
              {['Alice', 'Bob', 'Carol'].map(n => <Avatar key={n} name={n} size={30} />)}
              <div className="avatar-count">+{Math.max(0, tasks.length - 3)}</div>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="board-tabs">
          <button className="board-tab active">⊞ Kanban</button>
          <button className="board-tab">≡ Table</button>
          <button className="board-tab">≣ List View</button>
        </div>

        {notice && (
          <div className="board-notice">
            {notice} <button onClick={() => setNotice('')}>✕</button>
          </div>
        )}

        {/* Kanban columns */}
        {selected ? (
          <div className="kanban">
            {COLUMNS.map(col => (
              <div key={col.status} className="k-column">
                <div className="k-col-header">
                  <span className="k-col-dot" style={{ background: col.color }} />
                  <span className="k-col-label">{col.label}</span>
                  <span className="k-col-count">{byStatus(col.status).length}</span>
                  <button className="k-col-add" onClick={() => setShowNT(true)}>+</button>
                </div>
                <div className="k-cards">
                  {byStatus(col.status).map(t => (
                    <KanbanCard key={t.id} task={t} apiKey={apiKey}
                      onUpdate={updated => setTasks(cur => cur.map(x => x.id === updated.id ? updated : x))}
                      onDelete={id => setTasks(cur => cur.filter(x => x.id !== id))} />
                  ))}
                  {byStatus(col.status).length === 0 && (
                    <div className="k-empty">No tasks here</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="board-empty">
            <div className="board-empty-icon">◆</div>
            <h2>Create your first project</h2>
            <p>Projects keep tasks, deadlines, and priorities in one place.</p>
            <button className="btn-primary" onClick={() => setShowNP(true)}>+ New project</button>
          </div>
        )}
      </main>

      {/* ── Modals ── */}
      {showNewProject && (
        <Modal title="New project" onClose={() => setShowNP(false)}>
          <form onSubmit={createProject} className="modal-form">
            <label>Project name<input name="title" placeholder="e.g. Mobile app launch" required /></label>
            <label>Description<textarea name="description" placeholder="What are you working toward?" /></label>
            <button className="btn-primary full">Create project</button>
          </form>
        </Modal>
      )}

      {showNewTask && selected && (
        <Modal title="Add task" onClose={() => setShowNT(false)}>
          <form onSubmit={createTask} className="modal-form">
            <label>Task name<input name="title" placeholder="e.g. Design landing page" required /></label>
            <label>Description<textarea name="description" placeholder="Add helpful context" /></label>
            <div className="form-row">
              <label>Priority
                <select name="priority" defaultValue="MEDIUM">
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </label>
              <label>Due date<input name="dueDate" type="date" /></label>
            </div>
            <button className="btn-primary full">Add task</button>
          </form>
        </Modal>
      )}

      {showCollabs && selected && (
        <CollabModal project={selected} apiKey={apiKey} onClose={() => setShowColl(false)} />
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
//  ROOT
// ══════════════════════════════════════════════════════════════════════════════
type Screen = 'landing' | 'auth' | 'app'

function Root() {
  const [screen, setScreen] = useState<Screen>(() =>
    localStorage.getItem('devboard_token') ? 'app' : 'landing'
  )
  const [token, setToken]   = useState(() => localStorage.getItem('devboard_token') || '')
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('devboard_key')   || '')

  const handleAuth = (t: string) => {
    localStorage.setItem('devboard_token', t)
    setToken(t)
    setScreen('app')
  }
  const handleKey = (k: string) => { setApiKey(k); setScreen('app') }
  const logout = () => {
    localStorage.removeItem('devboard_token')
    localStorage.removeItem('devboard_key')
    setToken(''); setApiKey(''); setScreen('landing')
  }

  if (screen === 'landing') return <LandingPage onEnter={() => setScreen('auth')} />
  if (screen === 'auth' || !token) return <AuthScreen onAuthenticated={handleAuth} onBack={() => setScreen('landing')} />
  if (!apiKey) return <SetupScreen token={token} onReady={handleKey} onLogout={logout} />
  return <AppDashboard token={token} apiKey={apiKey} onLogout={logout} />
}

createRoot(document.getElementById('root')!).render(<Root />)
