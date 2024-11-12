import { useEffect } from "react";
import { useSelector } from "Store";
import { fetchValidatorsList } from "Utils/fetchers";

const ValidatorsList = () => {
  const { validatorsList } = useSelector((state) => state.session);
  const validatorsListLoading = useSelector((state) => state.loadings.validatorsListLoading);

  console.log(validatorsList);
  console.log(validatorsListLoading);

  useEffect(() => {
    fetchValidatorsList();
  }, []);

  return (
    <>
      {!validatorsListLoading ? (
        <div>Hello, World!</div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="skeleton h-8 w-full"></div>
          <div className="skeleton h-8 w-full"></div>
          <div className="skeleton h-8 w-full"></div>
          <div className="skeleton h-8 w-full"></div>
        </div>
      )}
    </>
  );
};

export default ValidatorsList;
