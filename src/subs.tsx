import { Subscription } from "rxjs";
import {
  DataRequestBuilder,
  RadixDappToolkit,
  WalletDataState,
} from "@radixdlt/radix-dapp-toolkit";
import { store } from "Store";
import { setWalletData } from "Store/Reducers/app";
import { DAPP_DEFINITION_ADDRESS } from "Constants/address";
import { applicationName, networkId } from "Constants/misc";
import CachedService from "Classes/cachedService";
import { WalletConnectedToast, WalletDiconnectedToast } from "Components/toasts";
import axios from "axios";
import { HIT_SERVER_URL } from "Constants/endpoints";
// import { GatewayApiClient } from "@radixdlt/babylon-gateway-api-sdk";

// export const gatewayApi = GatewayApiClient.initialize({
//   networkId,
//   applicationName,
//   applicationVersion: "1",
//   applicationDappDefinitionAddress: DAPP_DEFINITION_ADDRESS,
// });

export type RDT = ReturnType<typeof RadixDappToolkit>;

let rdtInstance: null | RDT = null;
export function getRdt() {
  return rdtInstance;
}
export function setRdt(rdt: RDT) {
  rdtInstance = rdt;
}

let subs: Subscription[] = [];

export function initializeSubscriptions() {
  rdtInstance = RadixDappToolkit({
    dAppDefinitionAddress: DAPP_DEFINITION_ADDRESS,
    networkId,
    applicationName,
    applicationVersion: "1",
  });

  rdtInstance.walletApi.setRequestData(DataRequestBuilder.accounts().atLeast(1));

  const getChallenge = () => {
    const res = axios.get<string>(`${HIT_SERVER_URL}/node-staking/create-challenge`);
    return res.then((data) => data.data);
  };

  rdtInstance.walletApi.provideChallengeGenerator(getChallenge);

  subs.push(
    rdtInstance.walletApi.walletData$.subscribe((walletData: WalletDataState) => {
      const data: WalletDataState = JSON.parse(JSON.stringify(walletData));
      console.log("data", data);
      store.dispatch(setWalletData(data));
      if (data.accounts.length) {
        CachedService.isWalletConnected = true;
        CachedService.successToast(
          <WalletConnectedToast walletAddress={data.accounts[0].address} />
        );
      } else if (CachedService.isWalletConnected) {
        CachedService.errorToast(<WalletDiconnectedToast />);
      }
    })
  );
  setRdt(rdtInstance);
  // TODO: "black" on the light theme
  rdtInstance.buttonApi.setTheme("white");
}

export function unsubscribeAll() {
  subs.forEach((sub) => {
    sub.unsubscribe();
  });
  subs = [];
}
