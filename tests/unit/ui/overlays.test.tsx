import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Drawer } from "@/components/ui/Drawer";

function Harness({ Overlay }: { Overlay: typeof Drawer | typeof BottomSheet }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Abrir
      </button>
      <Overlay open={open} onClose={() => setOpen(false)} title="INVENTÁRIO">
        <p>conteúdo</p>
      </Overlay>
    </>
  );
}

describe.each([
  ["Drawer", Drawer],
  ["BottomSheet", BottomSheet],
])("%s", (_name, Overlay) => {
  it("is a labelled modal dialog, closes with Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<Harness Overlay={Overlay} />);
    const trigger = screen.getByRole("button", { name: "Abrir" });
    await user.click(trigger);
    const dialog = await screen.findByRole("dialog", { name: "INVENTÁRIO" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });
});
