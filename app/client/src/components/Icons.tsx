interface IconProps {
  width?: number;
  height?: number;
  alt?: string;
}
interface IUserAvatarIcon extends IconProps {
  avatar: string | undefined;
}
export const Ellipsis = ({ width, height }: IconProps) => {
  return (
    <img
      className={`w-${width} h-${height}`}
      src="../../public/svgs/ellipsis.svg"
      //   width=""
      //   height=""
      alt="ellipsis icon"
      loading="lazy"
    />
  );
};
export const UserIcon = ({ width, height }: IconProps) => {
  return (
    <img
      className={`w-${width} h-${height}`}
      //   width=""
      //   height=""
      src={"../../public/svgs/user-icon.svg"}
      alt="profile link icon"
    />
  );
};
export const BellIcon = ({ width, height }: IconProps) => {
  return (
    <img
      className={`w-${width} h-${height}`}
      //   width=""
      //   height=""
      src="../../public/svgs/bell-icon.svg"
      alt="bell icon"
    />
  );
};
export const PinNib = ({ width, height }: IconProps) => {
  return (
    <img
      className={`w-${width} h-${height}`}
      src="../../public/svgs/pen-nib.svg"
      alt="pen nib icon"
    />
  );
};
export const UserAvatarIcon = ({
  width,
  height,
  alt,
  avatar,
}: IUserAvatarIcon) => {
  return avatar ? (
    <img
      className={`w-${width} h-${height}`}
      src={`../../../api/src/uploads/${avatar}`}
      alt={alt}
    />
  ) : (
    <img
      className={`w-${width} h-${height}`}
      src="../../public/svgs/user-blank.svg"
      alt={alt || `blank user avatar`}
    />
  );
};
export const SaveIcon = ({ width, height }: IconProps) => {
  return (
    <img
      className={`w-${width} h-${height}`}
      //   width=""
      //   height=""
      src="../../public/svgs/save-icon.svg"
      alt="save icon"
    />
  );
};
export const SavedIcon = ({ width, height }: IconProps) => {
  return (
    <img
      className={`w-${width} h-${height}`}
      //   width=""
      //   height=""
      src="../../public/svgs/saved-icon.svg"
      alt="save icon"
    />
  );
};
export const AlertIcon = ({ width, height }: IconProps) => {
  return (
    <img
      className={`w-${width} h-${height}`}
      //   width=""
      //   height=""
      src="../../public/svgs/alert-icon.svg"
      alt="alert icon"
    />
  );
};
export const FeatherIcon = ({ width, height }: IconProps) => {
  return (
    <img
      className={`w-${width} h-${height}`}
      //   width=""
      //   height=""
      src="../../public/svgs/writing-feather.svg"
      alt="Feather icon"
    />
  );
};
export const FollowIcon = ({ width, height }: IconProps) => {
  return (
    <img
      className={`w-${width} h-${height}`}
      //   width=""
      //   height=""
      src="../../public/svgs/follow-icon.svg"
      alt="Follow icon"
    />
  );
};
