export type SessionUser = { id: string; name: string; email: string };

/** Current signed-in user, or null. Replaced by iron-session in Task 14. */
export function getSession(): Promise<SessionUser | null> {
  return Promise.resolve(null);
}
