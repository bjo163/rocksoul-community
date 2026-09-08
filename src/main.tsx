import { StrictMode, useEffect, useMemo, useState } from "react"
import { createRoot } from "react-dom/client"
import {
  ApplicationActionsProvider,
  MOONWITNESS_STABLE_REPOSITORY_BASE,
  MoonWitnessAssetProvider,
  type ApplicationActions,
} from "@rocksoul/ui"
import "@rocksoul/ui/styles.css"
import "./styles.css"
import { useCommunityStore } from "./community-store"
import { resolveCommunityRoute } from "./router"
import {
  AuthPage,
  CommunityCasePage,
  CommunityHomePage,
  CommunityStatesPage,
  NotificationsPage,
  NotFoundPage,
  ProfilePage,
  ProposalsPage,
  SavedPage,
  ThreadPage,
  ThreadsPage,
  type Navigate,
} from "./community-pages"

const ASSET_BASE = `${MOONWITNESS_STABLE_REPOSITORY_BASE}/moonwitness`

function App() {
  const store = useCommunityStore()
  const [pathname, setPathname] = useState(() => window.location.pathname)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname)
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [])

  useEffect(() => {
    if (!notice) return
    const timeout = window.setTimeout(() => setNotice(null), 3600)
    return () => window.clearTimeout(timeout)
  }, [notice])

  const navigate: Navigate = (path) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, "", path)
      setPathname(path)
    }
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const actions = useMemo<ApplicationActions>(
    () => ({
      onAuthSubmit: ({ email }) => {
        store.authenticate(email)
        setNotice("Compatibility session active. IAM authority remains in rocksoul-platform.")
        navigate("/community")
      },
      onAuthProvider: () => {
        store.authenticate("provider@rocksoul.community")
        setNotice("Provider compatibility session active. Platform remains the identity authority.")
        navigate("/community")
      },
      onSignOut: () => {
        store.signOut()
        setNotice("Community compatibility session ended.")
      },
      onMarkAllNotificationsRead: () => {
        store.markAllRead()
        setNotice("Notifications marked as read.")
      },
      onSaveProfile: ({ displayName }) => {
        store.saveProfile(displayName, store.state.profile.bio)
        setNotice("Community profile presentation updated.")
      },
      onCommunitySubmit: ({ mode, source, body }) => {
        if (mode === "question") store.submitQuestion("MW-0042", body)
        else store.submitContext("MW-0042", source, body)
      },
    }),
    [store.state.profile.bio],
  )

  const route = resolveCommunityRoute(pathname)
  let page

  switch (route.name) {
    case "home":
      page = <CommunityHomePage state={store.state} navigate={navigate} />
      break
    case "case":
      page = (
        <CommunityCasePage
          caseId={route.caseId}
          state={store.state}
          navigate={navigate}
          onToggleFollow={() => {
            store.toggleFollow(route.caseId)
            setNotice(store.state.followedCases.includes(route.caseId) ? "Case unfollowed." : "Case followed.")
          }}
          onToggleSaved={() => {
            store.toggleSaved(route.caseId)
            setNotice(store.state.savedCases.includes(route.caseId) ? "Case removed from saved." : "Case saved.")
          }}
          onQuestion={(body) => {
            store.submitQuestion(route.caseId, body)
            setNotice("Question added to discussion. Canonical evidence was not changed.")
          }}
          onContext={(source, body) => {
            store.submitContext(route.caseId, source, body)
            setNotice(source ? "Context submitted as unverified." : "Context submitted as NEEDS CONTEXT.")
          }}
        />
      )
      break
    case "threads":
      page = <ThreadsPage state={store.state} navigate={navigate} />
      break
    case "thread":
      page = (
        <ThreadPage
          threadId={route.threadId}
          state={store.state}
          navigate={navigate}
          onReply={(body, source) => {
            store.addReply(route.threadId, body, source)
            setNotice("Reply added as attributed community discussion.")
          }}
        />
      )
      break
    case "saved":
      page = <SavedPage state={store.state} navigate={navigate} />
      break
    case "notifications":
      page = <NotificationsPage state={store.state} onMarkAllRead={store.markAllRead} />
      break
    case "proposals":
      page = (
        <ProposalsPage
          state={store.state}
          authenticated={store.state.session.authenticated}
          navigate={navigate}
          onCreate={(title, body, source) => {
            store.createProposal(title, body, source)
            setNotice(source ? "Proposal created as draft." : "Proposal created as NEEDS CONTEXT.")
          }}
        />
      )
      break
    case "profile":
      page = (
        <ProfilePage
          state={store.state}
          navigate={navigate}
          onSave={(displayName, bio) => {
            store.saveProfile(displayName, bio)
            setNotice("Community profile saved.")
          }}
          onSignOut={() => {
            store.signOut()
            setNotice("Signed out of compatibility session.")
            navigate("/community")
          }}
        />
      )
      break
    case "auth":
      page = <AuthPage navigate={navigate} />
      break
    case "states":
      page = <CommunityStatesPage />
      break
    case "not-found":
      page = <NotFoundPage pathname={route.pathname} navigate={navigate} />
      break
  }

  return (
    <MoonWitnessAssetProvider baseUrl={ASSET_BASE}>
      <ApplicationActionsProvider actions={actions}>
        {page}
        <nav className="community-utility-nav" aria-label="Community utilities">
          <a href="/community/notifications" aria-label="Notifications">Notifications</a>
          <a href="/community/profile" aria-label="Profile">Profile</a>
        </nav>
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
