import type { AuthUser, DemoAccount } from "@/types/auth";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    username: "admin",
    password: "admin123",
    user: {
      id: "user-admin",
      username: "admin",
      name: "Admin User",
      role: "admin",
    },
  },
  {
    username: "editor",
    password: "editor123",
    user: {
      id: "user-editor",
      username: "editor",
      name: "Editor User",
      role: "editor",
    },
  },
  {
    username: "viewer",
    password: "viewer123",
    user: {
      id: "user-viewer",
      username: "viewer",
      name: "Viewer User",
      role: "viewer",
    },
  },
];

export async function login(username: string, password: string): Promise<AuthUser> {
  await delay(800);
  const normalized = username.trim().toLowerCase();
  const account = DEMO_ACCOUNTS.find(
    (entry) => entry.username === normalized && entry.password === password,
  );
  if (!account) {
    throw new Error("Invalid username or password.");
  }
  return account.user;
}
