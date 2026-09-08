import { useEffect, useState } from "react"
import {
  defaultCommunityState,
  type CommunityProposal,
  type CommunityState,
  type CommunitySubmission,
  type CommunityThread,
} from "./community-data"

const STORAGE_KEY = "rocksoul-community:v2"

function cloneDefaultState(): CommunityState {
  return JSON.parse(JSON.stringify(defaultCommunityState)) as CommunityState
}

function loadState(): CommunityState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return cloneDefaultState()
    const parsed = JSON.parse(raw) as Partial<CommunityState>
    return {
      ...cloneDefaultState(),
      ...parsed,
      session: { ...defaultCommunityState.session, ...parsed.session },
      profile: { ...defaultCommunityState.profile, ...parsed.profile },
      followedCases: Array.isArray(parsed.followedCases) ? parsed.followedCases : [],
      savedCases: Array.isArray(parsed.savedCases) ? parsed.savedCases : [],
      threads: Array.isArray(parsed.threads)
        ? parsed.threads.map((thread) => ({
            ...thread,
            history: Array.isArray(thread.history)
              ? thread.history
              : [{ action: "created" as const, at: thread.timestamp ?? "unknown", actor: thread.author ?? "community member" }],
          }))
        : cloneDefaultState().threads,
      comments: Array.isArray(parsed.comments) ? parsed.comments : cloneDefaultState().comments,
      submissions: Array.isArray(parsed.submissions) ? parsed.submissions : cloneDefaultState().submissions,
      proposals: Array.isArray(parsed.proposals) ? parsed.proposals : cloneDefaultState().proposals,
      notifications: Array.isArray(parsed.notifications) ? parsed.notifications : cloneDefaultState().notifications,
    }
  } catch {
    return cloneDefaultState()
  }
}

function id(prefix: string) {
  const value = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10)
  return `${prefix}-${value}`
}

export function useCommunityStore() {
  const [state, setState] = useState<CommunityState>(() => loadState())

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const toggleFollow = (caseId: string) => {
    setState((current) => ({
      ...current,
      followedCases: current.followedCases.includes(caseId)
        ? current.followedCases.filter((item) => item !== caseId)
        : [...current.followedCases, caseId],
    }))
  }

  const toggleSaved = (caseId: string) => {
    setState((current) => ({
      ...current,
      savedCases: current.savedCases.includes(caseId)
        ? current.savedCases.filter((item) => item !== caseId)
        : [...current.savedCases, caseId],
    }))
  }

  const submitQuestion = (caseId: string, body: string) => {
    const thread: CommunityThread = {
      id: id("thread"),
      caseId,
      title: body.length > 72 ? body.slice(0, 69) + "…" : body,
      body,
      author: state.profile.displayName,
      role: "member",
      timestamp: "now",
      state: "default",
      replies: 0,
      source: `CASE/${caseId}`,
      history: [{ action: "created", at: "now", actor: state.profile.displayName }],
    }
    setState((current) => ({
      ...current,
      threads: [thread, ...current.threads],
      notifications: [{
        id: id("notification"),
        title: `Question added to ${caseId}`,
        body: "The discussion changed. The canonical case record did not.",
        variant: "case-update",
        unread: true,
      }, ...current.notifications],
    }))
  }

  const submitContext = (caseId: string, source: string | undefined, body: string) => {
    const submission: CommunitySubmission = {
      id: id("SUB").toUpperCase(),
      caseId,
      title: body.length > 64 ? body.slice(0, 61) + "…" : body,
      body,
      source: source || "provenance incomplete",
      state: source ? "unverified" : "needs-context",
      submitter: state.profile.displayName,
      reviewer: "unassigned",
    }
    setState((current) => ({
      ...current,
      submissions: [submission, ...current.submissions],
      notifications: [{
        id: id("notification"),
        title: `${submission.id} submitted for review`,
        body: source
          ? "The context is unverified and remains outside canonical evidence."
          : "The context needs a provenance locator before review.",
        variant: "review",
        unread: true,
      }, ...current.notifications],
    }))
  }


  const addReply = (threadId: string, body: string, source?: string) => {
    const comment = {
      id: id("comment"),
      threadId,
      body,
      author: state.profile.displayName,
      role: "member",
      timestamp: "now",
      state: "default" as const,
      source: source?.trim() || undefined,
    }
    setState((current) => ({
      ...current,
      comments: [comment, ...current.comments],
      threads: current.threads.map((thread) =>
        thread.id === threadId
          ? { ...thread, replies: thread.replies + 1 }
          : thread,
      ),
      notifications: [{
        id: id("notification"),
        title: "Reply added to community thread",
        body: "The reply remains attributed community discussion and does not mutate canonical evidence.",
        variant: "reply",
        unread: true,
      }, ...current.notifications],
    }))
  }

  const createProposal = (title: string, body: string, source: string) => {
    const proposal: CommunityProposal = {
      id: id("PROP").toUpperCase(),
      title,
      body,
      source: source || "provenance incomplete",
      state: source ? "draft" : "needs-context",
      updatedAt: "now",
    }
    setState((current) => ({ ...current, proposals: [proposal, ...current.proposals] }))
  }

  const authenticate = (email: string) => {
    setState((current) => ({
      ...current,
      session: { authenticated: true, email },
      profile: {
        ...current.profile,
        displayName: current.profile.displayName === "Community Member"
          ? email.split("@")[0] || "Community Member"
          : current.profile.displayName,
      },
    }))
  }

  const signOut = () => {
    setState((current) => ({ ...current, session: { authenticated: false } }))
  }

  const saveProfile = (displayName: string, bio: string) => {
    setState((current) => ({
      ...current,
      profile: { ...current.profile, displayName: displayName.trim() || current.profile.displayName, bio },
    }))
  }

  const markAllRead = () => {
    setState((current) => ({
      ...current,
      notifications: current.notifications.map((item) => ({ ...item, unread: false })),
    }))
  }

  const resetDemo = () => setState(cloneDefaultState())

  return {
    state,
    toggleFollow,
    toggleSaved,
    submitQuestion,
    submitContext,
    addReply,
    createProposal,
    authenticate,
    signOut,
    saveProfile,
    markAllRead,
    resetDemo,
  }
}
