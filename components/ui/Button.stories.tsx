import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./Button";

const meta = {
  title: "UI/Button",
  component: Button,
  args: { variant: "primary", children: "+ PEGAR ITEM" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: "secondary", children: "VER LOJA" } };
export const Yellow: Story = { args: { variant: "yellow", children: "INSERT COIN ›" } };
export const Danger: Story = { args: { variant: "danger", children: "EXCLUIR CONTA" } };
export const Ghost: Story = { args: { variant: "ghost", children: "‹ CONTINUAR JOGANDO" } };
export const Disabled: Story = { args: { disabled: true } };
export const Small: Story = { args: { size: "sm" } };
export const Large: Story = { args: { size: "lg" } };
export const AsLink: Story = { args: { href: "/loja", children: "IR PARA A LOJA" } };

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      <Button variant="primary">PRIMARY</Button>
      <Button variant="secondary">SECONDARY</Button>
      <Button variant="yellow">YELLOW</Button>
      <Button variant="danger">DANGER</Button>
      <Button variant="ghost">GHOST</Button>
    </div>
  ),
};
