import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Container } from "./Container";
import { SectionTitle } from "./SectionTitle";

const meta = {
  title: "UI/Container and SectionTitle",
  component: Container,
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithTitle: Story = {
  render: () => (
    <Container className="border-2 border-dashed border-border py-6">
      <SectionTitle>SELECIONE SEU ITEM</SectionTitle>
      <p className="mt-4 text-sm text-text-muted">Conteúdo limitado a 1200px.</p>
    </Container>
  ),
};
