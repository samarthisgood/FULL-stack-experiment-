import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, LogIn, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch } from "@/app/hooks";
import { loginSuccess, setAuthError, setAuthLoading } from "@/features/auth/authSlice";
import { login as loginApi, DEMO_ACCOUNTS } from "@/services/authApi";
import { notify } from "@/components/Toast";
import { roleLabel } from "@/lib/permissions";

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!username.trim() || !password) {
      dispatch(setAuthError("Username and password are required."));
      return;
    }

    setSubmitting(true);
    dispatch(setAuthLoading(true));
    dispatch(setAuthError(null));

    try {
      const user = await loginApi(username, password);
      dispatch(loginSuccess(user));
      notify.success(`Welcome back, ${user.name}!`);
      navigate({ to: "/" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to sign in. Please try again.";
      dispatch(setAuthError(message));
      notify.error(message);
    } finally {
      setSubmitting(false);
      dispatch(setAuthLoading(false));
    }
  };

  const fillDemo = (demoUsername: string, demoPassword: string) => {
    setUsername(demoUsername);
    setPassword(demoPassword);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="grid w-full max-w-4xl gap-8 lg:grid-cols-[1.1fr_1fr]">
        <section className="hidden flex-col justify-center rounded-2xl bg-brand-gradient p-8 text-primary-foreground shadow-lift lg:flex">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/15">
            <Shield className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">DraftDesk</h1>
          <p className="mt-3 max-w-md text-sm text-primary-foreground/85">
            Sign in with a role-based account. Admins manage everything, editors create and edit
            posts, and viewers can browse content read-only.
          </p>
          <ul className="mt-8 space-y-3 text-sm">
            <li>Admin — create, edit and delete posts</li>
            <li>Editor — create and edit posts</li>
            <li>Viewer — view posts only</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold tracking-tight">Sign in</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Use one of the demo accounts below or enter your credentials.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin, editor or viewer"
                disabled={submitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                disabled={submitting}
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              {submitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Demo accounts
            </p>
            <div className="grid gap-2">
              {DEMO_ACCOUNTS.map(({ username: demoUser, password: demoPass, user }) => (
                <button
                  key={demoUser}
                  type="button"
                  disabled={submitting}
                  onClick={() => fillDemo(demoUser, demoPass)}
                  className="flex items-center justify-between rounded-xl border border-border px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted/60 disabled:opacity-50"
                >
                  <span>
                    <span className="font-medium">{demoUser}</span>
                    <span className="text-muted-foreground"> / {demoPass}</span>
                  </span>
                  <Badge variant="secondary">{roleLabel(user.role)}</Badge>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
