import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ContactButton } from "./ContactButton";

// The channel (name, color, URL) follows NEXT_PUBLIC_CONTACT_CHANNEL at build time.
const meta = {
  title: "Contact/ContactButton",
  component: ContactButton,
  args: { kind: "encomendar" },
} satisfies Meta<typeof ContactButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Order: Story = {};
export const Chat: Story = { args: { kind: "chamar" } };
export const Speak: Story = { args: { kind: "falar", message: "Olá! Quero saber mais." } };
export const View: Story = { args: { kind: "ver" } };
export const Large: Story = { args: { size: "lg" } };
