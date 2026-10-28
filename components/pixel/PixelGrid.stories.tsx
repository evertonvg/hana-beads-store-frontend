import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PixelGrid } from "./PixelGrid";

const heart = [".##.##.", "#######", "#######", ".#####.", "..###..", "...#..."];

const meta = {
  title: "Pixel/PixelGrid",
  component: PixelGrid,
  args: { rows: heart, palette: { "#": "#FF5FAE" }, cell: 16, label: "Coração pixel" },
} satisfies Meta<typeof PixelGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Beveled: Story = { args: { bevel: true } };
export const WithGap: Story = { args: { gap: 2, cell: 14 } };
export const Decorative: Story = { args: { label: undefined } };
