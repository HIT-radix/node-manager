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
  const isNodeOwnerView = useSelector((state) => state.app.isNodeOwnerView);

  const readyToUnstake = useMemo(() => {
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
    () => +readyToUnstake.readyToWithdrawAmount > 0,
    [readyToUnstake.readyToWithdrawAmount]
  );
  return (
    <>
      <div
        className={"collapse text-accent bg-base-200 border border-accent "
          .concat(isExpandable ? "collapse-arrow " : "collapse-close ")
          .concat(isNodeOwnerView ? "border-secondary " : "border-accent ")}
      >
        <input type="checkbox" />
        <div className="collapse-title ">
          <p
            className={"font-medium text-xl mb-2 ".concat(
              isNodeOwnerView ? "text-secondary " : "text-accent "
            )}
          >
            Step {isNodeOwnerView ? "6" : "3"}: Ready to Withdraw
          </p>
          <div className="min-w-[300px] text-primary">
            <InfoTile
              title="Your LSUs ready to withdraw"
              value={formatTokenAmount(+readyToUnstake.readyToWithdrawAmount)}
              isLoading={balanceLoading}
              tooltip={readyToUnstake.readyToWithdrawAmount}
              isGreenish={isNodeOwnerView}
            />
          </div>
        </div>
        <div className="collapse-content text-primary flex items-center justify-center">
          <WithdrawReadyTable filterReadyToUnstakes={readyToUnstake.readyUnstakes} />
        </div>
      </div>
    </>
  );
};

export default Step6;
