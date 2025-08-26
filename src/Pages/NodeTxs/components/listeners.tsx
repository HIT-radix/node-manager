import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { dispatch } from "Store";
import { setRecentNodeTxLoading } from "Store/Reducers/loadings";
import { setRecentTx } from "Store/Reducers/recentTxs";
import { setInputSearch } from "Store/Reducers/session";
import { fetchRecentNodeTxs, fetchValidatorInfo } from "Utils/fetchers";

const Listeners = () => {
  const { id: nodeAddress } = useParams<{ id: string }>();

  useEffect(() => {
    (async () => {
      if (nodeAddress) {
        dispatch(setRecentNodeTxLoading(true));
        dispatch(setInputSearch(nodeAddress));
        let claimNftAddress = "";
        let nodeLSUaddress = "";
        const nodeData = await fetchValidatorInfo(nodeAddress);

        if (nodeData) {
          nodeLSUaddress = nodeData.stakeUnitAddress;
          if ("claim_nft" in nodeData.metadata) {
            claimNftAddress = nodeData.metadata.claim_nft;
          }
        }

        if (claimNftAddress && nodeLSUaddress) {
          const recentTxs = await fetchRecentNodeTxs(nodeAddress, nodeLSUaddress, claimNftAddress);
          dispatch(setRecentTx({ nodeAddress, txData: recentTxs }));
        }
        dispatch(setRecentNodeTxLoading(false));
      }
    })();
  }, [nodeAddress]);
  return <></>;
};

export default Listeners;
