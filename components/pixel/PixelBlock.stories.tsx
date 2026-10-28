import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PixelBlock } from "./PixelBlock";

const meta = {
  title: "Pixel/PixelBlock",
  component: PixelBlock,
  args: { color: "#FF5FAE", size: 64 },
} satisfies Meta<typeof PixelBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pink: Story = {};
export const Cyan: Story = { args: { color: "#4FD1FF" } };
export const Large: Story = { args: { size: 128, color: "#FFD23F" } };
