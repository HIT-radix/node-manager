import GeneralOwnerInterface from "Components/generalOwnerInterface";
import InfoTile from "Components/infoTile";
import { useSelector } from "Store";
import { StakingTokens } from "Types/reducers";
import { formatTokenAmount } from "Utils/format";
import { unlockNodeEarnedLSUs } from "Utils/txSenders";

const Step1 = () => {
  const currentlyEarnedLockedLSUs = useSelector(
    (state) => state.nodeManager.currentlyEarnedLockedLSUs
  );
  const validatorDataLoading = useSelector((state) => state.loadings.validatorDataLoading);
  const isOwner = useSelector((state) => state.session.isOwner);
  const isNodeOwnerView = useSelector((state) => state.app.isNodeOwnerView);
  const metadata = useSelector((state) => state.nodeManager.metadata);
  return (
    <div
      className={"collapse text-accent bg-base-200 border border-accent "
        .concat(isOwner ? "collapse-arrow " : "collapse-close ")
        .concat(isNodeOwnerView ? "border-secondary " : "border-accent ")}
    >
      <input type="checkbox" />
      <div className="collapse-title ">
        <p
          className={"font-medium text-xl mb-2 ".concat(
            isNodeOwnerView ? "text-secondary " : "text-accent "
          )}
        >
          Step 1: Unlock Earned LSUs
        </p>
        <div className="min-w-[300px] text-primary">
          <InfoTile
            title="Earned LSUs🔒 (owner only)"
            value={formatTokenAmount(+currentlyEarnedLockedLSUs)}
            isLoading={validatorDataLoading}
            tooltip={currentlyEarnedLockedLSUs}
            isGreenish={isNodeOwnerView}
          />
        </div>
      </div>
      <div className="collapse-content flex items-center justify-center">
        <GeneralOwnerInterface
          heading=""
          placeholder="Enter LSU amount to unlock"
          balance={currentlyEarnedLockedLSUs}
          onButtonClick={async (amount) => {
            await unlockNodeEarnedLSUs(amount, metadata.owner_badge);
          }}
          btnText="Unlock Earned LSUs"
          tokenSymbol={StakingTokens.LSU}
          isOwner={isOwner}
        />
      </div>
    </div>
  );
};

export default Step1;
