import UnlockingLSUsTable from "./unlockingTable";
import InfoTile from "Components/infoTile";
import { formatTokenAmount } from "Utils/format";
import { finishNodeLSUnlockProcess, unlockNodeEarnedLSUs } from "Utils/txSenders";
import { StakingTokens } from "Types/reducers";
import GeneralOwnerInterface from "Components/generalOwnerInterface";
import { useSelector } from "Store";

const NodeManager = () => {
  const {
    currentlyEarnedLockedLSUs,
    epoch,
    ownerLSUsInUnlockingProcess,
    totalStakedXrds,
    totalXrdsLeavingOurNode,
    unlockingLSUsBreakdown,
    unlockedLSUs,
  } = useSelector((state) => state.nodeManager);
  const validatorDataLoading = useSelector((state) => state.loadings.validatorDataLoading);

  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <div className="grid grid-cols-12 w-[95vw] max-w-[650px] mb-5 gap-3">
        <div className="col-span-12 sm:col-span-6 flex items-center justify-center">
          <InfoTile
            title="Total XRD staked in node"
            value={formatTokenAmount(+totalStakedXrds)}
            isLoading={validatorDataLoading}
            tooltip={totalStakedXrds}
          />
        </div>
        <div className="col-span-12 sm:col-span-6 flex items-center justify-center ">
          <InfoTile
            title="Total XRD leaving our node"
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
      <UnlockingLSUsTable unlockingLSUsBreakdown={unlockingLSUsBreakdown} currentEpoch={epoch} />
      <p className="my-5 text-4xl text-secondary font-bold border-y border-secondary">STEP 3</p>
      <div className="min-w-[300px] mb-5">
        <InfoTile
          title="Unlocked LSUs🔓 (owner only)"
          value={formatTokenAmount(+unlockedLSUs)}
          isLoading={validatorDataLoading}
          tooltip={unlockedLSUs}
        />
      </div>
      <div
        onClick={async () => {
          if (Number(unlockedLSUs) > 0) {
            await finishNodeLSUnlockProcess(unlockedLSUs);
          }
        }}
        className={`btn btn-accent px-20 ${
          Number(unlockedLSUs) > 0 ? "cursor-pointer opacity-100" : "cursor-not-allowed opacity-30"
        }`}
      >
        Claim Unlocked LSUs
      </div>
    </div>
  );
};

export default NodeManager;
