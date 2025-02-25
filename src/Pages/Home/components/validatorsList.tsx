import { useEffect } from "react";
import { useSelector } from "Store";
import { fetchTopValidators } from "Utils/fetchers";
import { useTwBreakpoints } from "hooks/userTwBreakpoints";
import { TwBreakPoints } from "Types/misc";
import ValidatorsListDesktop from "./validatorsListDesktop";
import ValidatorsListMobile from "./validatorsListMobile";
import ToggleView from "./toggleView";

const ValidatorsList = () => {
  const currentBreakpoint = useTwBreakpoints();

  const isLessThanMd =
    currentBreakpoint && [TwBreakPoints.xs, TwBreakPoints.sm].includes(currentBreakpoint);

  const validatorsListLoading = useSelector((state) => state.loadings.validatorsListLoading);

  useEffect(() => {
    fetchTopValidators();
  }, []);

  return (
    <div className="mt-10">
      {!validatorsListLoading ? (
        <>
          <ToggleView />
          {!isLessThanMd ? <ValidatorsListDesktop /> : <ValidatorsListMobile />}
        </>
      ) : (
        <div className="flex flex-col w-full gap-8">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="skeleton h-8 w-full"></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ValidatorsList;
