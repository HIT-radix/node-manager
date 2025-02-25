import { radixDashboardBaseUrl } from "Constants/misc";
import { FeeFactor, NewFeeFactor } from "Types/api";
import { parseUnits as parseUnitsEthers } from "ethers";
import BigNumber from "bignumber.js";
import numbro from "numbro";

export const BN = BigNumber.clone({
  DECIMAL_PLACES: 18,
  ROUNDING_MODE: BigNumber.ROUND_HALF_UP,
  EXPONENTIAL_AT: [-20, 20],
});

export const formatDollarAmount = (num: number | undefined | null, digits = 2, round = true) => {
  if (num === 0) return "$0.00";
  if (!num) return "-";
  if (num < 0.001 && digits <= 3) {
    return "<$0.001";
  }
  if (num < 0.01 && digits <= 2) {
    return "<$0.01";
  }

  return numbro(num).formatCurrency({
    average: round,
    mantissa: num > 1000 ? 2 : digits,
    abbreviations: {
      million: "M",
      billion: "B",
    },
  });
};

export const formatTokenAmount = (num: number | undefined, digits = 2) => {
  if (num === 0) return "0";
  if (!num) return "-";
  if (num < 0.001 && digits <= 3) {
    return "<0.001";
  }
  if (num < 0.01 && digits <= 2) {
    return "<0.01";
  }

  let formattedAmount = numbro(num)
    .formatCurrency({
      average: true,
      mantissa: num >= 1000 ? 2 : digits,
      abbreviations: {
        million: "M",
        billion: "B",
      },
    })
    .replace("$", "");

  formattedAmount = formattedAmount.replace(".00", "");
  return formattedAmount;
};

export const exactAmountInDecimals = (amount: number, decimals: number) => {
  return Number.isInteger(amount) ? amount.toString() : amount.toFixed(decimals).replace(/0+$/, "");
};

export function parseUnits(_num: number) {
  return parseUnitsEthers(_num.toString(), 18).toString();
}

export function formatUnits(_num: number, decimals: number) {
  const divisor = 10 ** decimals;
  return _num / divisor;
}

export const generateExplorerTxLink = (txId?: string) => {
  return `${radixDashboardBaseUrl}/transaction/${txId}`;
};

export const conciseAddress = (address: string, startSlice = 3, endSlice = 3): string => {
  return `${address?.slice(0, startSlice)}...${address?.slice(
    address?.length - endSlice,
    address?.length
  )}`;
};

export const toLocaleFormat = (value: string) => {
  if (value === "") {
    return value;
  }
  // Remove all non-digit and non-decimal characters
  value = value.replace(/[^0-9.]/g, "");
  const containsDot = value.includes(".");

  // Split into integer and decimal parts
  const parts = value.split(".");
  const integerPart = parts[0];
  const decimalPart = parts.length > 1 ? parts[1] : "";

  // Format the integer part using toLocaleString()
  const formattedIntegerPart = parseInt(integerPart).toLocaleString();

  // Combine integer part and decimal part
  const answer =
    decimalPart || containsDot ? formattedIntegerPart + "." + decimalPart : formattedIntegerPart;
  return answer;
};

export const calculateEstimatedUnlockDate = (epochUnlocked: number, currentEpoch: number) => {
  const minutesPerEpoch = 5;
  const currentDate = new Date();
  const unlockDate = new Date(
    currentDate.getTime() + (epochUnlocked - currentEpoch) * minutesPerEpoch * 60000
  );
  return unlockDate.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const chunkArray = <T>(arr: T[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, index) =>
    arr.slice(index * size, index * size + size)
  );

export const computeValidatorFeeFactor = (
  currentFeeFactor: string,
  NewFeeFactor: NewFeeFactor | null,
  currentEpoch: number
): FeeFactor => {
  let feefactor: FeeFactor = {
    aboutToChange: null,
    current: (+currentFeeFactor * 100).toFixed(2) + "%",
    alert: "",
  };
  if (NewFeeFactor) {
    const newFactorPercentage = (+NewFeeFactor.new_fee_factor * 100).toFixed(2) + "%";
    if (NewFeeFactor.epoch_effective <= currentEpoch) {
      feefactor.current = newFactorPercentage;
      feefactor.aboutToChange = null;
    } else {
      feefactor.aboutToChange = {
        new_fee_factor: newFactorPercentage,
        epoch_effective: NewFeeFactor.epoch_effective,
      };
      feefactor.alert = `Fee will be changed to ${newFactorPercentage} on ${calculateEstimatedUnlockDate(
        NewFeeFactor.epoch_effective,
        currentEpoch
      )}`;
    }
  }

  return feefactor;
};
