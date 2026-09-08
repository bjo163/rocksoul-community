export type ModerationState = "default" | "edited" | "reported" | "hidden"
export type SubmissionState = "unverified" | "in-review" | "verified" | "rejected" | "needs-context"
export type ProposalState = "draft" | "needs-context" | "in-review"

export interface CommunityHistoryEvent {
  action: "created" | "edited" | "reported" | "hidden" | "source-attached"
  at: string
  actor: string
}

export interface CommunityComment {
  id: string
  threadId: string
  body: string
  author: string
  role: string
  timestamp: string
  state: ModerationState
  source?: string
}

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
  history: CommunityHistoryEvent[]
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
  comments: CommunityComment[]
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
      history: [
        { action: "created", at: "05:14", actor: "Member" },
        { action: "source-attached", at: "05:15", actor: "Member" },
      ],
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
      history: [{ action: "created", at: "05:20", actor: "Moderator" }],
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
      history: [
        { action: "created", at: "05:52", actor: "Archivist" },
        { action: "edited", at: "06:02", actor: "Archivist" },
      ],
    },
    {
      id: "thread-reported-example",
      title: "Reported wording preserved as moderation state",
      body: "This fixture proves that reported discussion remains visually distinct and does not become evidence.",
      author: "Community Member",
      role: "member",
      timestamp: "06:18",
      state: "reported",
      replies: 0,
      source: "COMMUNITY-MODERATION/STATE",
      history: [
        { action: "created", at: "06:14", actor: "Community Member" },
        { action: "reported", at: "06:18", actor: "Moderator" },
      ],
    },
  ],
  comments: [
    {
      id: "comment-mw0042-01",
      threadId: "thread-mw0042-identity",
      body: "The aggregate is high because identity is only one dimension; it remains separately visible.",
      author: "Moderator",
      role: "moderator",
      timestamp: "05:20",
      state: "default",
      source: "REVIEW/MW-0042",
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
