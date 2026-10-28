import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Accordion } from "./Accordion";

const meta = {
  title: "UI/Accordion",
  component: Accordion,
  args: {
    items: [
      {
        id: "prazo",
        title: "PRAZO DE PRODUÇÃO",
        content: "Cada peça é feita à mão sob encomenda.",
      },
      { id: "cuidados", title: "CUIDADOS", content: "Evite água e calor direto." },
      { id: "trocas", title: "TROCAS", content: "Veja a política de trocas." },
    ],
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {};
export const Open: Story = { args: { defaultOpen: "prazo" } };
