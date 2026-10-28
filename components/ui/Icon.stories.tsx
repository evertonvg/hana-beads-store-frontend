import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Icon, type IconName } from "./Icon";

const NAMES: IconName[] = [
  "cart",
  "menu",
  "close",
  "heart",
  "search",
  "send",
  "chat",
  "user",
  "home",
  "shop",
  "brush",
  "chevron-left",
  "chevron-right",
  "plus",
  "minus",
  "trash",
  "copy",
  "check",
  "truck",
  "lock",
  "upload",
];

const meta = {
  title: "UI/Icon",
  component: Icon,
  args: { name: "cart", size: 24 },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithTitle: Story = { args: { title: "Carrinho" } };

export const Gallery: Story = {
  render: () => (
    <ul className="grid grid-cols-4 gap-4 md:grid-cols-7">
      {NAMES.map((name) => (
        <li key={name} className="flex flex-col items-center gap-2 text-text">
          <Icon name={name} size={28} />
          <span className="text-xs text-text-muted">{name}</span>
        </li>
      ))}
    </ul>
  ),
};
