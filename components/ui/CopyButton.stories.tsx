import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { CopyButton } from "./CopyButton";

const meta = {
  title: "UI/CopyButton",
  component: CopyButton,
  args: { value: "00020126580014br.gov.bcb.pix" },
} satisfies Meta<typeof CopyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Copied: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "COPIAR" }));
    await expect(canvas.getByRole("button", { name: "COPIADO ✓" })).toBeVisible();
  },
};
