export const PLATFORM_IDENTITY_URL = (import.meta.env.VITE_ROCKSOUL_PLATFORM_IDENTITY_URL as string | undefined)?.replace(/\/+$/, "") ?? ""

export function buildPlatformIdentityUrl(returnTo: string) {
  if (!PLATFORM_IDENTITY_URL) return null
  const url = new URL(PLATFORM_IDENTITY_URL)
  url.searchParams.set("return_to", returnTo)
  url.searchParams.set("consumer", "rocksoul-community")
  return url.toString()
}
