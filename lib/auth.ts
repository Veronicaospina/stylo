export interface User {
  id: string
  email: string
  name: string
}

export async function login(email: string, password: string): Promise<User | null> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) return null
  const user = (await res.json()) as User
  localStorage.setItem("currentUser", JSON.stringify(user))
  return user
}

export async function signup(email: string, password: string, name: string): Promise<User> {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || "Signup failed")
  }
  const user = (await res.json()) as User
  localStorage.setItem("currentUser", JSON.stringify(user))
  return user
}

export function logout() {
  localStorage.removeItem("currentUser")
}

export function getCurrentUser(): User | null {
  const userStr = typeof window !== "undefined" ? localStorage.getItem("currentUser") : null
  return userStr ? (JSON.parse(userStr) as User) : null
}

export function isAuthenticated(): boolean {
  return !!getCurrentUser()
}
