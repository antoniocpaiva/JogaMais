"use client";

import { useActionState } from "react";
import { signIn, type LoginState } from "@/app/entrar/actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, initialState);
  return (
    <form action={action} className="m2-form">
      <label>E-mail<input autoComplete="email" name="email" required type="email" /></label>
      <label>Senha<input autoComplete="current-password" minLength={8} name="password" required type="password" /></label>
      {state.error && <p aria-live="polite" className="form-error">{state.error}</p>}
      <button className="button button-primary" disabled={pending} type="submit">
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
