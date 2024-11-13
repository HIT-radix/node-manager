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
  isGreenish?: boolean;
};

const InfoTile = ({
  title,
  value,
  isLoading,
  tooltip,
  infoTooltipProps,
  isGreenish = false,
}: Props) => {
  return (
    <div
      className={"rounded-lg px-3 py-2 w-full ".concat(
        isGreenish ? "bg-secondary/20 " : "bg-accent "
      )}
    >
      {typeof title === "string" ? (
        <div className="flex items-center">
          <p
            className={"font-semibold text-sm opacity-80 ".concat(
              isGreenish ? "text-accent " : "text-primary "
            )}
          >
            {title}
          </p>
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
        <div
          className={"text-3xl mt-2 cursor-pointer ".concat(
            isGreenish ? "text-accent " : "text-primary "
          )}
          title={tooltip}
        >
          {value}
        </div>
      )}
    </div>
  );
};

export default InfoTile;
