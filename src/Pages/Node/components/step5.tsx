import { useSelector } from "Store";
import UnstakingLSUsTable from "./unstakingTable";
import { useMemo } from "react";
import Decimal from "decimal.js";
import InfoTile from "Components/infoTile";
import { formatTokenAmount } from "Utils/format";

const Step5 = () => {
  const epoch = useSelector((state) => state.nodeManager.epoch);
  const useUnstakeClaimNFTs = useSelector((state) => state.session.useUnstakeClaimNFTs);
  const balanceLoading = useSelector((state) => state.loadings.balanceLoading);

  const filterPending = useMemo(() => {
    let totalPendingUnstakeAmount = new Decimal("0");
    const pendingUnstakes = Object.values(useUnstakeClaimNFTs).filter((nft) => {
      const isPending = +nft.claim_epoch > epoch;
      if (isPending) {
        totalPendingUnstakeAmount = totalPendingUnstakeAmount.add(nft.claim_amount);
      }
      return isPending;
    });
    return { pendingUnstakes, totalPendingUnstakeAmount: totalPendingUnstakeAmount.toString() };
  }, [epoch, useUnstakeClaimNFTs]);
  const isExpandable = useMemo(
    () => +filterPending.totalPendingUnstakeAmount > 0,
    [filterPending.totalPendingUnstakeAmount]
  );
  return (
    <div
      className={"collapse text-accent bg-base-200 border border-accent ".concat(
        isExpandable ? "collapse-arrow" : "collapse-close"
      )}
    >
      <input type="checkbox" />
      <div className="collapse-title ">
        <p className="text-accent font-medium text-xl mb-2">Step 5: Unstakes in progress</p>
        <div className="min-w-[300px] mb-5 text-primary">
          <InfoTile
            title="Your LSU balance of this node"
            value={formatTokenAmount(+filterPending.totalPendingUnstakeAmount)}
            isLoading={balanceLoading}
            tooltip={filterPending.totalPendingUnstakeAmount}
          />
        </div>
      </div>
      <div className="collapse-content text-primary">
        <UnstakingLSUsTable pendingUnstakes={filterPending.pendingUnstakes} />
      </div>
    </div>
  );
};

export default Step5;
