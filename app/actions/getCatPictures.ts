"use server";

export async function getCatPictures() {
  const response = await fetch("https://api.thecatapi.com/v1/images/search?limit=2");
  const data = await response.json();
  return data.slice(0, 2).map((cat: any) => {
    const urlParts = cat.url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const name = `${cat.id}.${fileName.split('.')[1]}`;
    return { url: cat.url, name };
  });
}
