export interface User {
  id: string
  email: string
  name: string
}

export function login(email: string, password: string): User | null {
  // Simple authentication using localStorage
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  const user = users.find((u: User & { password: string }) => u.email === email && u.password === password)

  if (user) {
    const { password, ...userWithoutPassword } = user
    localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))
    return userWithoutPassword
  }

  return null
}

export function signup(email: string, password: string, name: string): User {
  const users = JSON.parse(localStorage.getItem("users") || "[]")

  // Check if user already exists
  if (users.some((u: User) => u.email === email)) {
    throw new Error("User already exists")
  }

  const newUser = {
    id: Date.now().toString(),
    email,
    password,
    name,
  }

  users.push(newUser)
  localStorage.setItem("users", JSON.stringify(users))

  const { password: _, ...userWithoutPassword } = newUser
  localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))

  return userWithoutPassword
}

export function logout() {
  localStorage.removeItem("currentUser")
}

export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem("currentUser")
  return userStr ? JSON.parse(userStr) : null
}

export function isAuthenticated(): boolean {
  return !!getCurrentUser()
}
