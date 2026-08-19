import fs from "fs";
import path from "path";
import { createCanvas } from "@napi-rs/canvas";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

function getObj(page, name) {
  return new Promise((resolve) => page.objs.get(name, (data) => resolve(data)));
}

function writePngFromRaw(obj, outPath) {
  const w = obj.width;
  const h = obj.height;
  const kind = obj.kind; // 1 GRAYSCALE_1BPP? In pdfjs ImageKind: GRAYSCALE=1, RGB=2, RGBA=3
  const channels = kind === 1 ? 1 : kind === 2 ? 3 : 4;
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext("2d");
  const img = ctx.createImageData(w, h);
  const src = obj.data;
  for (let i = 0, p = 0; i < w * h; i++) {
    if (channels === 1) {
      const v = src[i];
      img.data[p++] = v; img.data[p++] = v; img.data[p++] = v; img.data[p++] = 255;
    } else if (channels === 3) {
      img.data[p++] = src[i * 3];
      img.data[p++] = src[i * 3 + 1];
      img.data[p++] = src[i * 3 + 2];
      img.data[p++] = 255;
    } else {
      img.data[p++] = src[i * 4];
      img.data[p++] = src[i * 4 + 1];
      img.data[p++] = src[i * 4 + 2];
      img.data[p++] = src[i * 4 + 3];
    }
  }
  ctx.putImageData(img, 0, 0);
  fs.writeFileSync(outPath, canvas.toBuffer("image/png"));
}

const data = new Uint8Array(fs.readFileSync("brochure.pdf"));
const doc = await pdfjs.getDocument({ data, verbosity: 0 }).promise;
console.log("pages", doc.numPages);

for (let i = 1; i <= doc.numPages; i++) {
  const page = await doc.getPage(i);
  // render page at modest scale
  const viewport = page.getViewport({ scale: 1.5 });
  const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
  const ctx = canvas.getContext("2d");
  await page.render({ canvasContext: ctx, viewport }).promise;
  const pageOut = path.join("page-" + i + ".png");
  fs.writeFileSync(pageOut, canvas.toBuffer("image/png"));
  console.log("wrote", pageOut, canvas.width, "x", canvas.height);

  const opList = await page.getOperatorList();
  const names = new Set();
  for (let j = 0; j < opList.fnArray.length; j++) {
    const fn = opList.fnArray[j];
    const args = opList.argsArray[j];
    if (fn === 85 || fn === 82 || fn === 84) names.add(args?.[0]);
  }
  for (const name of names) {
    const obj = await getObj(page, name);
    if (!obj?.data) { console.log("skip", name, obj && Object.keys(obj)); continue; }
    const out = `img-p${i}-${name}.png`;
    writePngFromRaw(obj, out);
    console.log("image", out, obj.width, obj.height, "kind", obj.kind);
  }
}
