import CachedService from "Classes/cachedService";
import { generateRandomNonce } from "@radixdlt/radix-engine-toolkit";
import { NODE_LSU_ADDRESS, NODE_VALIDATOR_ADDRESS } from "Constants/address";

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

export const getUnlockEarnedLSUManifest = (
  walletAddress: string,
  amount: string,
  ownerBadgeId: string,
  validatorAddress: string
) => {
  return `
    CALL_METHOD 
      Address("${walletAddress}") 
      "create_proof_of_non_fungibles" 
      Address("resource_rdx1nfxxxxxxxxxxvdrwnrxxxxxxxxx004365253834xxxxxxxxxvdrwnr") 
      Array<NonFungibleLocalId>( 
        NonFungibleLocalId("${ownerBadgeId}") 
      )
    ; 
    CALL_METHOD 
      Address("${validatorAddress}") 
      "start_unlock_owner_stake_units" 
      Decimal("${amount}")
    ;
  `;
};

export const getFinishUnlockLSUProcessManifest = (
  walletAddress: string,
  ownerBadgeId: string,
  validatorAddress: string
) => {
  return `
    CALL_METHOD 
      Address("${walletAddress}") 
      "create_proof_of_non_fungibles" 
      Address("resource_rdx1nfxxxxxxxxxxvdrwnrxxxxxxxxx004365253834xxxxxxxxxvdrwnr") 
      Array<NonFungibleLocalId>( 
        NonFungibleLocalId("${ownerBadgeId}") 
      )
    ; 
    CALL_METHOD 
      Address("${validatorAddress}") 
      "finish_unlock_owner_stake_units"
    ;
    CALL_METHOD
      Address("${walletAddress}")
      "deposit_batch"
      Expression("ENTIRE_WORKTOP")
    ;
  `;
};

export const getStartUnstakeFromValidatorManifest = (
  walletAddress: string,
  amount: string,
  validatorAddress: string,
  LSUAddress: string,
  claimNFTaddress: string
) => {
  return `
    CALL_METHOD
      Address("${walletAddress}")
      "withdraw"
      Address("${LSUAddress}")
      Decimal("${amount}")
    ;
    TAKE_ALL_FROM_WORKTOP
      Address("${LSUAddress}")
      Bucket("bucket1")
    ;
    CALL_METHOD
      Address("${validatorAddress}")
      "unstake"
      Bucket("bucket1")
    ;
    TAKE_ALL_FROM_WORKTOP
      Address("${claimNFTaddress}")
      Bucket("bucket2")
    ;
    CALL_METHOD
      Address("${walletAddress}")
      "deposit"
      Bucket("bucket2")
    ;
  `;
};

export const getWithdrawFromNodeManifest = (
  walletAddress: string,
  claimNFTaddress: string,
  claimNftId: string,
  validatorAddress: string
) => {
  return `
    CALL_METHOD
      Address("${walletAddress}")
      "withdraw_non_fungibles"
      Address("${claimNFTaddress}")
      Array<NonFungibleLocalId>(
        NonFungibleLocalId("${claimNftId}")
      )
    ;

    TAKE_ALL_FROM_WORKTOP
      Address("${claimNFTaddress}")
      Bucket("bucket1")
    ;

    CALL_METHOD
      Address("${validatorAddress}")
      "claim_xrd"
      Bucket("bucket1")
    ;

    CALL_METHOD
      Address("${walletAddress}")
      "deposit_batch"
      Expression("ENTIRE_WORKTOP")
    ;
  `;
};

export const simulateTx = async (manifest: string) => {
  const latestLedgerState =
    await CachedService.gatewayApi.transaction.innerClient.transactionConstruction();

  const nonce = generateRandomNonce();

  const preview = await CachedService.gatewayApi.transaction.innerClient.transactionPreview({
    transactionPreviewRequest: {
      manifest,
      nonce,
      tip_percentage: 0,
      flags: {
        use_free_credit: true,
        assume_all_signature_proofs: true,
        skip_epoch_check: true,
      },
      start_epoch_inclusive: latestLedgerState.ledger_state.epoch,
      end_epoch_exclusive: latestLedgerState.ledger_state.epoch + 1,
      signer_public_keys: [],
    },
  });
  console.log("preview", preview);
  return preview;
};
