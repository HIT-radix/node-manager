import { ReactNode } from "react";
import Skeleton from "react-loading-skeleton";
import { InfoTooltip } from "./tooltip";
import { InfoTooltipProps } from "Types/misc";

type Props = {
  title: string | ReactNode;
  value: string | number | ReactNode;
  isLoading: boolean;
  tooltip?: string;
  infoTooltipProps?: InfoTooltipProps;
};

const InfoTile = ({ title, value, isLoading, tooltip, infoTooltipProps }: Props) => {
  return (
    <div className="bg-accent rounded-lg px-3 py-2 w-full">
      {typeof title === "string" ? (
        <div className="flex items-center">
          <p className="font-semibold text-sm opacity-80 ">{title}</p>
          {infoTooltipProps ? <InfoTooltip {...infoTooltipProps} /> : null}
        </div>
      ) : (
        title
      )}
      {isLoading ? (
        <Skeleton
          baseColor="#242d20"
          highlightColor="#A0D490"
          width="50%"
          style={{ opacity: 0.5 }}
          height={30}
        />
      ) : (
        <div className="text-3xl mt-2 cursor-pointer" title={tooltip}>
          {value}
        </div>
      )}
    </div>
  );
};

export default InfoTile;
