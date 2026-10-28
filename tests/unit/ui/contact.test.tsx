import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PublicEnv } from "@/lib/env";
import { ContactButton } from "@/components/contact/ContactButton";
import { SuggestedMessage } from "@/components/contact/SuggestedMessage";

const state = vi.hoisted(() => ({ env: {} as PublicEnv }));

vi.mock("@/lib/env", () => ({
  get publicEnv() {
    return state.env;
  },
}));

const base: PublicEnv = {
  siteUrl: "http://localhost:3000",
  contactChannel: "instagram",
  instagramUser: "pixelperfect.teste",
  whatsappNumber: "+55 (11) 91234-5678",
  freeShippingCents: null,
  parallaxIntensity: 1,
  authApple: false,
  analyticsSrc: null,
};

beforeEach(() => {
  state.env = base;
});

describe("ContactButton", () => {
  it("renders the labelled direct link in a new tab", () => {
    render(<ContactButton kind="encomendar" />);
    const link = screen.getByRole("link", { name: "ENCOMENDAR PELO DIRECT" });
    expect(link).toHaveAttribute("href", "https://ig.me/m/pixelperfect.teste");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener");
  });

  it("passes the prefilled message when the channel supports it", () => {
    state.env = { ...base, contactChannel: "whatsapp" };
    render(<ContactButton kind="falar" message="Oi!" />);
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "https://wa.me/5511912345678?text=Oi!",
    );
  });
});

describe("SuggestedMessage", () => {
  it("shows the text and a copy button when the channel has no prefill", () => {
    render(<SuggestedMessage text="Olá, quero a estrela" />);
    expect(screen.getByText("Olá, quero a estrela")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "COPIAR" })).toBeInTheDocument();
  });

  it("renders nothing when the channel accepts prefill", () => {
    state.env = { ...base, contactChannel: "whatsapp" };
    const { container } = render(<SuggestedMessage text="Olá" />);
    expect(container).toBeEmptyDOMElement();
  });
});
