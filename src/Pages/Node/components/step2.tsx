import InfoTile from "Components/infoTile";
import UnlockingLSUsTable from "./unlockingTable";
import { formatTokenAmount } from "Utils/format";
import { useSelector } from "Store";

const Step2 = () => {
  const { ownerLSUsInUnlockingProcess } = useSelector((state) => state.nodeManager);
  const validatorDataLoading = useSelector((state) => state.loadings.validatorDataLoading);

  return (
    <div className={"collapse collapse-arrow text-accent bg-base-200 "}>
      <input type="checkbox" />
      <div className="collapse-title ">
        <p className="text-accent font-medium text-xl mb-2">Step2: LSUs in unlocking process</p>
        <div className="min-w-[300px] mb-5 text-primary">
          <InfoTile
            title="LSUs in unlocking process (owner only)"
            value={formatTokenAmount(+ownerLSUsInUnlockingProcess)}
            isLoading={validatorDataLoading}
            tooltip={ownerLSUsInUnlockingProcess}
          />
        </div>
      </div>
      <div className="collapse-content text-primary">
        <UnlockingLSUsTable />
      </div>
    </div>
  );
};

export default Step2;
