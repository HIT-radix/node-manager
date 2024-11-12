import { useEffect } from "react";
import { useParams } from "react-router-dom";
import NodeManager from "./components/nodeManager";
import NodeMetadata from "./components/nodeMetadata";
import { fetchValidatorInfo } from "Utils/fetchers";
import { dispatch } from "Store";
import { setInputSearch } from "Store/Reducers/session";

const Node = () => {
  const { id: nodeAddress } = useParams<{ id: string }>();

  useEffect(() => {
    if (nodeAddress) {
      dispatch(setInputSearch(nodeAddress));
      fetchValidatorInfo(nodeAddress);
    }
  }, [nodeAddress]);

  return (
    <div>
      <NodeMetadata />
      <NodeManager />
    </div>
  );
};

export default Node;
