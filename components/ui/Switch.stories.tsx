import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Switch } from "./Switch";

const meta = {
  title: "UI/Switch",
  component: Switch,
  args: {
    checked: false,
    onCheckedChange: () => {},
    label: "Novidades por e-mail",
    description: "Lançamentos e promoções, no máximo 1 por semana.",
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Off: Story = {};
export const On: Story = { args: { checked: true } };
export const Disabled: Story = { args: { disabled: true } };

export const Interactive: Story = {
  render: function Render() {
    const [checked, setChecked] = useState(false);
    return <Switch checked={checked} onCheckedChange={setChecked} label="Novidades por e-mail" />;
  },
};
