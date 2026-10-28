import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "@/components/ui/Checkbox";
import { Field } from "@/components/ui/Field";

function Harness({ onChange, error }: { onChange?: (v: boolean) => void; error?: string }) {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox
      label="Aceito os termos"
      checked={checked}
      error={error}
      onChange={(v) => {
        onChange?.(v);
        setChecked(v);
      }}
    />
  );
}

describe("Checkbox", () => {
  it("toggles with click and Space and calls onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    const box = screen.getByRole("checkbox", { name: "Aceito os termos" });
    expect(box).toHaveAttribute("aria-checked", "false");
    await user.click(box);
    expect(onChange).toHaveBeenLastCalledWith(true);
    expect(box).toHaveAttribute("aria-checked", "true");
    box.focus();
    await user.keyboard(" ");
    expect(onChange).toHaveBeenLastCalledWith(false);
    expect(box).toHaveAttribute("aria-checked", "false");
  });

  it("is invalid and described by the error when standalone", () => {
    render(<Harness error="Aceite os termos para continuar" />);
    const box = screen.getByRole("checkbox", { name: "Aceito os termos" });
    expect(box).toHaveAttribute("aria-invalid", "true");
    expect(box).toHaveAttribute("data-invalid");
    expect(box).toHaveAccessibleDescription("Aceite os termos para continuar");
  });

  it("is not invalid without an error", () => {
    render(<Harness />);
    expect(screen.getByRole("checkbox")).not.toHaveAttribute("aria-invalid");
  });

  it("uses the surrounding kit Field error without nesting a second Field", () => {
    render(
      <Field label="Termos" error="Obrigatório">
        <Checkbox label="Aceito" checked={false} onChange={() => {}} />
      </Field>,
    );
    const box = screen.getByRole("checkbox", { name: /Aceito/ });
    expect(box).toHaveAttribute("aria-invalid", "true");
    expect(box).toHaveAccessibleDescription("Obrigatório");
  });
});
