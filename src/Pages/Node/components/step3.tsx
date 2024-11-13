import InfoTile from "Components/infoTile";
import { formatTokenAmount } from "Utils/format";
import { useSelector } from "Store";
import ClaimUnlockedBtn from "./claimUnlockedBtn";
import { useMemo } from "react";

const Step3 = () => {
  const { unlockedLSUs } = useSelector((state) => state.nodeManager);
  const validatorDataLoading = useSelector((state) => state.loadings.validatorDataLoading);
  const isOwner = useSelector((state) => state.session.isOwner);

  const isExpandable = useMemo(() => +unlockedLSUs > 0 && isOwner, [unlockedLSUs, isOwner]);
  return (
    <div
      className={"collapse text-accent bg-base-200 border border-accent ".concat(
        isExpandable ? "collapse-arrow" : "collapse-close"
      )}
    >
      <input type="checkbox" />
      <div className="collapse-title ">
        <p className="text-accent font-medium text-xl mb-2">Step3: Claim Unlocked LSUs</p>
        <div className="min-w-[300px] mb-5 text-primary">
          <InfoTile
            title="Unlocked LSUs🔓 (owner only)"
            value={formatTokenAmount(+unlockedLSUs)}
            isLoading={validatorDataLoading}
            tooltip={unlockedLSUs}
          />
        </div>
      </div>
      <div className="collapse-content text-primary">
        <ClaimUnlockedBtn />
      </div>
    </div>
  );
};

export default Step3;
