import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { dispatch } from "Store";
import { setInputSearch } from "Store/Reducers/session";
import { fetchValidatorInfo } from "Utils/fetchers";

const Listeners = () => {
  const { id: nodeAddress } = useParams<{ id: string }>();

  useEffect(() => {
    return () => {
      dispatch(setInputSearch(""));
    };
  }, []);

  useEffect(() => {
    if (nodeAddress) {
      dispatch(setInputSearch(nodeAddress));
      fetchValidatorInfo(nodeAddress);
    }
  }, [nodeAddress]);
  return <></>;
};

export default Listeners;
