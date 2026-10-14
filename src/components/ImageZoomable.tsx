import type { ImageProps } from "@/components/Image";
import Image from "@/components/Image";
import { ZoomInOutlined } from "@digitalservicebund/icons";
import { twJoin, twMerge } from "tailwind-merge";

type ImageZoomableComponentProps = {
  image: Readonly<ImageProps>;
  className?: string;
  square?: boolean;
};

function ImageZoomable({
  image,
  className,
  square,
}: Readonly<ImageZoomableComponentProps>) {
  if (!image.url) return null;

  return (
    <a
      href={image.url}
      target="_blank"
      rel="noreferrer"
      className={twJoin(
        "link-unstyled relative block cursor-zoom-in",
        square && "after:block after:pb-[100%] after:content-['']",
      )}
    >
      <Image
        {...image}
        className={twMerge(
          "h-auto w-full",
          image.className,
          className,
          square && "absolute h-full w-full",
        )}
      />
      <ZoomInOutlined
        className="text-kern-action-default absolute bottom-16 left-16 size-32"
        fill="currentColor"
      />
    </a>
  );
}

export default ImageZoomable;
