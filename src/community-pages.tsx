import { useMemo, useState, type FormEvent, type ReactNode } from "react"
import {
  AuthScreen,
  Badge,
  Button,
  CaseHeader,
  CommunityComposer,
  DiscussionItem,
  Input,
  MetricTile,
  MoonWitnessBrand,
  MoonWitnessPersonaAvatar,
  MoonWitnessStatusAsset,
  MWHeader,
  NotificationItem,
  SubmissionCard,
  StatePanel,
  Textarea,
  mw0042,
} from "@rocksoul/ui"
import { communityCase, type CommunityState, type CommunityThread } from "./community-data"
import { buildPlatformIdentityUrl, PLATFORM_IDENTITY_URL } from "./identity"

export type Navigate = (path: string) => void

const communityNavigation = [
  { label: "Community", href: "/community" },
  { label: "Threads", href: "/community/threads" },
  { label: "Saved", href: "/community/saved" },
  { label: "Proposals", href: "/community/proposals" },
]

function CommunityHeader({ caseId }: { caseId?: string }) {
  return (
    <MWHeader
      caseId={caseId}
      surface="community"
      homeHref="/community"
      searchHref="/community#search"
      navItems={communityNavigation}
    />
  )
}


const STABLE_ASSET_COMMIT = "82f20b8a361a19abdc6591fe2f4c67e3fb9d4b05"

function sourceLocatorHref(source?: string) {
  if (!source) return null
  if (/^https?:\/\//.test(source)) return source
  if (source.includes("MW-0042")) {
    return `https://github.com/bjo163/rocksoul-assets/blob/${STABLE_ASSET_COMMIT}/penpot/golden-cases/mw-0042/SCREEN-CONTRACT.md`
  }
  if (source.startsWith("COMMUNITY-")) {
    return "https://github.com/bjo163/rocksoul-community/blob/main/README.md"
  }
  return null
}

function SourceLocator({ source }: { source?: string }) {
  const href = sourceLocatorHref(source)
  if (!source) return <span className="community-source-missing">No source attached</span>
  return href ? (
    <a className="community-source-link" href={href} target="_blank" rel="noreferrer">
      {source} <span aria-hidden="true">↗</span>
    </a>
  ) : (
    <code className="community-source-code">{source}</code>
  )
}

function PageIntro({
  eyebrow,
  title,
  copy,
  action,
}: {
  eyebrow: string
  title: string
  copy: string
  action?: ReactNode
}) {
  return (
    <header className="community-page-intro">
      <div>
        <p className="mw-eyebrow text-primary">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{copy}</p>
      </div>
      {action ? <div className="community-page-action">{action}</div> : null}
    </header>
  )
}

function ThreadRow({ thread, navigate }: { thread: CommunityThread; navigate: Navigate }) {
  return (
    <article className="community-list-card">
      <div className="community-list-topline">
        <div className="flex flex-wrap gap-2">
          <Badge variant={thread.state === "reported" ? "contested" : thread.state === "edited" ? "info" : "neutral"}>
            {thread.state}
          </Badge>
          {thread.caseId ? <Badge variant="unresolved">{thread.caseId}</Badge> : null}
        </div>
        <span className="mw-meta text-muted-foreground">{thread.replies} replies</span>
      </div>
      <h2>{thread.title}</h2>
      <p>{thread.body}</p>
      <div className="community-list-footer">
        <span className="mw-meta text-muted-foreground">{thread.author} · {thread.role} · {thread.timestamp}</span>
        <Button size="sm" variant="ghost" onClick={() => navigate(`/community/threads/${encodeURIComponent(thread.id)}`)}>
          Open thread
        </Button>
      </div>
    </article>
  )
}

export function CommunityHomePage({
  state,
  navigate,
}: {
  state: CommunityState
  navigate: Navigate
}) {
  const [query, setQuery] = useState("")
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return state.threads
    return state.threads.filter((thread) =>
      [thread.title, thread.body, thread.author, thread.caseId, thread.source]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(needle)),
    )
  }, [query, state.threads])

  return (
    <div id="top" className="community-surface bg-background text-foreground">
      <CommunityHeader />
      <main className="mw-shell-wide py-10 sm:py-12">
        <section className="community-home-hero">
          <div>
            <p className="mw-eyebrow text-primary">ROCKSOUL COMMUNITY / PARTICIPATION LAYER</p>
            <h1>Discuss the record.<br />Keep the source visible.</h1>
            <p>
              Ask, annotate, save, propose, and collaborate without converting community participation into canonical research truth.
            </p>
            <div className="community-hero-actions">
              <Button onClick={() => navigate("/community/cases/mw-0042")}>Enter MW-0042</Button>
              <Button variant="secondary" onClick={() => navigate("/community/threads")}>Browse threads</Button>
            </div>
          </div>
          <aside className="community-home-identity">
            <MoonWitnessPersonaAvatar persona="community-member" alt="Community member" className="community-home-avatar" />
            <div>
              <p className="mw-meta text-warning">IDENTITY BOUNDARY</p>
              <strong>{state.session.authenticated ? state.profile.displayName : "Public visitor"}</strong>
              <p>{state.session.authenticated ? "Participation session active." : "Public evidence stays readable without login."}</p>
              <Button size="sm" variant="ghost" onClick={() => navigate(state.session.authenticated ? "/community/profile" : "/auth")}>
                {state.session.authenticated ? "View profile" : "Sign in"}
              </Button>
            </div>
          </aside>
        </section>

        <section className="community-metric-grid" aria-label="Community activity">
          <MetricTile label="Threads" value={String(state.threads.length)} context="source-aware discussions" />
          <MetricTile label="Saved" value={String(state.savedCases.length)} context="cases in your local view" />
          <MetricTile label="Proposals" value={String(state.proposals.length)} context="non-canonical ideas" />
          <MetricTile label="Unread" value={String(state.notifications.filter((item) => item.unread).length)} context="community notifications" />
        </section>

        <section id="search" className="community-section">
          <div className="community-section-heading">
            <div>
              <p className="mw-meta text-muted-foreground">THREAD INDEX</p>
              <h2>Current discussions</h2>
            </div>
            <div className="community-search-field">
              <Input label="Search community" variant="search" value={query} onChange={(event) => setQuery(event.currentTarget.value)} placeholder="Search threads, case IDs, sources…" />
            </div>
          </div>
          <div className="community-list">
            {filtered.length ? filtered.slice(0, 5).map((thread) => (
              <ThreadRow key={thread.id} thread={thread} navigate={navigate} />
            )) : (
              <div className="community-empty">
                <p className="mw-eyebrow text-info">NO MATCH</p>
                <h3>No discussion matches this search.</h3>
                <Button variant="secondary" onClick={() => setQuery("")}>Clear search</Button>
              </div>
            )}
          </div>
        </section>

        <section className="community-boundary-strip">
          <MoonWitnessStatusAsset status="source-linked" label="Source-linked participation" />
          <div>
            <p className="mw-meta text-success">PARTICIPATE WITHOUT LOSING PROVENANCE</p>
            <p>Discussion ≠ evidence · popularity ≠ validity · proposal ≠ canonical record.</p>
          </div>
        </section>
      </main>
    </div>
  )
}

export function CommunityCasePage({
  caseId,
  state,
  navigate,
  onToggleFollow,
  onToggleSaved,
  onQuestion,
  onContext,
}: {
  caseId: string
  state: CommunityState
  navigate: Navigate
  onToggleFollow: () => void
  onToggleSaved: () => void
  onQuestion: (body: string) => void
  onContext: (source: string | undefined, body: string) => void
}) {
  if (caseId !== communityCase.id) {
    return <NotFoundPage pathname={`/community/cases/${caseId}`} navigate={navigate} />
  }

  const followed = state.followedCases.includes(caseId)
  const saved = state.savedCases.includes(caseId)
  const threads = state.threads.filter((item) => item.caseId === caseId)
  const submissions = state.submissions.filter((item) => item.caseId === caseId)

  return (
    <div id="top" className="community-surface bg-background text-foreground">
      <CommunityHeader caseId={caseId} />
      <main className="mw-shell-wide py-10 sm:py-12">
        <div className="community-context-row">
          <p className="mw-meta text-muted-foreground">PARTICIPATION LAYER / SOURCE-AWARE CASE CONVERSATION</p>
          <Button variant="ghost" size="sm" onClick={() => navigate("/community")}>Community home</Button>
        </div>

        <CaseHeader
          caseId={mw0042.caseId}
          eyebrow="13 / Community / MW-0042"
          title={mw0042.title}
          summary="Ask, follow, save, and submit context without mutating canonical evidence."
          status={mw0042.status}
          variant="community"
          actions={
            <>
              <Button variant={followed ? "primary" : "secondary"} onClick={onToggleFollow}>{followed ? "Following" : "Follow"}</Button>
              <Button variant={saved ? "secondary" : "ghost"} onClick={onToggleSaved}>{saved ? "Saved" : "Save"}</Button>
            </>
          }
        />

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.4fr_.7fr]">
          <section className="community-case-thread" aria-label="Community case thread">
            <div className="community-thread-heading">
              <div>
                <p className="mw-meta text-muted-foreground">THREAD / {threads.length} DISCUSSIONS</p>
                <h2>Discuss without mutating the record.</h2>
              </div>
              <Badge variant="unresolved">case unresolved</Badge>
            </div>

            {threads.map((thread) => (
              <div key={thread.id}>
                <DiscussionItem
                  kind={thread.role === "moderator" ? "moderator-note" : "question"}
                  author={thread.author}
                  role={thread.role}
                  timestamp={thread.timestamp}
                  body={thread.body}
                  replies={thread.replies}
                  state={thread.state}
                  actions={thread.source ? <Badge variant="neutral">source · {thread.source}</Badge> : undefined}
                />
              </div>
            ))}

            <div className="community-submission-stack">
              {submissions.map((submission) => (
                <SubmissionCard
                  key={submission.id}
                  {...submission}
                  canonicalEvidence={false}
                />
              ))}
            </div>

            {state.session.authenticated ? (
              <div className="community-composer-grid">
                <CommunityComposer mode="question" onSubmit={(payload) => onQuestion(payload.body)} />
                <CommunityComposer mode="context" onSubmit={(payload) => onContext(payload.source, payload.body)} />
              </div>
            ) : (
              <div className="community-signin-gate">
                <p className="mw-eyebrow text-primary">MEMBER ACTION</p>
                <h3>Sign in before adding discussion or context.</h3>
                <p>Reading remains public. Participation uses the Platform identity boundary.</p>
                <Button onClick={() => navigate("/auth")}>Sign in to participate</Button>
              </div>
            )}
          </section>

          <aside className="grid content-start gap-4">
            <div className="grid grid-cols-3 gap-3">
              <MetricTile label="Following" value={String(128 + (followed ? 1 : 0))} context="members" />
              <MetricTile label="Saved" value={String(44 + (saved ? 1 : 0))} context="case saves" />
              <MetricTile label="Discussion" value={String(threads.length)} context="threads" />
            </div>

            <section className="community-member-card" aria-label="Community identity">
              <MoonWitnessPersonaAvatar persona="community-member" alt="MoonWitness community member" className="community-member-avatar" />
              <div>
                <p className="mw-eyebrow text-warning">COMMUNITY IDENTITY</p>
                <h2>Participation keeps provenance attached.</h2>
                <p>Discussion can question, annotate, and propose. Review remains separate from the canonical record.</p>
              </div>
            </section>

            <section className="community-warning">
              <div className="community-warning-icon">
                <MoonWitnessStatusAsset status="needs-context" label="Needs context" />
              </div>
              <div>
                <p className="mw-meta text-warning">SUBMISSION BOUNDARY</p>
                <p>Community submission ≠ canonical evidence. Provenance must survive review first.</p>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  )
}

export function ThreadsPage({ state, navigate }: { state: CommunityState; navigate: Navigate }) {
  const [filter, setFilter] = useState("")
  const threads = state.threads.filter((thread) => {
    const query = filter.trim().toLowerCase()
    return !query || [thread.title, thread.body, thread.caseId, thread.source].filter(Boolean).some((value) => String(value).toLowerCase().includes(query))
  })
  return (
    <div className="community-surface">
      <CommunityHeader />
      <main className="mw-shell-wide py-10">
        <PageIntro eyebrow="COMMUNITY / THREADS" title="Discussion stays attributable." copy="Questions, comments, and community notes remain distinct from canonical research records." />
        <div className="community-search-field community-search-wide">
          <Input label="Filter threads" variant="search" value={filter} onChange={(event) => setFilter(event.currentTarget.value)} placeholder="Case, title, source…" />
        </div>
        <div className="community-list mt-6">
          {threads.map((thread) => <ThreadRow key={thread.id} thread={thread} navigate={navigate} />)}
        </div>
      </main>
    </div>
  )
}

export function ThreadPage({
  threadId,
  state,
  navigate,
  onReply,
}: {
  threadId: string
  state: CommunityState
  navigate: Navigate
  onReply: (body: string, source?: string) => void
}) {
  const [reply, setReply] = useState("")
  const [source, setSource] = useState("")
  const thread = state.threads.find((item) => item.id === threadId)
  if (!thread) return <NotFoundPage pathname={`/community/threads/${threadId}`} navigate={navigate} />

  const comments = state.comments.filter((item) => item.threadId === threadId)

  return (
    <div className="community-surface">
      <CommunityHeader caseId={thread.caseId} />
      <main className="mw-shell-wide py-10">
        <PageIntro
          eyebrow={thread.caseId ? `THREAD / ${thread.caseId}` : "COMMUNITY / THREAD"}
          title={thread.title}
          copy="This page is a community discussion surface. Its content is not a canonical research record."
          action={<Button variant="ghost" onClick={() => navigate("/community/threads")}>All threads</Button>}
        />
        <section className="community-thread-detail">
          <DiscussionItem
            kind={thread.role === "moderator" ? "moderator-note" : "question"}
            author={thread.author}
            role={thread.role}
            timestamp={thread.timestamp}
            body={thread.body}
            replies={thread.replies}
            state={thread.state}
          />
          <dl className="community-provenance-dl">
            <div><dt>Attribution</dt><dd>{thread.author}</dd></div>
            <div><dt>Moderation</dt><dd>{thread.state}</dd></div>
            <div><dt>Source</dt><dd><SourceLocator source={thread.source} /></dd></div>
            <div><dt>Canonical</dt><dd>NO — COMMUNITY DISCUSSION</dd></div>
          </dl>

          <section className="community-history" aria-label="Edit and moderation history">
            <p className="mw-meta text-muted-foreground">EDIT / MODERATION HISTORY</p>
            <ol>
              {thread.history.map((event, index) => (
                <li key={`${event.action}-${event.at}-${index}`}>
                  <span>{event.action.replaceAll("-", " ")}</span>
                  <strong>{event.actor}</strong>
                  <time>{event.at}</time>
                </li>
              ))}
            </ol>
          </section>

          <section className="community-replies" aria-label="Thread replies">
            <div className="community-thread-heading">
              <div>
                <p className="mw-meta text-muted-foreground">REPLIES / {comments.length}</p>
                <h2>Attributed responses</h2>
              </div>
            </div>
            {comments.map((comment) => (
              <DiscussionItem
                key={comment.id}
                kind="comment"
                author={comment.author}
                role={comment.role}
                timestamp={comment.timestamp}
                body={comment.body}
                replies={0}
                state={comment.state}
                actions={comment.source ? <SourceLocator source={comment.source} /> : undefined}
              />
            ))}
          </section>

          {state.session.authenticated ? (
            <form
              className="community-reply-form"
              onSubmit={(event) => {
                event.preventDefault()
                if (!reply.trim()) return
                onReply(reply.trim(), source.trim() || undefined)
                setReply("")
                setSource("")
              }}
            >
              <p className="mw-eyebrow text-info">REPLY TO THREAD</p>
              <Textarea label="Reply" value={reply} onChange={(event) => setReply(event.currentTarget.value)} maxLength={600} characterCount required />
              <Input label="Source / provenance" value={source} onChange={(event) => setSource(event.currentTarget.value)} placeholder="Optional source ID, locator, or URL" />
              <Button type="submit" disabled={!reply.trim()}>Add reply</Button>
            </form>
          ) : (
            <div className="community-signin-gate mt-5">
              <p className="mw-eyebrow text-primary">MEMBER ACTION</p>
              <h3>Sign in to reply.</h3>
              <Button onClick={() => navigate("/auth")}>Sign in</Button>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export function SavedPage({ state, navigate }: { state: CommunityState; navigate: Navigate }) {
  const saved = state.savedCases.includes(communityCase.id)
  return (
    <div className="community-surface">
      <CommunityHeader />
      <main className="mw-shell-wide py-10">
        <PageIntro eyebrow="COMMUNITY / SAVED" title="Your saved case references." copy="Saving changes your community workspace only; it does not change case status or research validity." />
        {saved ? (
          <article className="community-list-card mt-6">
            <div className="community-list-topline"><Badge variant="unresolved">{communityCase.status}</Badge><span className="mw-meta">SAVED</span></div>
            <h2>{communityCase.title}</h2>
            <p>{communityCase.summary}</p>
            <Button className="mt-5" onClick={() => navigate("/community/cases/mw-0042")}>Open case conversation</Button>
          </article>
        ) : (
          <div className="community-empty mt-6">
            <p className="mw-eyebrow text-info">EMPTY / SAVED</p>
            <h3>No saved cases yet.</h3>
            <p>Save MW-0042 from the community case surface to prove this state transition.</p>
            <Button variant="secondary" onClick={() => navigate("/community/cases/mw-0042")}>Browse MW-0042</Button>
          </div>
        )}
      </main>
    </div>
  )
}

export function NotificationsPage({
  state,
  onMarkAllRead,
}: {
  state: CommunityState
  onMarkAllRead: () => void
}) {
  return (
    <div className="community-surface">
      <CommunityHeader />
      <main className="mw-shell-wide py-10">
        <PageIntro
          eyebrow="COMMUNITY / NOTIFICATIONS"
          title="Changes that need your attention."
          copy="Replies and review states are surfaced without implying verification."
          action={<Button variant="secondary" onClick={onMarkAllRead}>Mark all read</Button>}
        />
        <section className="community-notification-list mt-6">
          {state.notifications.map((notification) => <NotificationItem key={notification.id} {...notification} />)}
        </section>
      </main>
    </div>
  )
}

export function ProposalsPage({
  state,
  authenticated,
  onCreate,
  navigate,
}: {
  state: CommunityState
  authenticated: boolean
  onCreate: (title: string, body: string, source: string) => void
  navigate: Navigate
}) {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [source, setSource] = useState("")

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!title.trim() || !body.trim()) return
    onCreate(title.trim(), body.trim(), source.trim())
    setTitle("")
    setBody("")
    setSource("")
  }

  return (
    <div className="community-surface">
      <CommunityHeader />
      <main className="mw-shell-wide py-10">
        <PageIntro eyebrow="COMMUNITY / PROPOSALS" title="Propose. Then review." copy="A proposal is a participation object, not a canonical record. Source and moderation state remain visible." />
        <div className="community-two-column mt-6">
          <section className="community-list">
            {state.proposals.map((proposal) => (
              <article key={proposal.id} className="community-list-card">
                <div className="community-list-topline">
                  <Badge variant={proposal.state === "needs-context" ? "partial" : proposal.state === "in-review" ? "info" : "neutral"}>{proposal.state}</Badge>
                  <span className="mw-meta text-muted-foreground">{proposal.id}</span>
                </div>
                <h2>{proposal.title}</h2>
                <p>{proposal.body}</p>
                <div className="community-proposal-source"><span>Source</span><strong>{proposal.source}</strong></div>
              </article>
            ))}
          </section>

          {authenticated ? (
            <form className="community-proposal-form" onSubmit={submit}>
              <p className="mw-eyebrow text-primary">NEW PROPOSAL</p>
              <h2>Keep provenance attached.</h2>
              <Input label="Proposal title" value={title} onChange={(event) => setTitle(event.currentTarget.value)} required />
              <Textarea label="Proposal" value={body} onChange={(event) => setBody(event.currentTarget.value)} maxLength={800} characterCount required />
              <Input label="Source / locator" value={source} onChange={(event) => setSource(event.currentTarget.value)} placeholder="Optional, but missing source becomes NEEDS CONTEXT" />
              <Button type="submit" disabled={!title.trim() || !body.trim()}>Create proposal</Button>
            </form>
          ) : (
            <div className="community-signin-gate">
              <p className="mw-eyebrow text-primary">MEMBER ACTION</p>
              <h3>Sign in to create proposals.</h3>
              <Button onClick={() => navigate("/auth")}>Sign in</Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export function ProfilePage({
  state,
  navigate,
  onSave,
  onSignOut,
}: {
  state: CommunityState
  navigate: Navigate
  onSave: (displayName: string, bio: string) => void
  onSignOut: () => void
}) {
  const [displayName, setDisplayName] = useState(state.profile.displayName)
  const [bio, setBio] = useState(state.profile.bio)

  if (!state.session.authenticated) {
    return (
      <div className="community-surface">
        <CommunityHeader />
        <main className="mw-shell-wide py-10">
          <PageIntro eyebrow="COMMUNITY / PUBLIC PROFILE" title="Profile presentation, not IAM authority." copy="Account, role, permission, and session authority belong to rocksoul-platform." />
          <div className="community-signin-gate mt-6">
            <p className="mw-eyebrow text-primary">NO PARTICIPATION SESSION</p>
            <h3>Sign in to edit your community profile.</h3>
            <Button onClick={() => navigate("/auth")}>Sign in</Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="community-surface">
      <CommunityHeader />
      <main className="mw-shell-wide py-10">
        <PageIntro eyebrow="COMMUNITY / PUBLIC PROFILE" title={state.profile.displayName} copy="Public participation identity remains separate from canonical PERSON research records." />
        <div className="community-profile-grid mt-6">
          <section className="community-profile-card">
            <MoonWitnessPersonaAvatar persona="community-member" alt="" className="community-profile-avatar" />
            <div><strong>{state.profile.displayName}</strong><span>{state.profile.handle}</span></div>
            <p>{state.profile.bio}</p>
            <dl>
              <div><dt>Session</dt><dd>compatibility / authenticated</dd></div>
              <div><dt>Email</dt><dd>{state.session.email}</dd></div>
              <div><dt>Canonical PERSON</dt><dd>NO</dd></div>
            </dl>
          </section>
          <form className="community-profile-form" onSubmit={(event) => { event.preventDefault(); onSave(displayName, bio) }}>
            <p className="mw-eyebrow text-info">COMMUNITY PRESENTATION</p>
            <Input label="Display name" value={displayName} onChange={(event) => setDisplayName(event.currentTarget.value)} />
            <Textarea label="Bio" value={bio} onChange={(event) => setBio(event.currentTarget.value)} maxLength={280} characterCount />
            <div className="flex flex-wrap gap-2">
              <Button type="submit">Save profile</Button>
              <Button variant="ghost" onClick={onSignOut}>Sign out</Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export function AuthPage({ navigate }: { navigate: Navigate }) {
  const bridge = buildPlatformIdentityUrl(window.location.origin + "/community")
  return (
    <div className="identity-surface bg-background text-foreground">
      <header className="identity-utility mw-shell-wide">
        <MoonWitnessBrand ecosystem subtitle="COMMUNITY / IDENTITY BRIDGE" />
        <Button variant="ghost" onClick={() => navigate("/community")}>Back to community</Button>
      </header>
      <section className="identity-boundary-note mw-shell-wide">
        <div>
          <p className="mw-meta text-info">IAM OWNER / ROCKSOUL-PLATFORM</p>
          <p>Community presents compatibility UX only. Account, session, role, and permission authority remain in Platform.</p>
        </div>
        {bridge ? (
          <Button variant="secondary" onClick={() => window.location.assign(bridge)}>Continue via Platform identity</Button>
        ) : (
          <Badge variant="partial">platform identity URL not configured</Badge>
        )}
      </section>
      <AuthScreen />
      {!PLATFORM_IDENTITY_URL ? (
        <p className="identity-compatibility-copy mw-shell-wide">
          Local compatibility mode is active for this frontend reference implementation. It is intentionally not an IAM authority.
        </p>
      ) : null}
    </div>
  )
}


export function CommunityStatesPage() {
  return (
    <div className="community-surface">
      <CommunityHeader />
      <main className="mw-shell-wide py-10">
        <PageIntro
          eyebrow="COMMUNITY / SEMANTIC STATES"
          title="Failure is a state, not a conclusion."
          copy="Loading, offline, error, and empty states preserve the difference between connectivity, query failure, and absence of community content."
        />
        <section className="community-state-grid mt-6">
          <StatePanel state="loading" />
          <StatePanel state="error" traceId="COMMUNITY-DEMO-ERROR" />
          <StatePanel state="offline" lastKnownState="Local community snapshot remains readable." />
          <StatePanel state="empty" />
        </section>
      </main>
    </div>
  )
}

export function NotFoundPage({ pathname, navigate }: { pathname: string; navigate: Navigate }) {
  return (
    <div className="community-surface">
      <CommunityHeader />
      <main className="mw-shell-wide py-16">
        <div className="community-empty">
          <p className="mw-eyebrow text-primary">404 / COMMUNITY ROUTE</p>
          <h1>Nothing is silently mapped here.</h1>
          <p><code>{pathname}</code> is not a Community route. Unknown paths no longer fall through to MW-0042.</p>
          <Button onClick={() => navigate("/community")}>Community home</Button>
        </div>
      </main>
    </div>
  )
}
