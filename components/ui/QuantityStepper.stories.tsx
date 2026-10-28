import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { QuantityStepper } from "./QuantityStepper";

const meta = {
  title: "UI/QuantityStepper",
  component: QuantityStepper,
  args: { value: 2, onChange: () => {}, label: "Quantidade" },
} satisfies Meta<typeof QuantityStepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const AtMinimum: Story = { args: { value: 1 } };
export const AtMaximum: Story = { args: { value: 99 } };

export const Interactive: Story = {
  render: function Render() {
    const [value, setValue] = useState(1);
    return <QuantityStepper value={value} onChange={setValue} label="Quantidade" />;
  },
};
