export async function convertToWebP(file, portfolioId, index) {
  if (!file) return null;

  try {
    const img = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) reject("Failed to convert image to webp");
          const fileName = `${portfolioId}_${index + 1}.webp`;
          const newFile = new File([blob], fileName, { type: "image/webp" });

          resolve(newFile);
        },
        "image/webp",
        0.9
      );
    });
  } catch (error) {
    console.error("WEBP Conversion Failed: ", error);
    return null;
  }
}
