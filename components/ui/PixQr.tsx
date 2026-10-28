import { QRCodeSVG } from "qrcode.react";

type Props = {
  /** The PIX "copia e cola" payload. */
  value: string;
  label: string;
  size?: number;
};

/** Real QR code of the PIX payload inside the pixel frame. */
export function PixQr({ value, label, size = 200 }: Props) {
  return (
    <div className="inline-block border-4 border-text bg-white p-2 shadow-hard-sm">
      <QRCodeSVG
        value={value}
        size={size}
        level="M"
        marginSize={2}
        bgColor="#FFFFFF"
        fgColor="#14121F"
        role="img"
        aria-label={label}
        className="block"
      />
    </div>
  );
}
