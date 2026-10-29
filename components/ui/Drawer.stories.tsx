import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Button } from "./Button";
import { Drawer } from "./Drawer";

const meta = {
  title: "UI/Drawer",
  component: Drawer,
  args: { open: true, onClose: () => {}, title: "INVENTÁRIO", children: <p>Seu carrinho aqui.</p> },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {};

export const Interactive: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="primary" onClick={() => setOpen(true)}>
          ABRIR INVENTÁRIO
        </Button>
        <Drawer open={open} onClose={() => setOpen(false)} title="INVENTÁRIO">
          <p>Seu carrinho aqui.</p>
        </Drawer>
      </>
    );
  },
};

export const TwoToneTitleWithEyebrow: Story = {
  args: {
    eyebrow: "+1 NO INVENTÁRIO",
    title: (
      <>
        ITEM <span className="text-accent">COLETADO!</span>
      </>
    ),
  },
};
