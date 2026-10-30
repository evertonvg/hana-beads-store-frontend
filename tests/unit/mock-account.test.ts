import { beforeEach, describe, expect, it } from "vitest";
import { createMockAccount } from "@/lib/data/mock/account";
import { createMockAuth } from "@/lib/data/mock/auth";
import { createMockOrders } from "@/lib/data/mock/orders";
import { getMockStore } from "@/lib/data/mock/store";
import type { Address } from "@/lib/data/types";

const home: Address = {
  label: "Trabalho",
  cep: "01001-000",
  street: "Praça da Sé",
  number: "200",
  complement: "",
  district: "Sé",
  city: "São Paulo",
  state: "SP",
};

describe("mock account", () => {
  beforeEach(() => getMockStore().reset());

  it("reads and updates the profile, keeping the e-mail", async () => {
    const port = createMockAccount();
    expect(await port.profile("ana")).toMatchObject({
      id: "ana",
      email: "ana@teste.dev",
      cpf: "529.982.247-25",
    });
    await port.updateProfile("ana", { name: "Ana Maria", phone: "(11) 90000-0000", cpf: null });
    expect(await port.profile("ana")).toMatchObject({
      name: "Ana Maria",
      phone: "(11) 90000-0000",
      cpf: null,
      email: "ana@teste.dev",
    });
  });

  it("changes the password only when the current one is right", async () => {
    const port = createMockAccount();
    expect(await port.changePassword("ana", "errada", "Nova@1234")).toEqual({ ok: false });
    expect(await createMockAuth().signIn("ana@teste.dev", "Senha@123")).not.toBeNull();
    expect(await port.changePassword("ana", "Senha@123", "Nova@1234")).toEqual({ ok: true });
    expect(await createMockAuth().signIn("ana@teste.dev", "Nova@1234")).not.toBeNull();
    expect(await createMockAuth().signIn("ana@teste.dev", "Senha@123")).toBeNull();
  });

  it("keeps exactly one default address and promotes another when it is removed", async () => {
    const port = createMockAccount();
    const added = await port.upsertAddress("ana", home);
    expect(added.id).toBeTruthy();
    expect(added.isDefault).toBe(false);
    await port.setDefaultAddress("ana", added.id as string);
    let list = await port.addresses("ana");
    expect(list.filter((a) => a.isDefault).map((a) => a.id)).toEqual([added.id]);
    await port.deleteAddress("ana", added.id as string);
    list = await port.addresses("ana");
    expect(list).toHaveLength(1);
    expect(list[0]?.isDefault).toBe(true);
  });

  it("never touches another user's address", async () => {
    const port = createMockAccount();
    await port.deleteAddress("bruno", "ana-casa");
    await port.setDefaultAddress("bruno", "ana-casa");
    expect(await port.addresses("ana")).toHaveLength(1);
    expect(await port.addresses("bruno")).toEqual([]);
    await port.upsertAddress("bruno", { ...home, id: "ana-casa", street: "Hackeada" });
    expect((await port.addresses("ana"))[0]?.street).toBe("Praça da Sé");
  });

  it("appends consent records and never rewrites old ones", async () => {
    const port = createMockAccount();
    await port.setConsent("ana", "email_marketing", true);
    await port.setConsent("ana", "email_marketing", false);
    const records = await port.consents("ana");
    expect(records).toHaveLength(2);
    expect(records[0]).toMatchObject({ granted: true, revokedAt: null });
    expect(records[1]?.granted).toBe(false);
    expect(records[1]?.revokedAt).not.toBeNull();
  });

  it("refuses to disconnect the last way to sign in", async () => {
    const port = createMockAccount();
    expect(await port.connections("ana")).toEqual([{ provider: "google", email: "ana@teste.dev" }]);
    expect(await port.disconnect("ana", "google")).toEqual({ ok: true });
    expect(await port.connections("ana")).toEqual([]);
    await port.connect("ana", "facebook");
    getMockStore().users.find((u) => u.id === "ana")!.password = "";
    expect(await port.disconnect("ana", "facebook")).toEqual({ ok: false });
    expect(await port.connections("ana")).toHaveLength(1);
  });

  it("exports only the user's own data", async () => {
    const port = createMockAccount();
    await port.setConsent("ana", "email_marketing", true);
    const data = await port.exportData("ana");
    const text = JSON.stringify(data);
    expect(data.profile).toMatchObject({ email: "ana@teste.dev" });
    expect(text).not.toContain("bruno");
    expect(text).not.toContain("Senha@123");
  });

  it("does not delete anything when the password is wrong", async () => {
    const port = createMockAccount();
    expect(await port.deleteAccount("ana", "errada")).toEqual({ ok: false });
    expect(await createMockAuth().userById("ana")).not.toBeNull();
    expect(await port.addresses("ana")).toHaveLength(1);
  });

  it("deletes the account, anonymizes the orders and keeps other users", async () => {
    const orders = createMockOrders();
    const order = await orders.create(
      {
        userId: "ana",
        guestToken: null,
        paymentMethod: "pix",
        items: [],
        subtotalCents: null,
        shippingCents: null,
        discountCents: 0,
        totalCents: null,
        shippingAddress: { ...home },
        customer: { name: "Ana Souza", email: "ana@teste.dev", phone: "(11) 91234-5678", cpf: "x" },
        shippingService: "PAC",
      },
      "key-1",
    );
    const port = createMockAccount();
    await port.setConsent("ana", "email_marketing", true);
    expect(await port.deleteAccount("ana", "Senha@123")).toEqual({ ok: true });
    expect(await createMockAuth().userById("ana")).toBeNull();
    expect(await createMockAuth().signIn("ana@teste.dev", "Senha@123")).toBeNull();
    expect(await port.addresses("ana")).toEqual([]);
    expect(await port.consents("ana")).toEqual([]);
    const kept = getMockStore().orders.find((o) => o.id === order.id);
    expect(kept?.userId).toBeNull();
    expect(kept?.customer.name).toBe("[removido]");
    expect(await createMockAuth().userById("bruno")).not.toBeNull();
  });
});
