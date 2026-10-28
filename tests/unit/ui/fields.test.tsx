import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { describe, expect, it } from "vitest";
import { Accordion } from "@/components/ui/Accordion";
import { Field } from "@/components/ui/Field";
import { MaskedInput } from "@/components/ui/MaskedInput";
import { TextInput } from "@/components/ui/TextInput";

describe("Field + TextInput", () => {
  it("links label, hint and error to the input and flags it invalid", () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <Field label="E-mail" hint="Usamos para o pedido" error="E-mail inválido">
        <TextInput ref={ref} />
      </Field>,
    );
    const input = screen.getByLabelText("E-mail");
    expect(input).toBe(ref.current);
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Usamos para o pedido E-mail inválido");
  });

  it("is not invalid without an error", () => {
    render(
      <Field label="Nome">
        <TextInput />
      </Field>,
    );
    expect(screen.getByLabelText("Nome")).not.toHaveAttribute("aria-invalid");
  });
});

describe("MaskedInput", () => {
  it("applies the CEP mask and reports the masked value", async () => {
    const user = userEvent.setup();
    const seen: string[] = [];
    const ref = createRef<HTMLInputElement>();
    function Harness() {
      const [v, setV] = useState("");
      return (
        <Field label="CEP">
          <MaskedInput
            ref={ref}
            mask="cep"
            value={v}
            onAccept={(next) => {
              seen.push(next);
              setV(next);
            }}
          />
        </Field>
      );
    }
    render(<Harness />);
    const input = screen.getByLabelText("CEP");
    expect(input).toBe(ref.current);
    await user.type(input, "01310100");
    expect(input).toHaveValue("01310-100");
    expect(seen.at(-1)).toBe("01310-100");
  });
});

describe("Accordion", () => {
  it("toggles aria-expanded and starts open for defaultOpen", async () => {
    const user = userEvent.setup();
    render(
      <Accordion
        defaultOpen="a"
        items={[
          { id: "a", title: "Prazo", content: "Até 10 dias" },
          { id: "b", title: "Cuidados", content: "Não molhar" },
        ]}
      />,
    );
    const a = screen.getByRole("button", { name: "Prazo" });
    const b = screen.getByRole("button", { name: "Cuidados" });
    expect(a).toHaveAttribute("aria-expanded", "true");
    expect(b).toHaveAttribute("aria-expanded", "false");
    await user.click(b);
    expect(b).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Não molhar")).toBeVisible();
  });
});
