export type ImageProps = {
  url: string;
  width?: number;
  height?: number;
  alternativeText?: string;
  className?: string;
};

function Image({
  url,
  width,
  height,
  alternativeText,
  className,
  ...props
}: Readonly<ImageProps>) {
  if (!url) return null;

  // when no alternative text is given, the image is treated
  // as a decorative image
  const decorativeImage = "";

  return (
    <img
      {...props}
      src={url}
      alt={alternativeText ?? decorativeImage}
      width={width}
      height={height}
      className={className}
    />
  );
}

export default Image;
