import InfoTile from "Components/infoTile";
import UnlockingLSUsTable from "./unlockingTable";
import { formatTokenAmount } from "Utils/format";
import { useSelector } from "Store";
import { useMemo } from "react";

const Step2 = () => {
  const { ownerLSUsInUnlockingProcess } = useSelector((state) => state.nodeManager);
  const validatorDataLoading = useSelector((state) => state.loadings.validatorDataLoading);
  const isNodeOwnerView = useSelector((state) => state.app.isNodeOwnerView);

  const isExpandable = useMemo(
    () => +ownerLSUsInUnlockingProcess > 0,
    [ownerLSUsInUnlockingProcess]
  );

  return (
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
          Step 2: LSUs in unlocking process
        </p>
        <div className="min-w-[300px] text-primary">
          <InfoTile
            title="LSUs in unlocking process (owner only)"
            value={formatTokenAmount(+ownerLSUsInUnlockingProcess)}
            isLoading={validatorDataLoading}
            tooltip={ownerLSUsInUnlockingProcess}
          />
        </div>
      </div>
      <div className="collapse-content text-primary flex items-center justify-center">
        <UnlockingLSUsTable />
      </div>
    </div>
  );
};

export default Step2;
