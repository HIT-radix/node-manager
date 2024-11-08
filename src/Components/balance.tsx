import { useMemo } from "react";
import Skeleton from "react-loading-skeleton";

import { useSelector } from "Store";
import { StakingTokens, Tabs } from "Types/reducers";
import WalletIcon from "Assets/Svgs/wallet.svg";
import { formatDollarAmount, formatTokenAmount } from "Utils/format";
import { Tooltip } from "./tooltip";
import { getSelectedBalance } from "Utils/fetchers";
import { calculateStHitWorthInHIT } from "Utils/judgers";
import HITlogo from "Assets/Images/hit-logo.png";
import StHITlogo from "Assets/Images/sthit-logo.png";

export const Balance = () => {
  const currentTab = useSelector((state) => state.staking.currentTab);
  const stHitBalance = useSelector((state) => state.staking.stHitBalance);
  const hitBalance = useSelector((state) => state.session.hitBalance);
  const hitPrice = useSelector((state) => state.app.hitPrice);
  const stakedHIT = useSelector((state) => state.staking.stakedHIT);
  const stHIT_totalSupply = useSelector((state) => state.staking.stHIT_totalSupply);
  const balanceLoading = useSelector((state) => state.loadings.balanceLoading);
  const tokenDataLoading = useSelector((state) => state.loadings.tokenDataLoading);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const amountToShow = useMemo(() => getSelectedBalance(), [currentTab, stHitBalance, hitBalance]);

  const usdPriceToShow = useMemo(
    () =>
      currentTab === Tabs.stake
        ? amountToShow.multipliedBy(hitPrice)
        : calculateStHitWorthInHIT(stHitBalance, stakedHIT, stHIT_totalSupply).multipliedBy(
            hitPrice
          ),
    [currentTab, amountToShow, hitPrice, stHitBalance, stakedHIT, stHIT_totalSupply]
  );

  const currentToken = useMemo(
    () => (currentTab === Tabs.stake ? StakingTokens.HIT : StakingTokens.StHIT),
    [currentTab]
  );

  return (
    <div className="text-xs flex items-center justify-between">
      <div className="flex items-center text-secondary gap-1">
        <p className="font-semibold">Available</p>
        <img
          src={currentTab === Tabs.stake ? HITlogo : StHITlogo}
          alt="logo"
          className="w-4 rounded-full"
        />
        <p className="font-semibold">{currentToken}</p>
      </div>
      <span className="flex ml-1 items-center">
        {balanceLoading ? (
          <Skeleton
            baseColor="#242d20"
            highlightColor="#A0D490"
            width="50px"
            style={{ opacity: 0.5 }}
          />
        ) : (
          <>
            <img src={WalletIcon} alt="WalletIcon" className="mb-1" />
            <Tooltip text={amountToShow.toString() + " " + currentToken}>
              <p className="font-bold ml-1 text-secondary">
                {formatTokenAmount(amountToShow.toNumber())}
              </p>
            </Tooltip>
            {tokenDataLoading ? (
              <Skeleton
                baseColor="#242d20"
                highlightColor="#A0D490"
                width="40px"
                style={{ opacity: 0.5 }}
              />
            ) : (
              <Tooltip text={"$" + Number(usdPriceToShow.toFixed(4)).toString()}>
                <span className="ml-1 text-secondary">
                  (~
                  {formatDollarAmount(
                    Number.isNaN(usdPriceToShow.toNumber()) ? 0 : usdPriceToShow.toNumber()
                  )}
                  )
                </span>
              </Tooltip>
            )}
          </>
        )}{" "}
      </span>
    </div>
  );
};
