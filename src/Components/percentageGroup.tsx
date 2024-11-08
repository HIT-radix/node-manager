import { dispatch, useSelector } from "Store";
import { setAmount, setPercentage } from "Store/Reducers/staking";
import { Percentage } from "Types/reducers";
import { getSelectedBalance } from "Utils/fetchers";
import { BN } from "Utils/format";

export const PercentageGroup = () => {
  const { percentage } = useSelector((state) => state.staking);
  const onPercentageClick = (Percentage: Percentage) => {
    const currentBalance = getSelectedBalance();
    if (currentBalance.toNumber() > 0) {
      const fraction = new BN(Percentage).toFraction();
      dispatch(
        setAmount(currentBalance.multipliedBy(fraction[0]).dividedBy(fraction[1]).toString())
      );
      dispatch(setPercentage(Percentage));
    }
  };
  return (
    <div className="flex flex-row items-center justify-between pt-3">
      <SingleBox
        percent={Percentage._10}
        selected={percentage === Percentage._10}
        setSelected={onPercentageClick}
      />
      <SingleBox
        percent={Percentage._25}
        selected={percentage === Percentage._25}
        setSelected={onPercentageClick}
      />
      <SingleBox
        percent={Percentage._50}
        selected={percentage === Percentage._50}
        setSelected={onPercentageClick}
      />
      <SingleBox
        percent={Percentage._75}
        selected={percentage === Percentage._75}
        setSelected={onPercentageClick}
      />
      <SingleBox
        percent={Percentage._100}
        selected={percentage === Percentage._100}
        setSelected={onPercentageClick}
      />
    </div>
  );
};

type SingleBoxProps = {
  percent: Percentage;
  selected: boolean;
  setSelected: (Percentage: Percentage) => void;
};

const MapPercentage: Partial<Record<Percentage, string>> = {
  [Percentage._10]: "10%",
  [Percentage._25]: "25%",
  [Percentage._50]: "50%",
  [Percentage._75]: "75%",
  [Percentage._100]: "Max",
};

const SingleBox = ({ percent, selected, setSelected }: SingleBoxProps) => {
  return (
    <div
      className={`${
        selected ? "bg-accent" : "bg-base-200"
      } w-1/6 text-center py-1.5 cursor-pointer rounded-lg`}
      onClick={() => setSelected(percent)}
    >
      <p className={`font-semibold ${selected ? "text-primary" : "text-secondary"}`}>
        {MapPercentage[percent]}
      </p>
    </div>
  );
};
