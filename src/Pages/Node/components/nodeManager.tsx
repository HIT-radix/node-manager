import InfoTile from "Components/infoTile";
import { formatTokenAmount } from "Utils/format";
import { useSelector } from "Store";
import Step4 from "./step4";
import Step5 from "./step5";
import Step6 from "./step6";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";

const NodeManager = () => {
  const { totalStakedXrds, totalXrdsLeavingOurNode, validatorAddress } = useSelector(
    (state) => state.nodeManager
  );
  const validatorDataLoading = useSelector((state) => state.loadings.validatorDataLoading);
  const isNodeOwnerView = useSelector((state) => state.app.isNodeOwnerView);

  return validatorAddress ? (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="grid grid-cols-12 w-[95vw] max-w-[650px] mb-5 gap-3">
        <div className="col-span-12 sm:col-span-6 flex items-center justify-center">
          <InfoTile
            title="Total XRD staked in this node"
            value={formatTokenAmount(+totalStakedXrds)}
            isLoading={validatorDataLoading}
            tooltip={totalStakedXrds}
          />
        </div>
        <div className="col-span-12 sm:col-span-6 flex items-center justify-center ">
          <InfoTile
            title="Total XRD leaving this node"
            value={formatTokenAmount(+totalXrdsLeavingOurNode)}
            isLoading={validatorDataLoading}
            tooltip={totalXrdsLeavingOurNode}
          />
        </div>
      </div>
      {isNodeOwnerView ? (
        <>
          <Step1 />
          <Step2 />
          <Step3 />
        </>
      ) : null}
      <Step4 />
      <Step5 />
      <Step6 />
    </div>
  ) : null;
};

export default NodeManager;
