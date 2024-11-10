import GeneralOwnerInterface from "Components/generalOwnerInterface";
import InfoTile from "Components/infoTile";
import { useMemo } from "react";
import { useSelector } from "Store";
import { StakingTokens } from "Types/reducers";
import { formatTokenAmount } from "Utils/format";
import { unstakeFromNodeValidator } from "Utils/txSenders";

const Step4 = () => {
  const { metadata, stakeUnitAddress, validatorAddress } = useSelector(
    (state) => state.nodeManager
  );
  const fungiblesBalances = useSelector((state) => state.session.userBalances.fungible);
  const balanceLoading = useSelector((state) => state.loadings.balanceLoading);

  const userLSUBalance = useMemo(() => {
    let balance = "0";
    if (fungiblesBalances[stakeUnitAddress]) {
      balance = fungiblesBalances[stakeUnitAddress].amount;
    }
    return balance;
  }, [fungiblesBalances, stakeUnitAddress]);

  const handleUnstake = async (amount: string) => {
    if ("claim_nft" in metadata && stakeUnitAddress && validatorAddress) {
      await unstakeFromNodeValidator(
        metadata.claim_nft,
        stakeUnitAddress,
        validatorAddress,
        amount
      );
    }
  };
  return (
    <>
      <p className="my-5 text-4xl text-secondary font-bold border-y border-secondary">STEP 4</p>
      <p className="text-accent text-center text-2xl font-bold">Unstake from this Node</p>
      <div className="min-w-[300px] my-4">
        <InfoTile
          title="Your LSU balance of this node"
          value={formatTokenAmount(+userLSUBalance)}
          isLoading={balanceLoading}
          tooltip={userLSUBalance}
        />
      </div>
      <GeneralOwnerInterface
        heading=""
        placeholder="Enter LSU amount to unstake"
        balance={userLSUBalance}
        onButtonClick={(amount) => handleUnstake(amount)}
        btnText="Unlock Earned LSUs"
        tokenSymbol={StakingTokens.LSU}
        isOwner={true}
      />
    </>
  );
};

export default Step4;
