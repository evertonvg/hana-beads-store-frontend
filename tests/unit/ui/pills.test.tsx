import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { PillRadioGroup } from "@/components/ui/PillRadioGroup";
import { PillTabs } from "@/components/ui/PillTabs";
import { PillToggle } from "@/components/ui/PillToggle";

describe("PillTabs", () => {
  it("marks the selected tab with aria-selected and changes with the arrow key", async () => {
    const user = userEvent.setup();
    function Harness() {
      const [selected, setSelected] = useState("a");
      return (
        <PillTabs
          label="Seções"
          tabs={[
            { id: "a", label: "Dados" },
            { id: "b", label: "Endereços" },
          ]}
          selected={selected}
          onChange={setSelected}
        />
      );
    }
    render(<Harness />);
    expect(screen.getByRole("tab", { name: "Dados" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Endereços" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
    await user.click(screen.getByRole("tab", { name: "Dados" }));
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Endereços" })).toHaveAttribute("aria-selected", "true");
  });
});

describe("PillRadioGroup", () => {
  it("changes the checked radio with the arrow key", async () => {
    const user = userEvent.setup();
    function Harness() {
      const [value, setValue] = useState<"pix" | "boleto">("pix");
      return (
        <PillRadioGroup<"pix" | "boleto">
          label="Pagamento"
          options={[
            { value: "pix", label: "PIX" },
            { value: "boleto", label: "BOLETO", note: "1 a 3 dias" },
          ]}
          value={value}
          onChange={setValue}
        />
      );
    }
    render(<Harness />);
    expect(screen.getByRole("radio", { name: /PIX/ })).toHaveAttribute("aria-checked", "true");
    await user.click(screen.getByRole("radio", { name: /PIX/ }));
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("radio", { name: /BOLETO/ })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: /PIX/ })).toHaveAttribute("aria-checked", "false");
  });
});

describe("PillToggle", () => {
  it("toggles aria-pressed", async () => {
    const user = userEvent.setup();
    function Harness() {
      const [on, setOn] = useState(false);
      return (
        <PillToggle pressed={on} onPressedChange={setOn}>
          ROSA
        </PillToggle>
      );
    }
    render(<Harness />);
    const btn = screen.getByRole("button", { name: "ROSA" });
    expect(btn).toHaveAttribute("aria-pressed", "false");
    await user.click(btn);
    expect(btn).toHaveAttribute("aria-pressed", "true");
  });
});
