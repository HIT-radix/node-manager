import { StakeType } from "./enum";

interface ResourceDetails {
  amount: string;
  last_updated_at_state_version: number;
  aggregation_level: string;
  resource_address: string;
}

interface TypedValue {
  raw_hex: string;
  programmatic_json: {
    variant_id: number;
    fields: { element_kind: string; elements: { value: string; kind: string }[]; kind: string }[];
    kind: string;
  };
  typed: { values?: string[]; type: string; value?: string };
}

interface MetadataItem {
  key: string;
  value: TypedValue;
  is_locked: boolean;
  last_updated_at_state_version: number;
}

interface RoleAssignment {
  role_key: { module: string; name: string };
  assignment: {
    resolution: string;
    explicit_rule?: {
      type: string;
      access_rule: {
        type: string;
        proof_rule: {
          type: string;
          requirement: {
            type: string;
            non_fungible: {
              local_id: { id_type: string; sbor_hex: string; simple_rep: string };
              resource_address: string;
            };
          };
        };
      };
    };
    updater_roles: { module: string; name: string }[];
  };
}

interface Details {
  package_address: string;
  blueprint_name: string;
  blueprint_version: string;
  state: Record<string, any>;
  role_assignments: {
    owner: {
      rule: {
        type: string;
        access_rule: {
          type: string;
          proof_rule: {
            type: string;
            requirement: {
              type: string;
              non_fungible: {
                local_id: { id_type: string; sbor_hex: string; simple_rep: string };
                resource_address: string;
              };
            };
          };
        };
        updater: string;
      };
      entries: RoleAssignment[];
    };
    type: string;
  };
  total_supply: string;
}

interface Item {
  address: string;
  fungible_resources: { total_count: number; items: ResourceDetails[] };
  non_fungible_resources: { total_count: number; items: ResourceDetails[] };
  metadata: { total_count: number; items: MetadataItem[] };
  details: Details;
}

export type UnlockingRewards = {
  epoch_unlocked: number;
  stake_unit_amount: string;
}[];

export type UnstakeClaimNFT = {
  nftId: string;
  claim_amount: string;
  claim_epoch: string;
};

export type UnstakeClaimNFTDATA = Record<
  string,
  {
    nftId: string;
    claim_amount: string;
    claim_epoch: string;
  }
>;

export type NewFeeFactor = { new_fee_factor: string; epoch_effective: number };

export type FeeFactor = {
  aboutToChange: NewFeeFactor | null;
  current: string;
  alert: string;
};

export type ValidatorItem = {
  position: number;
  address: string;
  icon?: string;
  name?: string;
  stakeVaultBalance: string;
  pendingXrdWithdrawBalance: string;
  lockedOwnerStakeUnitVaultBalance: string;
  pool_unit: string;
  owner_badge: string;
  claim_nft: string;
  fee: FeeFactor;
};

export interface RecentStakingTx {
  account: string;
  amount: string;
  date: Date | null | undefined;
  type: StakeType;
}
