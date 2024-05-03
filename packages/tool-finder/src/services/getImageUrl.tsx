export function getImageUrl(src: string) {
  return new URL(`/src/resources/img/${src}`, import.meta.url).href;
}
