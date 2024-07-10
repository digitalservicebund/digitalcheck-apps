import { type BackgroundColor, isBackgroundColor } from ".";
import Background from "./Background";
import Button, { type ButtonProps } from "./Button";
import ButtonContainer from "./ButtonContainer";
import Heading, { type HeadingProps } from "./Heading";
import Image, { type ImageProps } from "./Image";
import RichText from "./RichText";

export type ListItemProps = {
  identifier?: string;
  label?: HeadingProps;
  headline?: HeadingProps;
  spacer?: boolean | HeadingProps;
  image?: ImageProps;
  content?: string;
  buttons?: ButtonProps[];
  background?: string;
  parentHasHeading?: boolean;
  isDisabled?: boolean;
};

const ListItem = ({
  identifier,
  label,
  headline,
  spacer,
  image,
  content,
  buttons,
  numeric,
  background,
  parentHasHeading,
  isDisabled,
}: ListItemProps & { readonly numeric?: number }) => {
  const backgroundColor =
    background && isBackgroundColor(background) ? background : undefined;
  const textColor = isDisabled ? "text-gray-700" : "";

  return (
    <div id={identifier} className="flex flex-row items-center justify-center">
      {image && (
        <Image
          {...image}
          {...{
            className:
              "max-[499px]:mb-16 max-[499px]:w-[144px] max-[499px]:h-[144px] h-[168px] w-[168px]" +
              " self-baseline",
          }}
        />
      )}
      <div
        className={`break-words ds-stack-16 w-full ${image ? "min-[500px]:ml-16" : ""}`}
      >
        {spacer && (
          <div className={`!-mb-12 ${numeric && "border-t-2 pb-16"}`}>
            {spacer !== true && (
              <div
                className={`flex flex-row gap-16 items-start ${numeric && "mt-32"}`}
              >
                <span className="display-block w-[40px] max-sm:w-[20px] shrink-0" />
                <Heading
                  tagName="div"
                  className="ds-label-section text-gray-900"
                  {...spacer}
                />
              </div>
            )}
          </div>
        )}
        <div className={`flex flex-row gap-16 items-start ${textColor}`}>
          <div className="w-[40px] max-sm:w-[20px] shrink-0">
            {numeric && (
              <div className="w-[40px] h-[40px] max-sm:min-w-[28px] max-sm:w-[28px] max-sm:h-[28px] flex justify-center items-center border-2 border-solid border-gray-400 rounded-full">
                {numeric}
              </div>
            )}
            {backgroundColor && (
              <div className="w-[20px] h-[20px] flex justify-center items-center bg-blue-900 rounded-full"></div>
            )}
          </div>
          <div className={`overflow-hidden ${backgroundColor && "rounded-lg"}`}>
            <Background
              backgroundColor={(backgroundColor as BackgroundColor) || "white"}
            >
              <div
                className={`flex flex-col gap-16 ${backgroundColor ? "py-64 px-96 max-sm:p-32" : "mt-4"}`}
              >
                <div className="flex flex-row gap-16 items-center">
                  {label && <Heading {...label} />}
                  {headline && (
                    <Heading
                      tagName={parentHasHeading ? "h3" : "h2"}
                      {...headline}
                    />
                  )}
                </div>
                {content && <RichText markdown={content} />}
                {buttons && buttons.length > 0 && (
                  <ButtonContainer className="mt-16">
                    {buttons.map((button) => (
                      <Button key={button.text ?? button.href} {...button} />
                    ))}
                  </ButtonContainer>
                )}
              </div>
            </Background>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListItem;
