const GetGradientData = async (imagePath) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const colors = { r: 0, g: 0, b: 0 };
  try {
    const response = await fetch(`${imagePath}`);
    const blob = await response.blob();
    const img = await createImageBitmap(blob);
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixelCount = imageData.data.length / 4;

    for (let i = 0; i < imageData.data.length; i += 4) {
      colors.r += imageData.data[i];
      colors.g += imageData.data[i + 1];
      colors.b += imageData.data[i + 2];
    }

    colors.r = Math.round(colors.r / pixelCount);
    colors.g = Math.round(colors.g / pixelCount);
    colors.b = Math.round(colors.b / pixelCount);

    return colors;
  } catch (error) {
    console.error("error", error);
    return null;
  }
};

export default GetGradientData;
