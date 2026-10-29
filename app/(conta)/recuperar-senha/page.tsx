import { redirect } from "next/navigation";

/** Alias kept for e-mail links and the footer: password recovery lives on /entrar. */
export default function RecuperarSenhaPage() {
  redirect("/entrar?modo=recuperar");
}
