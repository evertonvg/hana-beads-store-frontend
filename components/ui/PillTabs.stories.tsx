import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { PillTabs } from "./PillTabs";

const tabs = [
  { id: "dados", label: "DADOS" },
  { id: "enderecos", label: "ENDEREÇOS" },
  { id: "privacidade", label: "PRIVACIDADE" },
];

const meta = {
  title: "UI/PillTabs",
  component: PillTabs,
  args: { label: "Seções da conta", tabs, selected: "dados", onChange: () => {} },
} satisfies Meta<typeof PillTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstSelected: Story = {};
export const LastSelected: Story = { args: { selected: "privacidade" } };

export const WithPanels: Story = {
  render: function Render() {
    const [selected, setSelected] = useState("dados");
    return (
      <PillTabs
        label="Seções da conta"
        tabs={tabs}
        selected={selected}
        onChange={setSelected}
        panels={{
          dados: <p>Seus dados de acesso.</p>,
          enderecos: <p>Endereços salvos.</p>,
          privacidade: <p>Consentimentos.</p>,
        }}
      />
    );
  },
};
