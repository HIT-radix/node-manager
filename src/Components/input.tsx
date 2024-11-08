import { useEffect, useMemo, useState } from "react";

import { AMOUNT_INPUT_REGEX } from "Constants/misc";
import { dispatch, useSelector } from "Store";
import { setAmount, setPercentage } from "Store/Reducers/staking";
import { Percentage, StakingTokens, Tabs } from "Types/reducers";
import {
  calculateInputWidth,
  calculateStHitWorthInHIT,
  validateDecimalPlaces,
} from "Utils/judgers";
import { BN, formatDollarAmount, toLocaleFormat } from "Utils/format";
import { Tooltip } from "./tooltip";
import HITlogo from "Assets/Images/hit-logo.png";
import StHITlogo from "Assets/Images/sthit-logo.png";
import Skeleton from "react-loading-skeleton";

export const Input = () => {
  const [inputWidth, setInputWidth] = useState(1.5);

  const hitPrice = useSelector((state) => state.app.hitPrice);
  const tokenDataLoading = useSelector((state) => state.loadings.tokenDataLoading);
  const amount = useSelector((state) => state.staking.amount);
  const isInSufficientBalance = useSelector((state) => state.staking.isInSufficientBalance);
  const currentTab = useSelector((state) => state.staking.currentTab);
  const stakedHIT = useSelector((state) => state.staking.stakedHIT);
  const stHIT_totalSupply = useSelector((state) => state.staking.stHIT_totalSupply);

  useEffect(() => {
    if (Number(amount)) {
      setInputWidth(calculateInputWidth(amount));
    }
  }, [amount]);

  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value.replaceAll(",", "");
    if (text.match(AMOUNT_INPUT_REGEX)) {
      if (validateDecimalPlaces(text, 18)) {
        setInputWidth(calculateInputWidth(text));
        dispatch(setAmount(text));
      }
    } else {
      resetInput();
    }
    dispatch(setPercentage(Percentage._0));
  };

  const resetInput = () => {
    dispatch(setAmount(""));
    setInputWidth(1.5);
  };

  const inputMaxWidth = useMemo(() => 120, []);

  const usdValue = useMemo(
    () =>
      BN(
        currentTab === Tabs.stake
          ? amount
          : calculateStHitWorthInHIT(amount, stakedHIT, stHIT_totalSupply)
      ).multipliedBy(hitPrice),
    [amount, currentTab, hitPrice, stHIT_totalSupply, stakedHIT]
  );

  return (
    <>
      <div
        className="flex justify-between items-center cursor-text"
        onClick={() => (document.getElementById("stake-input") as HTMLInputElement).focus()}
      >
        <div
          className="flex items-center"
          style={{
            maxWidth: `calc(100% - ${inputMaxWidth}px)`,
          }}
        >
          <input
            id="stake-input"
            value={toLocaleFormat(amount)}
            type="text"
            onChange={onValueChange}
            className={`input rounded-none bg-base-200 text-accent focus:outline-none focus:border-none  px-0 my-3 max-w-[100%] sm:max-w-[calc(100% - 40px)] text-3xl sm:text-5xl ${
              isInSufficientBalance ? "text-red-500" : ""
            }`}
            placeholder="0"
            style={{
              width: `${inputWidth}ch`,
            }}
          />
        </div>
        <div className="dropdown dropdown-bottom dropdown-end w-max mr-[-1rem]">
          <div
            tabIndex={0}
            role="button"
            className="btn bg-transparent text-accent flex items-center justify-end w-max rounded"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentTab === Tabs.stake ? HITlogo : StHITlogo}
              alt="ringMeshIcon"
              className="w-6 rounded-full"
            />{" "}
            <p>{currentTab === Tabs.stake ? StakingTokens.HIT : StakingTokens.StHIT}</p>
          </div>
        </div>
      </div>
      {tokenDataLoading ? (
        <Skeleton
          baseColor="#242d20"
          highlightColor="#A0D490"
          width="40px"
          style={{ opacity: 0.5 }}
        />
      ) : (
        <Tooltip text={"$" + Number(usdValue.toFixed(4)).toString()}>
          <span className="text-secondary text-sm mb-0">
            ~{formatDollarAmount(Number.isNaN(usdValue.toNumber()) ? 0 : usdValue.toNumber())}
          </span>
        </Tooltip>
      )}
    </>
  );
};
