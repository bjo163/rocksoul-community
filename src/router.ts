export type CommunityRoute =
  | { name: "home" }
  | { name: "case"; caseId: string }
  | { name: "threads" }
  | { name: "thread"; threadId: string }
  | { name: "saved" }
  | { name: "notifications" }
  | { name: "proposals" }
  | { name: "profile" }
  | { name: "auth" }
  | { name: "not-found"; pathname: string }

function clean(pathname: string) {
  if (pathname === "/") return "/"
  return pathname.replace(/\/+$/, "") || "/"
}

export function resolveCommunityRoute(pathname: string): CommunityRoute {
  const path = clean(pathname)
  if (path === "/" || path === "/community") return { name: "home" }
  if (path === "/threads" || path === "/community/threads") return { name: "threads" }
  if (path.startsWith("/community/threads/")) {
    return { name: "thread", threadId: decodeURIComponent(path.slice("/community/threads/".length)) }
  }
  if (path.startsWith("/threads/")) {
    return { name: "thread", threadId: decodeURIComponent(path.slice("/threads/".length)) }
  }
  if (path.startsWith("/community/cases/")) {
    return { name: "case", caseId: decodeURIComponent(path.slice("/community/cases/".length)).toUpperCase() }
  }
  if (path === "/saved" || path === "/community/saved") return { name: "saved" }
  if (path === "/notifications" || path === "/community/notifications") return { name: "notifications" }
  if (path === "/proposals" || path === "/community/proposals") return { name: "proposals" }
  if (path === "/profile" || path === "/community/profile") return { name: "profile" }
  if (path === "/auth" || path === "/login") return { name: "auth" }
  return { name: "not-found", pathname: path }
}
