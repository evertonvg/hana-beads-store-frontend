import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BeadArt } from "./BeadArt";

const star = ["..#..", ".###.", "#####", ".###.", ".#.#."];

const meta = {
  title: "Pixel/BeadArt",
  component: BeadArt,
  args: {
    rows: star,
    palette: { "#": "#FFD23F" },
    cell: 28,
    gap: 2,
    label: "Estrela de continhas",
  },
} satisfies Meta<typeof BeadArt>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Multicolor: Story = {
  args: {
    rows: ["ab.ba", "bccb.", "abcba"],
    palette: { a: "#FF5FAE", b: "#4FD1FF", c: "#7CFF6B" },
  },
};
