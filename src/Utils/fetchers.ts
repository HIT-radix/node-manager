import { dispatch, store } from "Store";
import {
  setUnstakeClaimNFTsData,
  setUserBalances,
  setUserValidatorList,
  setValidatorInfoFound,
  setValidatorsList,
} from "Store/Reducers/session";
import { FungibleBalances, NonFungibleBalances, SessionReducer } from "Types/reducers";
import { chunkArray, computeValidatorFeeFactor, formatTokenAmount } from "./format";
import {
  FeeFactor,
  NewFeeFactor,
  UnlockingRewards,
  ValidatorItem,
  UnstakeClaimNFTDATA,
  RecentStakingTx,
} from "Types/api";
import {
  setValidatorDataLoading,
  setBalanceLoading,
  setValidatorsListLoading,
  setUnstakeClaimNFtsDataLoading,
} from "Store/Reducers/loadings";
import CachedService from "Classes/cachedService";
import { clearValidatorInfo, setValidatorInfo } from "Store/Reducers/nodeManager";
import {
  EntityMetadataCollection,
  FungibleResourcesCollectionItem,
  NonFungibleResourcesCollectionItem,
  StateEntityFungiblesPageResponse,
  StateEntityNonFungiblesPageResponse,
} from "@radixdlt/babylon-gateway-api-sdk";
import Decimal from "decimal.js";
import { StakeType } from "Types/enum";

export const fetchBalances = async (walletAddress: string) => {
  const fungibleBalance: FungibleBalances = {};
  const nonFungibleBalance: NonFungibleBalances = {};

  if (walletAddress) {
    try {
      dispatch(setBalanceLoading(true));
      const allFungibleItems = await fetchAllFungibles(walletAddress);
      const allNonFungibleItems = await fetchAllNonFungibles(walletAddress);

      allFungibleItems.forEach((fungItem) => {
        if (fungItem.aggregation_level === "Global") {
          fungibleBalance[fungItem.resource_address] = {
            tokenAddress: fungItem.resource_address,
            amount: fungItem.amount,
          };
        }
      });

      allNonFungibleItems.forEach((nonFungItem) => {
        if (nonFungItem.aggregation_level === "Vault") {
          const ids = nonFungItem.vaults.items[0].items;
          if (ids) {
            nonFungibleBalance[nonFungItem.resource_address] = {
              collectionAddress: nonFungItem.resource_address,
              ids,
            };
          }
        }
      });
    } catch (error) {
      console.log("error in fetchBalances", error);
    }
  }
  dispatch(
    setUserBalances({
      fungible: fungibleBalance,
      nonFungible: nonFungibleBalance,
    })
  );
  dispatch(setBalanceLoading(false));
};

const fetchAllFungibles = async (walletAddress: string) => {
  let allFungibleItems: FungibleResourcesCollectionItem[] = [];
  let nextCursor = undefined;
  let response: StateEntityFungiblesPageResponse;
  let state_version: number | undefined = undefined;
  do {
    response = await CachedService.gatewayApi.state.innerClient.entityFungiblesPage({
      stateEntityFungiblesPageRequest: {
        address: walletAddress,
        cursor: nextCursor,
        aggregation_level: "Global",
        at_ledger_state: state_version ? { state_version } : undefined,
      },
    });

    allFungibleItems = allFungibleItems.concat(response.items);
    nextCursor = response.next_cursor;
    state_version = response.ledger_state.state_version;
  } while (nextCursor);
  return allFungibleItems;
};

const fetchAllNonFungibles = async (walletAddress: string) => {
  let allNonFungibleItems: NonFungibleResourcesCollectionItem[] = [];
  let nextCursor = undefined;
  let response: StateEntityNonFungiblesPageResponse;
  let state_version: number | undefined = undefined;
  do {
    response = await CachedService.gatewayApi.state.innerClient.entityNonFungiblesPage({
      stateEntityNonFungiblesPageRequest: {
        address: walletAddress,
        cursor: nextCursor,
        aggregation_level: "Vault",
        opt_ins: { non_fungible_include_nfids: true },
        at_ledger_state: state_version ? { state_version } : undefined,
      },
    });
    allNonFungibleItems = allNonFungibleItems.concat(response.items);
    nextCursor = response.next_cursor;
    state_version = response.ledger_state.state_version;
  } while (nextCursor);
  return allNonFungibleItems;
};

const extractMetadata = (metadata: EntityMetadataCollection) => {
  const extractedMetadata: Record<string, string> = {};
  metadata.items.forEach((item) => {
    const valueType = item.value.typed.type;
    if (
      valueType === "String" ||
      valueType === "Url" ||
      valueType === "GlobalAddress" ||
      valueType === "NonFungibleLocalId"
    ) {
      extractedMetadata[item.key] = item.value.typed.value;
    }
  });
  return extractedMetadata;
};

const extractVaultsAdresses = (state: object) => {
  let NODE_CURRENTLY_EARNED_LSU_VAULT_ADDRESS = "";
  let NODE_OWNER_UNLOCKING_LSU_VAULT_ADDRESS = "";
  let NODE_TOTAL_STAKED_XRD_VAULT_ADDRESS = "";
  let NODE_UNSTAKING_XRD_VAULT_ADDRESS = "";
  if ("stake_xrd_vault" in state) {
    NODE_TOTAL_STAKED_XRD_VAULT_ADDRESS = (state.stake_xrd_vault as { entity_address: string })
      .entity_address as string;
  }
  if ("pending_xrd_withdraw_vault" in state) {
    NODE_UNSTAKING_XRD_VAULT_ADDRESS = (
      state.pending_xrd_withdraw_vault as { entity_address: string }
    ).entity_address as string;
  }
  if ("locked_owner_stake_unit_vault" in state) {
    NODE_CURRENTLY_EARNED_LSU_VAULT_ADDRESS = (
      state.locked_owner_stake_unit_vault as { entity_address: string }
    ).entity_address as string;
  }
  if ("pending_owner_stake_unit_unlock_vault" in state) {
    NODE_OWNER_UNLOCKING_LSU_VAULT_ADDRESS = (
      state.pending_owner_stake_unit_unlock_vault as { entity_address: string }
    ).entity_address as string;
  }
  return {
    NODE_CURRENTLY_EARNED_LSU_VAULT_ADDRESS,
    NODE_OWNER_UNLOCKING_LSU_VAULT_ADDRESS,
    NODE_TOTAL_STAKED_XRD_VAULT_ADDRESS,
    NODE_UNSTAKING_XRD_VAULT_ADDRESS,
  };
};

const filterPendingWithdrawlsFromUnlockedLSUs = (
  pendingWithdrawls: UnlockingRewards,
  currentEpoch: number
) => {
  let unlockedLSUsAmount = new Decimal(0);
  let lsuInUnlockingProcess = new Decimal(0);
  const filteredWithdrawls = pendingWithdrawls.filter((withdrawl) => {
    const isUnlocked = withdrawl.epoch_unlocked <= currentEpoch;
    if (isUnlocked) {
      unlockedLSUsAmount = unlockedLSUsAmount.add(withdrawl.stake_unit_amount);
    } else {
      lsuInUnlockingProcess = lsuInUnlockingProcess.add(withdrawl.stake_unit_amount);
    }
    return !isUnlocked;
  });

  return { filteredWithdrawls, unlockedLSUsAmount, lsuInUnlockingProcess };
};

export const fetchValidatorInfo = async (validatorAddress: string) => {
  if (validatorAddress === "" || !validatorAddress.startsWith("validator_")) {
    dispatch(clearValidatorInfo());
    return;
  }

  try {
    store.dispatch(setValidatorDataLoading(true));

    const res = await CachedService.gatewayApi.state.innerClient.stateEntityDetails({
      stateEntityDetailsRequest: { addresses: [validatorAddress], aggregation_level: "Vault" },
    });
    const validatorInfo = res.items[0];
    const vaultsBalance: Record<string, string> = {};
    let rewardsInUnlockingProcess: UnlockingRewards = [];
    const epoch = res.ledger_state.epoch;
    let unlockedLSUs = new Decimal(0);
    let ownerLSUsInUnlockingProcess = new Decimal(0);
    let stakeUnitAddress = "";
    let fees: FeeFactor = { alert: "", current: "", aboutToChange: null };

    if (validatorInfo?.details?.type === "Component" && validatorInfo?.details?.state) {
      const metadata = extractMetadata(res.items[0].metadata);
      const validatorState = validatorInfo?.details?.state;
      const {
        NODE_CURRENTLY_EARNED_LSU_VAULT_ADDRESS,
        NODE_OWNER_UNLOCKING_LSU_VAULT_ADDRESS,
        NODE_TOTAL_STAKED_XRD_VAULT_ADDRESS,
        NODE_UNSTAKING_XRD_VAULT_ADDRESS,
      } = extractVaultsAdresses(validatorState);

      validatorInfo?.fungible_resources?.items.forEach((resource) => {
        if (resource.aggregation_level === "Vault") {
          resource.vaults.items.forEach((vault) => {
            vaultsBalance[vault.vault_address] = vault.amount;
          });
        }
      });

      if ("pending_owner_stake_unit_withdrawals" in validatorState) {
        const { filteredWithdrawls, unlockedLSUsAmount, lsuInUnlockingProcess } =
          filterPendingWithdrawlsFromUnlockedLSUs(
            validatorState.pending_owner_stake_unit_withdrawals as UnlockingRewards,
            epoch
          );
        rewardsInUnlockingProcess = filteredWithdrawls;
        unlockedLSUs = unlockedLSUs.add(unlockedLSUsAmount);
        ownerLSUsInUnlockingProcess = ownerLSUsInUnlockingProcess.add(lsuInUnlockingProcess);
      }
      if ("already_unlocked_owner_stake_unit_amount" in validatorState) {
        unlockedLSUs = unlockedLSUs.add(
          validatorState.already_unlocked_owner_stake_unit_amount as string
        );
      }
      if ("stake_unit_resource_address" in validatorState) {
        stakeUnitAddress = validatorState.stake_unit_resource_address as string;
      }
      if (
        "validator_fee_factor" in validatorState &&
        "validator_fee_change_request" in validatorState
      ) {
        fees = computeValidatorFeeFactor(
          validatorState.validator_fee_factor as string,
          validatorState.validator_fee_change_request as NewFeeFactor,
          epoch
        );
      }

      const info = {
        currentlyEarnedLockedLSUs: vaultsBalance[NODE_CURRENTLY_EARNED_LSU_VAULT_ADDRESS] || "0",
        ownerLSUsInUnlockingProcess: ownerLSUsInUnlockingProcess.toString(),
        totalStakedXrds: vaultsBalance[NODE_TOTAL_STAKED_XRD_VAULT_ADDRESS] || "0",
        totalXrdsLeavingOurNode: vaultsBalance[NODE_UNSTAKING_XRD_VAULT_ADDRESS] || "0",
        unlockingLSUsBreakdown: rewardsInUnlockingProcess,
        epoch,
        unlockedLSUs: unlockedLSUs.toString(),
        metadata,
        stakeUnitAddress,
        vaults: {
          NODE_CURRENTLY_EARNED_LSU_VAULT_ADDRESS,
          NODE_OWNER_UNLOCKING_LSU_VAULT_ADDRESS,
          NODE_TOTAL_STAKED_XRD_VAULT_ADDRESS,
          NODE_UNSTAKING_XRD_VAULT_ADDRESS,
        },
        validatorAddress,
        fees,
      };

      store.dispatch(setValidatorInfo(info));
      dispatch(setValidatorInfoFound(true));
      store.dispatch(setValidatorDataLoading(false));

      return info;
    } else {
      dispatch(setValidatorInfoFound(false));
      dispatch(clearValidatorInfo());
    }
  } catch (error) {
    console.log("error in fetchValidatorInfo", error);
    dispatch(setValidatorInfoFound(false));
    dispatch(clearValidatorInfo());
  }
  store.dispatch(setValidatorDataLoading(false));
  return undefined;
};

export const fetchUnstakeCLaimNFTData = async (claimNFTAddress: string, nftIds: string[]) => {
  dispatch(setUnstakeClaimNFtsDataLoading(true));
  const nftIdsChunks = chunkArray<string>(nftIds, 100);
  const chunkPromises = nftIdsChunks.map((nftIdsChunk) =>
    CachedService.gatewayApi.state.getNonFungibleData(claimNFTAddress, nftIdsChunk)
  );

  const chunkData = (await Promise.all(chunkPromises)).flat();

  const unstakeClaimNFTsData: UnstakeClaimNFTDATA = {};

  chunkData.forEach((nftData) => {
    const programmatic_json = nftData.data?.programmatic_json;
    if (programmatic_json?.kind === "Tuple") {
      const nftEntry = unstakeClaimNFTsData[nftData.non_fungible_id] || {};
      nftEntry.nftId = nftData.non_fungible_id;
      programmatic_json.fields.forEach((field) => {
        if (field.kind === "Decimal" && field.field_name === "claim_amount") {
          nftEntry.claim_amount = field.value;
        } else if (field.kind === "U64" && field.field_name === "claim_epoch") {
          nftEntry.claim_epoch = field.value;
        }
      });
      unstakeClaimNFTsData[nftData.non_fungible_id] = nftEntry;
    }
  });

  dispatch(setUnstakeClaimNFTsData(unstakeClaimNFTsData));
  dispatch(setUnstakeClaimNFtsDataLoading(false));
};

export const fetchTopValidators = async () => {
  try {
    store.dispatch(setValidatorsListLoading(true));

    const res = await CachedService.gatewayApi.state.innerClient.stateValidatorsList({
      stateValidatorsListRequest: {},
    });

    const epoch = res.ledger_state.epoch;

    const validatorsList = res.validators.items
      .filter((validator) =>
        validator.state && "is_registered" in validator.state
          ? validator.state.is_registered
          : false
      )
      .sort(
        (a, b) => parseInt(b.stake_vault?.balance || "0") - parseInt(a.stake_vault?.balance || "0")
      )
      .slice(0, 100)
      .map((validator, index) => {
        const {
          address,
          stake_vault,
          pending_xrd_withdraw_vault,
          locked_owner_stake_unit_vault,
          metadata,
        } = validator;
        const stakeVaultBalance = formatTokenAmount(parseInt(stake_vault?.balance || "0"));
        const pendingXrdWithdrawBalance = formatTokenAmount(
          parseInt(pending_xrd_withdraw_vault?.balance || "0")
        );
        const lockedOwnerStakeUnitVaultBalance = formatTokenAmount(
          parseInt(locked_owner_stake_unit_vault?.balance || "0")
        );

        const {
          name,
          icon_url: icon = "",
          claim_nft = "",
          pool_unit = "",
          owner_badge = "",
        } = extractMetadata(metadata);

        return {
          position: index + 1,
          name,
          icon,
          address,
          stakeVaultBalance,
          pendingXrdWithdrawBalance,
          lockedOwnerStakeUnitVaultBalance,
          claim_nft,
          pool_unit,
          owner_badge,
          fee: computeValidatorFeeFactor(
            (validator.state as any).validator_fee_factor as string,
            (validator.state as any).validator_fee_change_request as NewFeeFactor,
            epoch
          ),
        };
      });

    store.dispatch(setValidatorsList(validatorsList));
  } catch (error) {
    console.log("error in fetchingTopValidators", error);
  } finally {
    store.dispatch(setValidatorsListLoading(false));
  }
};

export const filterUserRelatedNodes = (
  validatorsList: ValidatorItem[],
  userBalances: SessionReducer["userBalances"]
) => {
  const filteredValidators = validatorsList.filter((validator) => {
    const userHasPoolUnits =
      userBalances.fungible[validator.pool_unit] &&
      +userBalances.fungible[validator.pool_unit].amount > 0;

    const userIsOwner =
      userBalances.nonFungible[validator.owner_badge] &&
      userBalances.nonFungible[validator.owner_badge].ids.includes(validator.owner_badge);
    const userHasClaimNfts =
      userBalances.nonFungible[validator.claim_nft] &&
      userBalances.nonFungible[validator.claim_nft].ids.length > 0;
    return userHasPoolUnits || userIsOwner || userHasClaimNfts;
  });
  dispatch(setUserValidatorList(filteredValidators));
};

export const fetchRecentNodeTx_Base = async (
  validatorAddress: string,
  entityAddress: string,
  stakeType: StakeType
) => {
  const manifestClass = stakeType === StakeType.Stake ? "ValidatorStake" : "ValidatorClaim";
  const eventType = stakeType === StakeType.Stake ? "StakeEvent" : "ClaimXrdEvent";

  const result = await CachedService.gatewayApi.stream.innerClient.streamTransactions({
    streamTransactionsRequest: {
      limit_per_page: 25,
      opt_ins: { detailed_events: true },
      manifest_class_filter: { _class: manifestClass },
      affected_global_entities_filter: [validatorAddress, entityAddress],
    },
  });

  let recentTxDetails: RecentStakingTx[] = [];

  result.items.forEach((tx) => {
    let accountAddress = "";
    let amount = "";

    if (tx.receipt?.detailed_events) {
      for (const event of tx.receipt.detailed_events) {
        if (event.identifier.event === "LockFeeEvent") {
          accountAddress =
            event.emitter.type === "EntityMethod" ? event.emitter.global_emitter : "";
        }

        if (
          event.identifier.event === eventType &&
          event.emitter.type === "EntityMethod" &&
          event.emitter.global_emitter === validatorAddress
        ) {
          amount = (event.payload.programmatic_json as { fields: { value: string }[] }).fields[0]
            .value;
        }

        if (accountAddress !== "" && amount !== "") {
          break;
        }
      }

      if (accountAddress !== "" && amount !== "") {
        recentTxDetails.push({
          date: tx.confirmed_at,
          account: accountAddress,
          amount,
          type: stakeType,
          txId: tx.intent_hash ?? "",
        });
      }
    }
  });

  return recentTxDetails;
};

export const fetchRecentNodeTxs = async (
  validatorAddress: string,
  nodeLSUaddress: string,
  claimNftAddress: string
) => {
  const stakeTxs = await fetchRecentNodeTx_Base(validatorAddress, nodeLSUaddress, StakeType.Stake);
  const unstakeTxs = await fetchRecentNodeTx_Base(
    validatorAddress,
    claimNftAddress,
    StakeType.Unstake
  );

  const allTxs = [...stakeTxs, ...unstakeTxs].sort(
    (a, b) => new Date(b?.date || 0).getTime() - new Date(a?.date || 0).getTime()
  );

  return allTxs;
};
