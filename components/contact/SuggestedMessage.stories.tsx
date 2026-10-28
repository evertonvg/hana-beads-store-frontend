import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SuggestedMessage } from "./SuggestedMessage";

// Renders only when the configured channel cannot prefill messages.
const meta = {
  title: "Contact/SuggestedMessage",
  component: SuggestedMessage,
  args: { text: "Olá! Quero encomendar a Estrela número 13." },
} satisfies Meta<typeof SuggestedMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
