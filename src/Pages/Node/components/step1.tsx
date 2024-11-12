import GeneralOwnerInterface from "Components/generalOwnerInterface";
import InfoTile from "Components/infoTile";
import { useSelector } from "Store";
import { StakingTokens } from "Types/reducers";
import { formatTokenAmount } from "Utils/format";
import { unlockNodeEarnedLSUs } from "Utils/txSenders";

const Step1 = () => {
  const { currentlyEarnedLockedLSUs } = useSelector((state) => state.nodeManager);
  const validatorDataLoading = useSelector((state) => state.loadings.validatorDataLoading);
  const isOwner = useSelector((state) => state.session.isOwner);
  return (
    <div
      className={"collapse collapse-arrow text-accent bg-base-200 ".concat(
        isOwner ? "" : "collapse-close"
      )}
    >
      <input type="checkbox" />
      <div className="collapse-title ">
        <p className="text-accent font-medium text-xl mb-2">Step1: Unlock Earned LSUs</p>
        <div className="min-w-[300px] mb-5 text-primary">
          <InfoTile
            title="Earned LSUs🔒 (owner only)"
            value={formatTokenAmount(+currentlyEarnedLockedLSUs)}
            isLoading={validatorDataLoading}
            tooltip={currentlyEarnedLockedLSUs}
          />
        </div>
      </div>
      <div className="collapse-content">
        <GeneralOwnerInterface
          heading=""
          placeholder="Enter LSU amount to unlock"
          balance={currentlyEarnedLockedLSUs}
          onButtonClick={async (amount) => {
            await unlockNodeEarnedLSUs(amount);
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
