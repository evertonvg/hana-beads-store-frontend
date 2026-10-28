import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Checkbox } from "./Checkbox";
import { Field } from "./Field";
import { MaskedInput } from "./MaskedInput";
import { Select } from "./Select";
import { Textarea } from "./Textarea";
import { TextInput } from "./TextInput";

const meta = {
  title: "UI/Field",
  component: Field,
  args: { label: "E-MAIL", children: null },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Field {...args}>
      <TextInput type="email" placeholder="voce@exemplo.com" />
    </Field>
  ),
};

export const WithHint: Story = {
  render: (args) => (
    <Field {...args} hint="Usamos só para avisar do pedido.">
      <TextInput type="email" />
    </Field>
  ),
};

export const WithError: Story = {
  render: (args) => (
    <Field {...args} error="Informe um e-mail válido.">
      <TextInput type="email" defaultValue="voce@" />
    </Field>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <Field {...args}>
      <TextInput disabled defaultValue="bloqueado@exemplo.com" />
    </Field>
  ),
};

export const SelectField: Story = {
  render: (args) => (
    <Field {...args} label="ESTADO">
      <Select defaultValue="SP">
        <option value="SP">São Paulo</option>
        <option value="RJ">Rio de Janeiro</option>
      </Select>
    </Field>
  ),
};

export const TextareaField: Story = {
  render: (args) => (
    <Field {...args} label="OBSERVAÇÕES">
      <Textarea placeholder="Cores, tamanho, prazo..." />
    </Field>
  ),
};

export const CepMask: Story = {
  render: (args) => (
    <Field {...args} label="CEP">
      <MaskedInput mask="cep" value="01310100" readOnly />
    </Field>
  ),
};

export const CardMasks: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Field {...args} label="CPF">
        <MaskedInput mask="cpf" />
      </Field>
      <Field {...args} label="TELEFONE">
        <MaskedInput mask="phone" inputMode="tel" />
      </Field>
      <Field {...args} label="NÚMERO DO CARTÃO">
        <MaskedInput mask="card" autoComplete="cc-number" />
      </Field>
      <Field {...args} label="VALIDADE">
        <MaskedInput mask="cardExpiry" autoComplete="cc-exp" />
      </Field>
    </div>
  ),
};

export const CheckboxStates: Story = {
  render: () => (
    <div className="flex flex-col">
      <Checkbox label="Li e aceito os termos" />
      <Checkbox label="Receber novidades (opcional)" defaultChecked />
      <Checkbox label="Indisponível" disabled />
    </div>
  ),
};
