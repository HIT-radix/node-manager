import NodeManager from "./components/nodeManager";
import NodeMetadata from "./components/nodeMetadata";
import Listeners from "./components/listeners";
import NodeSkeletons from "./components/skeletons";
import { useSelector } from "Store";

const Node = () => {
  const validatorDataLoading = useSelector((state) => state.loadings.validatorDataLoading);
  return (
    <div>
      <Listeners />
      {validatorDataLoading ? (
        <NodeSkeletons />
      ) : (
        <>
          <NodeMetadata />
          <NodeManager />
        </>
      )}
    </div>
  );
};

export default Node;
