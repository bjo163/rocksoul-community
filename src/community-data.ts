export type ModerationState = "default" | "edited" | "reported" | "hidden"
export type SubmissionState = "unverified" | "in-review" | "verified" | "rejected" | "needs-context"
export type ProposalState = "draft" | "needs-context" | "in-review"

export interface CommunityThread {
  id: string
  caseId?: string
  title: string
  body: string
  author: string
  role: string
  timestamp: string
  state: ModerationState
  replies: number
  source?: string
}

export interface CommunitySubmission {
  id: string
  caseId: string
  title: string
  body: string
  source: string
  state: SubmissionState
  submitter: string
  reviewer: string
}

export interface CommunityProposal {
  id: string
  title: string
  body: string
  source: string
  state: ProposalState
  updatedAt: string
}

export interface CommunityNotification {
  id: string
  title: string
  body: string
  variant: "case-update" | "reply" | "review" | "system"
  unread: boolean
}

export interface CommunityProfile {
  displayName: string
  handle: string
  bio: string
  joinedAt: string
}

export interface CommunitySession {
  authenticated: boolean
  email?: string
}

export interface CommunityState {
  session: CommunitySession
  profile: CommunityProfile
  followedCases: string[]
  savedCases: string[]
  threads: CommunityThread[]
  submissions: CommunitySubmission[]
  proposals: CommunityProposal[]
  notifications: CommunityNotification[]
}

export const communityCase = {
  id: "MW-0042",
  title: "The Silent Flight",
  summary: "A synthetic golden case used to test source-aware participation without mutating canonical research.",
  status: "unresolved" as const,
  updatedAt: "today",
  traceCount: 4,
}

export const defaultCommunityState: CommunityState = {
  session: { authenticated: false },
  profile: {
    displayName: "Community Member",
    handle: "@observer",
    bio: "Following the record without collapsing discussion into evidence.",
    joinedAt: "MoonWitness community fixture",
  },
  followedCases: [],
  savedCases: [],
  threads: [
    {
      id: "thread-mw0042-identity",
      caseId: "MW-0042",
      title: "Why is the correlation high while identity remains partial?",
      body: "If the person match is partial, why is the overall correlation still high?",
      author: "Member",
      role: "member",
      timestamp: "05:14",
      state: "default",
      replies: 1,
      source: "CASE/MW-0042",
    },
    {
      id: "thread-mw0042-moderator",
      caseId: "MW-0042",
      title: "Moderator context on the aggregate score",
      body: "Temporal and source-independence dimensions are strong. Identity remains a blocking uncertainty and is shown separately.",
      author: "Moderator",
      role: "moderator",
      timestamp: "05:20",
      state: "default",
      replies: 0,
      source: "REVIEW/MW-0042",
    },
    {
      id: "thread-provenance-first",
      title: "What counts as useful context?",
      body: "A contribution should carry a source or locator when it makes a factual claim. Interpretation can follow, but provenance should survive review.",
      author: "Archivist",
      role: "community member",
      timestamp: "06:02",
      state: "edited",
      replies: 3,
      source: "COMMUNITY-RULES/PROVENANCE",
    },
  ],
  submissions: [
    {
      id: "SUB-0042-01",
      caseId: "MW-0042",
      title: "Possible second event trace",
      body: "A possible parallel event has been proposed, but its provenance is incomplete.",
      source: "provenance incomplete",
      state: "needs-context",
      submitter: "community member",
      reviewer: "unassigned",
    },
  ],
  proposals: [
    {
      id: "PROP-0001",
      title: "Add a source-quality note to case discussions",
      body: "Expose whether a linked source is primary, secondary, or community-supplied before a reviewer opens it.",
      source: "COMMUNITY-RULES/PROVENANCE",
      state: "in-review",
      updatedAt: "today",
    },
  ],
  notifications: [
    {
      id: "notification-review",
      title: "SUB-0042-01 needs context",
      body: "The community submission is still non-canonical and needs a stronger provenance locator.",
      variant: "review",
      unread: true,
    },
    {
      id: "notification-reply",
      title: "Moderator replied on MW-0042",
      body: "Identity uncertainty remains separate from the aggregate correlation score.",
      variant: "reply",
      unread: true,
    },
    {
      id: "notification-system",
      title: "Community boundary active",
      body: "Participation does not mutate canonical research records.",
      variant: "system",
      unread: false,
    },
  ],
}
