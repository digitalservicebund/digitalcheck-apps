import Button, { type ButtonProps } from "./Button";
import ButtonContainer from "./ButtonContainer";
import Heading, { type HeadingProps } from "./Heading";
import Image, { type ImageProps } from "./Image";
import RichText from "./RichText";

export type ListItemProps = {
  identifier?: string;
  label?: HeadingProps;
  headline?: HeadingProps;
  image?: ImageProps;
  content?: string;
  buttons?: ButtonProps[];
};

const ListItem = ({
  identifier,
  label,
  headline,
  image,
  content,
  buttons,
  numeric,
}: ListItemProps & { readonly numeric?: number }) => {
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
        <div className="flex flex-row gap-16 items-center">
          {numeric ? (
            <div className="min-w-[40px] w-[40px] h-[40px] flex justify-center items-center border-2 border-solid border-gray-400 rounded-full">
              {numeric}
            </div>
          ) : (
            <div className="w-[16px] min-h-[1px] border border-solid border-black mr-[5px] ml-[17px]" />
          )}
          {label && <Heading {...label} />}
          {headline && <Heading {...headline} />}
        </div>
        {content && <RichText markdown={content} className="ml-[56px]" />}
        {buttons && buttons.length > 0 && (
          <ButtonContainer className="ml-[56px] mt-16">
            {buttons.map((button) => (
              <Button key={button.text ?? button.href} {...button} />
            ))}
          </ButtonContainer>
        )}
      </div>
    </div>
  );
};

export default ListItem;
