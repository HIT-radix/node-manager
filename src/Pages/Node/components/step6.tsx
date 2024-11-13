import InfoTile from "Components/infoTile";
import WithdrawReadyTable from "./withdrawReadyTable";
import { useMemo } from "react";
import Decimal from "decimal.js";
import { useSelector } from "Store";
import { formatTokenAmount } from "Utils/format";

const Step6 = () => {
  const epoch = useSelector((state) => state.nodeManager.epoch);
  const useUnstakeClaimNFTs = useSelector((state) => state.session.useUnstakeClaimNFTs);
  const balanceLoading = useSelector((state) => state.loadings.balanceLoading);

  const readyToStake = useMemo(() => {
    let readyToWithdrawAmount = new Decimal("0");
    const readyUnstakes = Object.values(useUnstakeClaimNFTs).filter((nft) => {
      const isReadyToUnstake = +nft.claim_epoch <= epoch;
      if (isReadyToUnstake) {
        readyToWithdrawAmount = readyToWithdrawAmount.add(nft.claim_amount);
      }
      return isReadyToUnstake;
    });
    return { readyUnstakes, readyToWithdrawAmount: readyToWithdrawAmount.toString() };
  }, [epoch, useUnstakeClaimNFTs]);
  const isExpandable = useMemo(
    () => +readyToStake.readyToWithdrawAmount > 0,
    [readyToStake.readyToWithdrawAmount]
  );
  return (
    <>
      <div
        className={"collapse text-accent bg-base-200 border border-accent ".concat(
          isExpandable ? "collapse-arrow" : "collapse-close"
        )}
      >
        <input type="checkbox" />
        <div className="collapse-title ">
          <p className="text-accent font-medium text-xl mb-2">Step 6: Ready to Withdraw</p>
          <div className="min-w-[300px] mb-5 text-primary">
            <InfoTile
              title="Your LSU balance of this node"
              value={formatTokenAmount(+readyToStake.readyToWithdrawAmount)}
              isLoading={balanceLoading}
              tooltip={readyToStake.readyToWithdrawAmount}
            />
          </div>
        </div>
        <div className="collapse-content text-primary">
          <WithdrawReadyTable filterReadyToUnstakes={readyToStake.readyUnstakes} />
        </div>
      </div>
    </>
  );
};

export default Step6;
