import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PixQr } from "./PixQr";

const meta = {
  title: "UI/PixQr",
  component: PixQr,
  args: {
    value:
      "00020126580014br.gov.bcb.pix0136exemplo-de-chave-pix5204000053039865802BR5909EXEMPLO6009SAO PAULO62070503***6304ABCD",
    label: "QR Code do PIX",
  },
} satisfies Meta<typeof PixQr>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Small: Story = { args: { size: 140 } };
