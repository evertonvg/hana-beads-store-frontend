import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { BottomSheet } from "./BottomSheet";
import { Button } from "./Button";

const meta = {
  title: "UI/BottomSheet",
  component: BottomSheet,
  args: { open: true, onClose: () => {}, title: "FILTROS", children: <p>Opções de filtro.</p> },
} satisfies Meta<typeof BottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {};

export const Interactive: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          ABRIR FILTROS
        </Button>
        <BottomSheet open={open} onClose={() => setOpen(false)} title="FILTROS">
          <p>Opções de filtro.</p>
        </BottomSheet>
      </>
    );
  },
};
