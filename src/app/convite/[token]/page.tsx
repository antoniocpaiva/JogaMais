import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { acceptInvitation } from "@/app/convite/[token]/actions";

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  let signedIn = false;
  if (hasSupabaseConfig()) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    signedIn = typeof data?.claims?.sub === "string";
  }
  const action = acceptInvitation.bind(null, token);
  return <div className="auth-wrap"><section className="auth-card"><span className="eyebrow">Convite JogaMais</span><h1>Vínculo com a organização</h1><p>O convite só pode ser aceito por uma sessão autenticada com o mesmo e-mail informado pela coordenação.</p>{signedIn ? <form action={action}><button className="button button-primary" type="submit">Aceitar convite</button></form> : <div className="setup-callout"><strong>Entre antes de aceitar</strong><p>Abra a página de entrada, autentique-se e retorne a este link.</p><a className="button button-primary" href="/entrar">Ir para entrada</a></div>}</section></div>;
}
