import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FreeShippingBar } from "@/components/cart/FreeShippingBar";

describe("FreeShippingBar", () => {
  it("shows the placeholder when the threshold is unknown", () => {
    render(<FreeShippingBar subtotalCents={1000} thresholdCents={null} />);
    expect(screen.getByText("[Faltam R$ X para frete grátis]")).toBeTruthy();
  });

  it("shows the placeholder when the subtotal is unknown", () => {
    render(<FreeShippingBar subtotalCents={null} thresholdCents={10000} />);
    expect(screen.getByText("[Faltam R$ X para frete grátis]")).toBeTruthy();
  });

  it("shows what is missing below the threshold", () => {
    render(<FreeShippingBar subtotalCents={2500} thresholdCents={10000} />);
    expect(screen.getByText("Faltam R$ 75,00 para frete grátis")).toBeTruthy();
  });

  it("congratulates at or above the threshold", () => {
    render(<FreeShippingBar subtotalCents={10000} thresholdCents={10000} />);
    expect(screen.getByText("Você ganhou frete grátis")).toBeTruthy();
  });
});
