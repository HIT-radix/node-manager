import UnlockingLSUsTable from "./unlockingTable";
import InfoTile from "Components/infoTile";
import { formatTokenAmount } from "Utils/format";
import { unlockNodeEarnedLSUs } from "Utils/txSenders";
import { StakingTokens } from "Types/reducers";
import GeneralOwnerInterface from "Components/generalOwnerInterface";
import { useSelector } from "Store";
import ClaimUnlockedBtn from "./claimUnlockedBtn";
import Step4 from "./step4";
import Step5 from "./step5";
import Step6 from "./step6";

const NodeManager = () => {
  const {
    currentlyEarnedLockedLSUs,
    ownerLSUsInUnlockingProcess,
    totalStakedXrds,
    totalXrdsLeavingOurNode,
    unlockedLSUs,
    validatorAddress,
  } = useSelector((state) => state.nodeManager);
  const validatorDataLoading = useSelector((state) => state.loadings.validatorDataLoading);
  const isOwner = useSelector((state) => state.session.isOwner);

  return validatorAddress ? (
    <div className="flex flex-col items-center justify-center mt-10">
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

      <p className="my-5 text-4xl text-secondary font-bold border-y border-secondary">STEP 1</p>
      <div className="min-w-[300px] mb-5">
        <InfoTile
          title="Earned LSUs🔒 (owner only)"
          value={formatTokenAmount(+currentlyEarnedLockedLSUs)}
          isLoading={validatorDataLoading}
          tooltip={currentlyEarnedLockedLSUs}
        />
      </div>
      <GeneralOwnerInterface
        heading="Unlock Earned LSUs"
        placeholder="Enter LSU amount to unlock"
        balance={currentlyEarnedLockedLSUs}
        onButtonClick={async (amount) => {
          await unlockNodeEarnedLSUs(amount);
        }}
        btnText="Unlock Earned LSUs"
        tokenSymbol={StakingTokens.LSU}
        isOwner={isOwner}
      />
      <p className="mb-5 text-4xl text-secondary font-bold border-y border-secondary">STEP 2</p>
      <div className="min-w-[300px] mb-5">
        <InfoTile
          title="LSUs in unlocking process (owner only)"
          value={formatTokenAmount(+ownerLSUsInUnlockingProcess)}
          isLoading={validatorDataLoading}
          tooltip={ownerLSUsInUnlockingProcess}
        />
      </div>
      <UnlockingLSUsTable />
      <p className="my-5 text-4xl text-secondary font-bold border-y border-secondary">STEP 3</p>
      <p className="text-accent text-center text-2xl font-bold">Claim Unlocked LSUs</p>
      <div className="min-w-[300px] my-4">
        <InfoTile
          title="Unlocked LSUs🔓 (owner only)"
          value={formatTokenAmount(+unlockedLSUs)}
          isLoading={validatorDataLoading}
          tooltip={unlockedLSUs}
        />
      </div>
      <ClaimUnlockedBtn />
      <Step4 />
      <Step5 />
      <Step6 />
    </div>
  ) : null;
};

export default NodeManager;
