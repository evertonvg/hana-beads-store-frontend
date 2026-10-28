import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { PillToggle } from "./PillToggle";

const meta = {
  title: "UI/PillToggle",
  component: PillToggle,
  args: { pressed: false, onPressedChange: () => {}, children: "ROSA" },
} satisfies Meta<typeof PillToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {};
export const Selected: Story = { args: { pressed: true } };
export const Disabled: Story = { args: { disabled: true } };

export const Interactive: Story = {
  render: function Render() {
    const [on, setOn] = useState<string[]>(["ROSA"]);
    return (
      <div className="flex flex-wrap gap-2">
        {["ROSA", "AZUL", "VERDE", "AMARELO"].map((c) => (
          <PillToggle
            key={c}
            pressed={on.includes(c)}
            onPressedChange={(p) => setOn(p ? [...on, c] : on.filter((x) => x !== c))}
          >
            {c}
          </PillToggle>
        ))}
      </div>
    );
  },
};
