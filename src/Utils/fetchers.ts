import axios, { AxiosResponse } from "axios";

import { Ociswap_baseurl, networkRPC } from "Constants/endpoints";
import { dispatch, store } from "Store";
import { setHitFomoPrices } from "Store/Reducers/app";
import {
  setUnstakeClaimNFTsData,
  setUserBalances,
  setValidatorInfoFound,
  setValidatorsList,
  updateHitFomoData,
} from "Store/Reducers/session";
import {
  setLockedHITRewards,
  setLockedNodeStakingFomos,
  setLockedNodeStakingHits,
  setNodeStakeNFTid,
  setStHitTotalSupply,
  setStakedHIT,
} from "Store/Reducers/staking";
import { FungibleBalances, NonFungibleBalances, StakingTokens, Tabs } from "Types/reducers";
import { TokenData } from "Types/token";
import { BN, chunkArray, extractBalances, formatTokenAmount } from "./format";
import { EntityDetails, UnlockingRewards, UnstakeClaimNFTDATA } from "Types/api";
import {
  NODE_STAKING_USER_BADGE_ADDRESS,
  NODE_STAKING_FOMO_KEY_VALUE_STORE_ADDRESS,
  NODE_STAKING_HIT_KEY_VALUE_STORE_ADDRESS,
  POOL_ADDRESS,
  RUG_PROOF_STAKING_COMPONENT_ADDRESS,
  STHIT_RESOURCE_ADDRESS,
  HIT_RESOURCE_ADDRESS,
  FOMO_RESOURCE_ADDRESS,
  NODE_STAKING_COMPONENT_ADDRESS,
} from "Constants/address";
import {
  setRugProofComponentDataLoading,
  setFindingNodeNFT,
  setNodeStakingRewardsLoading,
  setPoolDataLoading,
  setStHitDataLoading,
  setTokenDataLoading,
  setNodeStakingComponentDataLoading,
  setValidatorDataLoading,
  setBalanceLoading,
  setUnstakeClaimNFtsDataLoading,
  setValidatorsListLoading,
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

export const getSelectedBalance = () => {
  const state = store.getState();
  const {
    staking: { currentTab, stHitBalance },
    session: { hitBalance },
  } = state;
  return currentTab === Tabs.stake ? BN(hitBalance) : BN(stHitBalance);
};

export const fetchHitFomoData = async () => {
  let hitPrice: number | undefined = undefined;
  let fomoPrice: number | undefined = undefined;
  let hitData: TokenData | undefined = undefined;
  let fomoData: TokenData | undefined = undefined;
  try {
    store.dispatch(setTokenDataLoading(true));

    // Use Promise.all to fetch both tokens data simultaneously
    const [hitDataResponse, fomoDataResponse] = await Promise.all([
      axios.get<any, AxiosResponse<TokenData>>(`${Ociswap_baseurl}/tokens/${HIT_RESOURCE_ADDRESS}`),
      axios.get<any, AxiosResponse<TokenData>>(
        `${Ociswap_baseurl}/tokens/${FOMO_RESOURCE_ADDRESS}`
      ),
    ]);

    // Handle HIT token response
    if (hitDataResponse.status === 200) {
      hitPrice = +hitDataResponse.data.price.usd.now;
      hitData = hitDataResponse.data;
    } else {
      console.error("Failed to fetch HIT token data", hitDataResponse.status);
    }

    // Handle FOMO token response
    if (fomoDataResponse.status === 200) {
      fomoPrice = +fomoDataResponse.data.price.usd.now;
      fomoData = fomoDataResponse.data;
    } else {
      console.error("Failed to fetch FOMO token data", fomoDataResponse.status);
    }
  } catch (error) {
    console.error("Error fetching token data", error);
  } finally {
    store.dispatch(setHitFomoPrices({ hit: hitPrice, fomo: fomoPrice }));
    store.dispatch(updateHitFomoData({ hit: hitData, fomo: fomoData }));
    store.dispatch(setTokenDataLoading(false));
  }
};

export const fetchStHITTotalSupply = async () => {
  let totalSupply = "0";
  try {
    store.dispatch(setStHitDataLoading(true));
    const response = await axios.post<any, AxiosResponse<EntityDetails>>(
      `${networkRPC}/state/entity/details`,
      {
        addresses: [STHIT_RESOURCE_ADDRESS],
      }
    );

    if (response.status === 200) {
      totalSupply = response.data.items[0].details.total_supply;
    }
  } catch (error) {
    console.log("error in fetchStHITTotalSupply", error);
  }
  store.dispatch(setStHitTotalSupply(totalSupply));
  store.dispatch(setStHitDataLoading(false));
};

export const fetchPoolDetails = async () => {
  let stakedHIT = "0";
  try {
    store.dispatch(setPoolDataLoading(true));
    const response = await axios.post<any, AxiosResponse<EntityDetails>>(
      `${networkRPC}/state/entity/details`,
      {
        addresses: [POOL_ADDRESS],
      }
    );

    if (response.status === 200) {
      const { balances } = extractBalances(response.data.items[0].fungible_resources.items, [
        { symbol: StakingTokens.HIT, address: HIT_RESOURCE_ADDRESS },
      ]);
      stakedHIT = balances[StakingTokens.HIT];
    }
  } catch (error) {
    console.log("error in fetchPoolDetails", error);
  }
  store.dispatch(setStakedHIT(stakedHIT));
  store.dispatch(setPoolDataLoading(false));
};

export const fetchRugProofComponentDetails = async () => {
  let lockedHITs = "0";
  try {
    store.dispatch(setRugProofComponentDataLoading(true));
    const response = await axios.post<any, AxiosResponse<EntityDetails>>(
      `${networkRPC}/state/entity/details`,
      {
        addresses: [RUG_PROOF_STAKING_COMPONENT_ADDRESS],
      }
    );

    if (response.status === 200) {
      const { balances } = extractBalances(response.data.items[0].fungible_resources.items, [
        { symbol: StakingTokens.HIT, address: HIT_RESOURCE_ADDRESS },
      ]);
      lockedHITs = balances[StakingTokens.HIT];
    }
  } catch (error) {
    console.log("error in fetchRugProofComponentDetails", error);
  }
  store.dispatch(setLockedHITRewards(lockedHITs));
  store.dispatch(setRugProofComponentDataLoading(false));
};

export const fetchNodeStakingComponentDetails = async () => {
  let totalHITs = "0";
  let totalFOMOs = "0";
  let assignedHITS = "0";
  let assignedFOMOs = "0";
  try {
    store.dispatch(setNodeStakingComponentDataLoading(true));
    const response = await axios.post<any, AxiosResponse<EntityDetails>>(
      `${networkRPC}/state/entity/details`,
      {
        addresses: [NODE_STAKING_COMPONENT_ADDRESS],
      }
    );

    if (response.status === 200) {
      const { balances } = extractBalances(response.data.items[0].fungible_resources.items, [
        { symbol: StakingTokens.HIT, address: HIT_RESOURCE_ADDRESS },
        { symbol: StakingTokens.FOMO, address: FOMO_RESOURCE_ADDRESS },
        // { symbol: `old${StakingTokens.FOMO}`, address: OLD_FOMO_RESOURCE_ADDRESS },
      ]);
      totalHITs = balances[StakingTokens.HIT];
      totalFOMOs = balances[StakingTokens.FOMO];
      // oldLockedFOMOs = balances[`old${StakingTokens.FOMO}`];
      response.data.items[0].details.state.fields[2].entries.forEach((entry: any) => {
        switch (entry.key.value) {
          case HIT_RESOURCE_ADDRESS:
            assignedHITS = entry.value.fields[1].value;
            break;
          case FOMO_RESOURCE_ADDRESS:
            assignedFOMOs = entry.value.fields[1].value;
            break;
        }
      });
    }
  } catch (error) {
    console.log("error in fetchNodeStakingComponentDetails", error);
  }
  store.dispatch(setLockedNodeStakingHits(BN(totalHITs).minus(assignedHITS).toString()));
  store.dispatch(setLockedNodeStakingFomos(BN(totalFOMOs).minus(assignedFOMOs).toString()));
  // store.dispatch(setOldLockedNodeStakingFomos(oldLockedFOMOs));
  store.dispatch(setNodeStakingComponentDataLoading(false));
};

export const findNodeStakeNFT = async (walletAddress: string) => {
  store.dispatch(setFindingNodeNFT(true));
  const details = await CachedService.gatewayApi.state.getEntityDetailsVaultAggregated(
    walletAddress
  );
  let nftId: number | undefined = undefined;
  details.non_fungible_resources.items.some((nft_resource) => {
    if (nft_resource.resource_address === NODE_STAKING_USER_BADGE_ADDRESS) {
      if (nft_resource.vaults.items[0].items) {
        const userNftid = Number(nft_resource.vaults.items[0].items[0].replace(/#/g, ""));
        nftId = Number.isNaN(userNftid) ? undefined : userNftid;
        return true;
      }
    }
    return false;
  });
  store.dispatch(setNodeStakeNFTid(nftId));
  store.dispatch(setFindingNodeNFT(false));
};

export const fetchClaimableNodeStakingRewards = async (nftId: number) => {
  const keyValueAddressesWithTheirTokens = [
    { address: NODE_STAKING_HIT_KEY_VALUE_STORE_ADDRESS, token: StakingTokens.HIT },
    { address: NODE_STAKING_FOMO_KEY_VALUE_STORE_ADDRESS, token: StakingTokens.FOMO },
    // { address: OLD_NODE_STAKING_FOMO_KEY_VALUE_STORE_ADDRESS, token: `old${StakingTokens.FOMO}` },
  ];

  let claimableRewards = {
    HIT: "0",
    FOMO: "0",
    // oldFOMO: "0"
  };

  try {
    store.dispatch(setNodeStakingRewardsLoading(true));
    const keyValueDataResponses = await Promise.all(
      keyValueAddressesWithTheirTokens.map((key_value_store_address) =>
        CachedService.gatewayApi.state.innerClient.keyValueStoreData({
          stateKeyValueStoreDataRequest: {
            key_value_store_address: key_value_store_address.address,
            keys: [{ key_json: { kind: "U64", value: nftId.toString() } }],
          },
        })
      )
    );
    keyValueDataResponses.forEach((response, index) => {
      if (
        response.entries.length > 0 &&
        response.entries[0].value.programmatic_json.kind === "Decimal"
      ) {
        claimableRewards[
          keyValueAddressesWithTheirTokens[index].token as keyof typeof claimableRewards
        ] = response.entries[0].value.programmatic_json.value;
      }
    });
  } catch (error) {
    console.log("unable to fetch ClaimableNodeStakingRewards:", error);
  }
  store.dispatch(setNodeStakingRewardsLoading(false));
  return claimableRewards;
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

      store.dispatch(
        setValidatorInfo({
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
        })
      );
      dispatch(setValidatorInfoFound(true));
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

export const fetchValidatorsList = async () => {
  try {
    store.dispatch(setValidatorsListLoading(true));

    const res = await CachedService.gatewayApi.state.getAllValidators();

    const validatorsList = res
      .sort(
        (a, b) => parseInt(b.stake_vault?.balance || "0") - parseInt(a.stake_vault?.balance || "0")
      )
      .slice(0, 100)
      .map((validator) => {
        const address = validator.address;
        const stakeVaultBalance = formatTokenAmount(
          parseInt(validator.stake_vault?.balance || "0")
        );
        const pendingXrdWithdrawBalance = formatTokenAmount(
          parseInt(validator.pending_xrd_withdraw_vault?.balance || "0")
        );
        const lockedOwnerStakeUnitVaultBalance = formatTokenAmount(
          parseInt(validator.locked_owner_stake_unit_vault?.balance || "0")
        );

        const metadata = extractMetadata(validator.metadata);
        const name = metadata.name;
        const icon = metadata.icon_url || "";

        return {
          name,
          icon,
          address,
          stakeVaultBalance,
          pendingXrdWithdrawBalance,
          lockedOwnerStakeUnitVaultBalance,
        };
      });

    store.dispatch(setValidatorsList(validatorsList));
  } catch (error) {
    console.log("error in fetchingValidatorsList", error);
  } finally {
    store.dispatch(setValidatorsListLoading(false));
  }
};
