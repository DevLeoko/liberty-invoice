import { PdfDocument } from "painless-pdf";
import fs from "fs";

const DEFAULT_FONTS = [
  {
    family: "Roboto",
    weight: "100",
    style: "normal",
    src: "Roboto-Thin.ttf",
  },
  {
    family: "Roboto",
    weight: "100",
    style: "italic",
    src: "Roboto-ThinItalic.ttf",
  },
  {
    family: "Roboto",
    weight: "300",
    style: "normal",
    src: "Roboto-Light.ttf",
  },
  {
    family: "Roboto",
    weight: "300",
    style: "italic",
    src: "Roboto-LightItalic.ttf",
  },
  {
    family: "Roboto",
    weight: "400",
    style: "normal",
    src: "Roboto-Regular.ttf",
  },
  {
    family: "Roboto",
    weight: "400",
    style: "italic",
    src: "Roboto-Italic.ttf",
  },
  {
    family: "Roboto",
    weight: "500",
    style: "normal",
    src: "Roboto-Medium.ttf",
  },
  {
    family: "Roboto",
    weight: "500",
    style: "italic",
    src: "Roboto-MediumItalic.ttf",
  },
  {
    family: "Roboto",
    weight: "700",
    style: "normal",
    src: "Roboto-Bold.ttf",
  },
  {
    family: "Roboto",
    weight: "bold",
    style: "normal",
    src: "Roboto-Bold.ttf",
  },
  {
    family: "Roboto",
    weight: "700",
    style: "italic",
    src: "Roboto-BoldItalic.ttf",
  },
  {
    family: "Roboto",
    weight: "bold",
    style: "italic",
    src: "Roboto-BoldItalic.ttf",
  },
  {
    family: "Roboto",
    weight: "900",
    style: "normal",
    src: "Roboto-Black.ttf",
  },
  {
    family: "Roboto",
    weight: "900",
    style: "italic",
    src: "Roboto-BlackItalic.ttf",
  },
].map((font) => {
  const base64 = fs.readFileSync(`./src/assets/fonts/${font.src}`, "base64");

  return {
    ...font,
    base64,
  };
});

export function addAllRobotoFonts(doc: PdfDocument) {
  DEFAULT_FONTS.forEach((font) => doc.addFont(font));
}
