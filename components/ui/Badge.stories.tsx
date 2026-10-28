import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "./Badge";

const meta = {
  title: "UI/Badge",
  component: Badge,
  args: { tone: "yellow", children: "NOVO" },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Yellow: Story = {};
export const Green: Story = { args: { tone: "green", children: "EM ESTOQUE" } };
export const Cyan: Story = { args: { tone: "cyan", children: "ENVIADO" } };
export const Accent: Story = { args: { tone: "accent", children: "PAGO" } };
export const Muted: Story = { args: { tone: "muted", children: "ESGOTADO" } };
export const Purple: Story = { args: { tone: "purple", children: "SOB ENCOMENDA" } };
