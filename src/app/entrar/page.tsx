import Link from "next/link";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { LoginForm } from "@/app/entrar/login-form";

export default function LoginPage() {
  const configured = hasSupabaseConfig();
  return (
    <div className="auth-wrap">
      <section className="auth-card">
        <span className="eyebrow">Área segura · M2</span>
        <h1>Entre no JogaMais</h1>
        <p>A sessão real usa Supabase Auth. As permissões são verificadas novamente no servidor e no banco.</p>
        {configured ? <LoginForm /> : (
          <div className="setup-callout">
            <strong>Supabase ainda não configurado</strong>
            <p>Copie <code>.env.example</code> para <code>.env.local</code> e preencha a URL e a chave publicável do projeto.</p>
          </div>
        )}
        <Link className="text-link" href="/turmas">Voltar à demonstração M1</Link>
      </section>
    </div>
  );
}
