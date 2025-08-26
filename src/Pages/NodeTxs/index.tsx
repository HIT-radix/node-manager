import { useSelector } from "Store";
import Listeners from "./components/listeners";
import NodeSkeletons from "Pages/Node/components/skeletons";
import RecentTxUi from "./components/RecentTxUi";

const NodeTxs = () => {
  const validatorDataLoading = useSelector((state) => state.loadings.validatorDataLoading);
  const recentNodeTxLoading = useSelector((state) => state.loadings.recentNodeTxLoading);

  return (
    <>
      {validatorDataLoading || recentNodeTxLoading ? <NodeSkeletons /> : <RecentTxUi />}
      <Listeners />
    </>
  );
};

export default NodeTxs;
