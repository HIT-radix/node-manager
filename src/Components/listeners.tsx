import { dispatch, useSelector } from "Store";
import { setIsOwner } from "Store/Reducers/session";
import { fetchBalances, fetchUnstakeCLaimNFTData, fetchValidatorInfo } from "Utils/fetchers";
import { useEffect } from "react";
import { initializeSubscriptions, unsubscribeAll } from "subs";

const Listeners = () => {
  const successTxCount = useSelector((state) => state.session.successTxCount);
  const walletAddress = useSelector((state) => state.app.walletAddress);
  const nonFungibles = useSelector((state) => state.session.userBalances.nonFungible);
  const metadata = useSelector((state) => state.nodeManager.metadata);
  const validatorAddress = useSelector((state) => state.nodeManager.validatorAddress);

  useEffect(() => {
    initializeSubscriptions();
    return () => {
      unsubscribeAll();
    };
  }, []);

  useEffect(() => {
    fetchBalances(walletAddress);
  }, [successTxCount, walletAddress]);

  useEffect(() => {
    if ("owner_badge" in metadata) {
      const ownerBadge = metadata.owner_badge;
      if (nonFungibles[ownerBadge] && nonFungibles[ownerBadge].ids.includes(ownerBadge)) {
        dispatch(setIsOwner(true));
      } else {
        dispatch(setIsOwner(false));
      }
    } else {
      dispatch(setIsOwner(false));
    }
  }, [metadata, nonFungibles, successTxCount]);

  useEffect(() => {
    if (validatorAddress) {
      fetchValidatorInfo(validatorAddress);
    }
  }, [validatorAddress, successTxCount]);

  useEffect(() => {
    // TODO - epmty this state if wallet disconnects
    if ("claim_nft" in metadata && nonFungibles[metadata.claim_nft]) {
      const nftIds = nonFungibles[metadata.claim_nft].ids;
      fetchUnstakeCLaimNFTData(metadata.claim_nft, nftIds);
    }
  }, [metadata, nonFungibles]);

  return <></>;
};

export default Listeners;
