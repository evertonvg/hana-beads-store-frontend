import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const next = new URLSearchParams({ next: "/checkout" }).toString();

/** "Já tem conta?": sign-in and sign-up shortcuts that come back to the checkout. */
export function AccountBox() {
  return (
    <div className="flex flex-col gap-3 border-[3px] border-dashed border-accent p-3.5 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-3.5 md:px-5 md:py-[18px]">
      <p className="m-0 text-sm leading-normal md:text-[15px]">
        Já tem conta? Entre para preencher seus dados automaticamente.
      </p>
      <div className="grid grid-cols-2 gap-2 md:flex md:gap-2.5">
        <Link
          href={`/entrar?${next}`}
          className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "bg-text text-bg")}
        >
          ENTRAR
        </Link>
        <Link
          href={`/cadastro?${next}`}
          className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
        >
          CRIAR CONTA
        </Link>
      </div>
    </div>
  );
}
