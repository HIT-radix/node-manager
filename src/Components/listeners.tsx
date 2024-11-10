import { dispatch, useSelector } from "Store";
import { setIsOwner } from "Store/Reducers/session";
import { fetchBalances } from "Utils/fetchers";
import { useEffect } from "react";
import { initializeSubscriptions, unsubscribeAll } from "subs";

const Listeners = () => {
  const successTxCount = useSelector((state) => state.session.successTxCount);
  const walletAddress = useSelector((state) => state.app.walletAddress);
  const nonFungibles = useSelector((state) => state.session.userBalances.nonFungible);
  const metadata = useSelector((state) => state.nodeManager.metadata);

  useEffect(() => {
    initializeSubscriptions();
    return () => {
      unsubscribeAll();
    };
  }, []);

  useEffect(() => {
    (async () => {
      await fetchBalances(walletAddress);
    })();
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
  }, [metadata, nonFungibles]);

  return <></>;
};

export default Listeners;
