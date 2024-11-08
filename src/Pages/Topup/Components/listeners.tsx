import { useEffect } from "react";
import { fetchNodeStakingComponentDetails } from "Utils/fetchers";

const Listeners = () => {
  useEffect(() => {
    fetchNodeStakingComponentDetails();
  }, []);

  return <></>;
};

export default Listeners;
