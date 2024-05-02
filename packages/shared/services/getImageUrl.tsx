export function getImageUrl(src: string) {
  return new URL(`../../resources/img/${src}`, import.meta.url).href;
}
