import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { PillRadioGroup } from "./PillRadioGroup";

type Pay = "pix" | "boleto" | "cartao";

const options: { value: Pay; label: string; note?: string }[] = [
  { value: "pix", label: "PIX", note: "Aprovação na hora" },
  { value: "boleto", label: "BOLETO", note: "1 a 3 dias úteis" },
  { value: "cartao", label: "CARTÃO" },
];

const meta = {
  title: "UI/PillRadioGroup",
  component: PillRadioGroup<Pay>,
  args: { label: "Forma de pagamento", options, value: "pix", onChange: () => {} },
} satisfies Meta<typeof PillRadioGroup<Pay>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstSelected: Story = {};
export const OtherSelected: Story = { args: { value: "boleto" } };

export const Interactive: Story = {
  render: function Render() {
    const [value, setValue] = useState<Pay>("pix");
    return (
      <PillRadioGroup
        label="Forma de pagamento"
        options={options}
        value={value}
        onChange={setValue}
      />
    );
  },
};
