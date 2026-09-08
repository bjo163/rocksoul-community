import { StrictMode, useEffect, useMemo, useState } from "react"
import { createRoot } from "react-dom/client"
import {
  ApplicationActionsProvider,
  AuthScreen,
  Button,
  CaseHeader,
  CommunityCaseThreadPattern,
  MetricTile,
  MoonWitnessAssetProvider,
  MoonWitnessBrand,
  MoonWitnessPersonaAvatar,
  MoonWitnessStatusAsset,
  MWHeader,
  mw0042,
  type ApplicationActions,
} from "@rocksoul/ui"
import "@rocksoul/ui/styles.css"
import "./styles.css"

const ASSET_BASE = "https://raw.githubusercontent.com/bjo163/rocksoul-assets/main"

function routeFor(pathname: string) {
  if (pathname === "/auth" || pathname === "/login") return "auth"
  return "community"
}

function CommunityPage({
  navigate,
  notify,
}: {
  navigate: (path: string) => void
  notify: (message: string) => void
}) {
  return (
    <div id="top" className="community-surface bg-background text-foreground">
      <MWHeader caseId={mw0042.caseId} surface="community" />

      <main className="mw-shell-wide py-10 sm:py-12">
        <div className="community-context-row">
          <p className="mw-meta text-muted-foreground">PARTICIPATION LAYER / SOURCE-AWARE COLLABORATION</p>
          <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
            Sign in
          </Button>
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
              <Button variant="secondary" onClick={() => notify("Following MW-0042 in the UI demo.")}>
                Follow
              </Button>
              <Button variant="ghost" onClick={() => notify("Saved MW-0042 in the UI demo.")}>
                Save
              </Button>
            </>
          }
        />

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.4fr_.7fr]">
          <CommunityCaseThreadPattern
            question="If the person match is partial, why is the overall correlation still high?"
            moderatorNote="Temporal and source-independence dimensions are strong. Identity remains a blocking uncertainty and is shown separately."
            submission={mw0042.community.submission}
          />

          <aside className="grid content-start gap-4">
            <div className="grid grid-cols-3 gap-3">
              <MetricTile label="Following" value={String(mw0042.community.following)} context="members" />
              <MetricTile label="Saved" value={String(mw0042.community.saved)} context="case saves" />
              <MetricTile label="Discussion" value={String(mw0042.community.discussions)} context="threads" />
            </div>

            <section className="community-member-card" aria-label="Community identity">
              <MoonWitnessPersonaAvatar
                persona="community-member"
                alt="MoonWitness community member"
                className="community-member-avatar"
              />
              <div>
                <p className="mw-eyebrow text-warning">COMMUNITY IDENTITY</p>
                <h2>Participation keeps provenance attached.</h2>
                <p>
                  Discussion can question, annotate, and propose. Review remains separate from the canonical record.
                </p>
              </div>
            </section>

            <section className="community-warning">
              <div className="community-warning-icon">
                <MoonWitnessStatusAsset status="needs-context" label="Needs context" />
              </div>
              <div>
                <p className="mw-meta text-warning">SUB-0042-01 / NEEDS CONTEXT</p>
                <p>
                  Community submission ≠ canonical evidence. Provenance must survive review first.
                </p>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  )
}

function AuthPage({ navigate }: { navigate: (path: string) => void }) {
  return (
    <div className="identity-surface bg-background text-foreground">
      <header className="identity-utility mw-shell-wide">
        <MoonWitnessBrand ecosystem subtitle="COMMUNITY / IDENTITY" />
        <Button variant="ghost" onClick={() => navigate("/community/cases/mw-0042")}>
          Back to community
        </Button>
      </header>
      <AuthScreen />
    </div>
  )
}

function App() {
  const [pathname, setPathname] = useState(() => window.location.pathname)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname)
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [])

  useEffect(() => {
    if (!notice) return
    const timeout = window.setTimeout(() => setNotice(null), 3200)
    return () => window.clearTimeout(timeout)
  }, [notice])

  const navigate = (path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, "", path)
      setPathname(path)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const actions = useMemo<ApplicationActions>(
    () => ({
      onCommunitySubmit: (payload) => {
        setNotice(
          payload.mode === "question"
            ? "Question captured in the UI demo. No canonical record was changed."
            : "Context captured in the UI demo. Review is still required.",
        )
      },
      onAuthSubmit: () => {
        setNotice("Authentication surface is wired. Connect the identity backend to enable real sign-in.")
      },
      onAuthProvider: () => {
        setNotice("Provider sign-in is a UI demo until an identity backend is connected.")
      },
    }),
    [],
  )

  const route = routeFor(pathname)

  return (
    <MoonWitnessAssetProvider baseUrl={ASSET_BASE}>
      <ApplicationActionsProvider actions={actions}>
        {route === "auth" ? (
          <AuthPage navigate={navigate} />
        ) : (
          <CommunityPage navigate={navigate} notify={setNotice} />
        )}

        {notice ? (
          <div className="community-toast" role="status" aria-live="polite">
            <span className="community-toast-dot" aria-hidden="true" />
            {notice}
          </div>
        ) : null}
      </ApplicationActionsProvider>
    </MoonWitnessAssetProvider>
  )
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
