export async function convertToWebP(blob, outputFileName) {
  const img = await createImageBitmap(blob);

  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  return new Promise((resolve) => {
    canvas.toBlob(
      (webpBlob) => {
        const finalFile = new File(
          [webpBlob],
          outputFileName,
          { type: "image/webp" }
        );

        resolve(finalFile);
      },
      "image/webp",
      0.9
    );
  });
}
