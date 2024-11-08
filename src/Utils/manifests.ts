import {
  RUG_PROOF_STAKING_OWNER_BADGE_ADDRESS,
  HIT_RESOURCE_ADDRESS,
  NODE_LSU_ADDRESS,
  NODE_STAKING_AIRDROPPER_BADGE_ADDRESS,
  NODE_STAKING_COMPONENT_ADDRESS,
  NODE_STAKING_OWNER_BADGE_ADDRESS,
  NODE_STAKING_USER_BADGE_ADDRESS,
  NODE_VALIDATOR_ADDRESS,
  RUG_PROOF_STAKING_COMPONENT_ADDRESS,
  STHIT_RESOURCE_ADDRESS,
} from "Constants/address";
import { RewardTokenDistribution } from "Types/token";
import { formatRewardTokenDistribution } from "./format";

export const getStakeTxManifest = (walletAddress: string, amount: string) => {
  return `
    CALL_METHOD
      Address("${walletAddress}")
      "withdraw"
      Address("${HIT_RESOURCE_ADDRESS}")
      Decimal("${amount}")
    ;

    TAKE_ALL_FROM_WORKTOP
      Address("${HIT_RESOURCE_ADDRESS}")
      Bucket("tokens")
    ;

    CALL_METHOD
    	Address("${RUG_PROOF_STAKING_COMPONENT_ADDRESS}")
    	"add_stake"
    	Bucket("tokens")
    ;

    CALL_METHOD
        Address("${walletAddress}")
        "deposit_batch"
        Expression("ENTIRE_WORKTOP")
    ;
`;
};

export const getUnStakeTxManifest = (walletAddress: string, amount: string) => {
  return `
    CALL_METHOD
      Address("${walletAddress}")
      "withdraw"
      Address("${STHIT_RESOURCE_ADDRESS}")
      Decimal("${amount}")
    ;

    TAKE_ALL_FROM_WORKTOP
      Address("${STHIT_RESOURCE_ADDRESS}")
      Bucket("tokens")
    ;

    CALL_METHOD
	    Address("${RUG_PROOF_STAKING_COMPONENT_ADDRESS}")
	    "remove_stake"
	    Bucket("tokens")
    ;

    CALL_METHOD
      Address("${walletAddress}")
      "deposit_batch"
      Expression("ENTIRE_WORKTOP")
    ;
`;
};

export const getDistributeHitTxManifest = (walletAddress: string, amount: string) => {
  return `
    CALL_METHOD
      Address("${walletAddress}")
      "create_proof_of_amount"
      Address("${RUG_PROOF_STAKING_OWNER_BADGE_ADDRESS}")
      Decimal("1")
    ;

    CALL_METHOD
      Address("${walletAddress}")
      "withdraw"
      Address("${HIT_RESOURCE_ADDRESS}")
      Decimal("${amount}")
    ;

    TAKE_ALL_FROM_WORKTOP
      Address("${HIT_RESOURCE_ADDRESS}")
      Bucket("bucket1")
    ;

    CALL_METHOD
      Address("${RUG_PROOF_STAKING_COMPONENT_ADDRESS}")
      "airdrop"
      Bucket("bucket1")
    ;
`;
};

export const getLockTxManifest = (walletAddress: string, amount: string) => {
  return `
    CALL_METHOD
      Address("${walletAddress}")
      "create_proof_of_amount"
      Address("${RUG_PROOF_STAKING_OWNER_BADGE_ADDRESS}")
      Decimal("1")
    ;

    CALL_METHOD
      Address("${walletAddress}")
      "withdraw"
      Address("${HIT_RESOURCE_ADDRESS}")
      Decimal("${amount}")
    ;

    TAKE_ALL_FROM_WORKTOP
      Address("${HIT_RESOURCE_ADDRESS}")
      Bucket("bucket1")
    ;

    CALL_METHOD
      Address("${RUG_PROOF_STAKING_COMPONENT_ADDRESS}")
      "deposit_rewards"
      Bucket("bucket1")
    ;
`;
};

export const getDistributeLockHitTxManifest = (walletAddress: string, amount: string) => {
  return `
    CALL_METHOD
      Address("${walletAddress}")
      "create_proof_of_amount"
      Address("${RUG_PROOF_STAKING_OWNER_BADGE_ADDRESS}")
      Decimal("1")
    ;

    CALL_METHOD
      Address("${RUG_PROOF_STAKING_COMPONENT_ADDRESS}")
      "airdrop_deposited_amount"
      Decimal("${amount}")
    ;
`;
};

export const getMintNodeStakingRewardsNFTbadgeManifest = (walletAddress: string) => {
  return `
    CALL_METHOD
      Address("${NODE_STAKING_COMPONENT_ADDRESS}")
      "mint_user_nft"
    ;
    CALL_METHOD
      Address("${walletAddress}")
      "deposit_batch"
      Expression("ENTIRE_WORKTOP")
    ;
`;
};

export const getDepositNodeStakingRewardsManifest = (
  walletAddress: string,
  amount: string,
  rewardTokenAddress: string
) => {
  return `
    CALL_METHOD
      Address("${walletAddress}")
      "create_proof_of_amount"
      Address("${NODE_STAKING_OWNER_BADGE_ADDRESS}")
      Decimal("1")
    ;
    CALL_METHOD
      Address("${walletAddress}")
      "withdraw"
      Address("${rewardTokenAddress}")
      Decimal("${amount}")
    ;
    TAKE_ALL_FROM_WORKTOP
      Address("${rewardTokenAddress}")
      Bucket("rewards")
    ;
    CALL_METHOD
      Address("${NODE_STAKING_COMPONENT_ADDRESS}")
      "deposit_future_rewards"
      Bucket("rewards")
    ;
`;
};

export const getAssignNodeStakingRewardsManifest = (
  walletAddress: string,
  rewardTokenDistributions: RewardTokenDistribution[],
  rewardTokenAddress: string
) => {
  return `
    CALL_METHOD
      Address("${walletAddress}")
      "create_proof_of_amount"
      Address("${NODE_STAKING_AIRDROPPER_BADGE_ADDRESS}")
      Decimal("1")
    ;
    CALL_METHOD
      Address("${NODE_STAKING_COMPONENT_ADDRESS}")
      "assign_rewards"
      Map<U64, Decimal>(${formatRewardTokenDistribution(rewardTokenDistributions)})
      Address("${rewardTokenAddress}")
    ;
`;
};

export const getWithdrawNodeStakingRewardsManifest = (
  walletAddress: string,
  userNftBadgeId: number
) => {
  return `
    CALL_METHOD
      Address("${walletAddress}")
      "create_proof_of_non_fungibles"
      Address("${NODE_STAKING_USER_BADGE_ADDRESS}")
      Array<NonFungibleLocalId>(NonFungibleLocalId("#${userNftBadgeId}#"))
    ;
    POP_FROM_AUTH_ZONE
      Proof("proof")
    ;
    CALL_METHOD
      Address("${NODE_STAKING_COMPONENT_ADDRESS}")
      "withdraw_rewards"
      Proof("proof")
    ;
    CALL_METHOD
      Address("${walletAddress}")
      "deposit_batch"
      Expression("ENTIRE_WORKTOP")
    ;
`;
};

export const getStakeInNodeValidatorManifest = (walletAddress: string, amount: string) => {
  return `
    CALL_METHOD
      Address("${walletAddress}")
      "withdraw"
      Address("resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd")
      Decimal("${amount}")
    ;
    TAKE_ALL_FROM_WORKTOP
      Address("resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd")
      Bucket("bucket1")
    ;
    CALL_METHOD
      Address("${NODE_VALIDATOR_ADDRESS}")
      "stake"
      Bucket("bucket1")
    ;
    TAKE_ALL_FROM_WORKTOP
      Address("${NODE_LSU_ADDRESS}")
      Bucket("bucketLSU")
    ;
    CALL_METHOD
      Address("${walletAddress}")
      "deposit"
      Bucket("bucketLSU")
    ;
`;
};

export const getWithdrawNodeStakingRewardAndStakeHITManifest = (
  walletAddress: string,
  userNftBadgeId: number
) => {
  return `
    CALL_METHOD
      Address("${walletAddress}")
      "create_proof_of_non_fungibles"
      Address("${NODE_STAKING_USER_BADGE_ADDRESS}")
      Array<NonFungibleLocalId>(NonFungibleLocalId("#${userNftBadgeId}#"))
    ;
    POP_FROM_AUTH_ZONE
      Proof("proof1")
    ;
    CALL_METHOD
      Address("${NODE_STAKING_COMPONENT_ADDRESS}")
      "withdraw_rewards"
      Proof("proof1")
    ;
    TAKE_ALL_FROM_WORKTOP
      Address("${HIT_RESOURCE_ADDRESS}")
      Bucket("bucket1")
    ;
    CALL_METHOD
      Address("${RUG_PROOF_STAKING_COMPONENT_ADDRESS}")
      "add_stake"
      Bucket("bucket1")
    ;
    CALL_METHOD
      Address("${walletAddress}")
      "deposit_batch"
      Expression("ENTIRE_WORKTOP")
    ;
`;
};

export const getUnlockEarnedLSUManifest = (walletAddress: string, amount: string) => {
  return `
    CALL_METHOD 
      Address("${walletAddress}") 
      "create_proof_of_non_fungibles" 
      Address("resource_rdx1nfxxxxxxxxxxvdrwnrxxxxxxxxx004365253834xxxxxxxxxvdrwnr") 
      Array<NonFungibleLocalId>( 
        NonFungibleLocalId("[83b22a601b755ba5fe0fde3edcde69b84c8cbf60f637320672115e5e8400]") 
      )
    ; 
    CALL_METHOD 
      Address("${NODE_VALIDATOR_ADDRESS}") 
      "start_unlock_owner_stake_units" 
      Decimal("${amount}")
    ;
  `;
};

export const getFinishUnlockLSUProcessManifest = (walletAddress: string) => {
  return `
    CALL_METHOD 
      Address("${walletAddress}") 
      "create_proof_of_non_fungibles" 
      Address("resource_rdx1nfxxxxxxxxxxvdrwnrxxxxxxxxx004365253834xxxxxxxxxvdrwnr") 
      Array<NonFungibleLocalId>( 
        NonFungibleLocalId("[83b22a601b755ba5fe0fde3edcde69b84c8cbf60f637320672115e5e8400]") 
      )
    ; 
    CALL_METHOD 
      Address("${NODE_VALIDATOR_ADDRESS}") 
      "finish_unlock_owner_stake_units"
    ;
    CALL_METHOD
      Address("${walletAddress}")
      "deposit_batch"
      Expression("ENTIRE_WORKTOP")
    ;
  `;
};
