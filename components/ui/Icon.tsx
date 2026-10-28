import {
  Brush,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Heart,
  House,
  Lock,
  Menu,
  MessageCircle,
  Minus,
  Plus,
  Search,
  Send,
  ShoppingCart,
  Store,
  Trash2,
  Truck,
  Upload,
  User,
  X,
  type LucideIcon,
} from "lucide-react";

const ICONS = {
  cart: ShoppingCart,
  menu: Menu,
  close: X,
  heart: Heart,
  search: Search,
  send: Send,
  chat: MessageCircle,
  user: User,
  home: House,
  shop: Store,
  brush: Brush,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  plus: Plus,
  minus: Minus,
  trash: Trash2,
  copy: Copy,
  check: Check,
  truck: Truck,
  lock: Lock,
  upload: Upload,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

type Props = {
  name: IconName;
  size?: number;
  /** Accessible name. Without it the icon is decorative (`aria-hidden`). */
  title?: string;
  className?: string;
};

/** Square-capped, mitered stroke icon (design standard) on lucide-react. */
export function Icon({ name, size = 20, title, className }: Props) {
  const Glyph = ICONS[name];
  return (
    <Glyph
      size={size}
      color="currentColor"
      strokeWidth={2.5}
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={className}
      {...(title ? { role: "img", "aria-label": title } : { "aria-hidden": true })}
    />
  );
}
