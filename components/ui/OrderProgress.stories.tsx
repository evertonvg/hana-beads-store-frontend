import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { OrderProgress } from "./OrderProgress";

const meta = {
  title: "UI/OrderProgress",
  component: OrderProgress,
  args: { step: 2, color: "#FF5FAE" },
} satisfies Meta<typeof OrderProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Step0: Story = { args: { step: 0 } };
export const Step1: Story = { args: { step: 1, color: "#FFD23F" } };
export const Step2: Story = {};
export const Step3: Story = { args: { step: 3, color: "#4FD1FF" } };
export const Delivered: Story = { args: { step: 4, color: "#7CFF6B" } };
