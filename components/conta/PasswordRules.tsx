import { cn } from "@/lib/cn";
import { passwordRules } from "@/lib/validation/auth";

/** Live checklist of the password rules; met rules turn green (never by colour alone). */
export function PasswordRules({ password }: { password: string }) {
  return (
    <ul
      aria-label="Regras da senha"
      className="m-0 grid list-none grid-cols-2 gap-2 p-0 text-[13px]"
    >
      {passwordRules.map((rule) => {
        const met = rule.test(password);
        return (
          <li
            key={rule.id}
            data-met={met}
            className={cn("flex items-center gap-2", met ? "text-green" : "text-text-muted")}
          >
            <span aria-hidden="true">{met ? "■" : "▪"}</span>
            {rule.label}
            <span className="sr-only">{met ? " (cumprida)" : " (pendente)"}</span>
          </li>
        );
      })}
    </ul>
  );
}
