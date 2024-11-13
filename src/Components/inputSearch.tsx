import CachedService from "Classes/cachedService";
import { dispatch, useSelector } from "Store";
import { setInputSearch } from "Store/Reducers/session";

const InputSearch = () => {
  const inputSearch = useSelector((state) => state.session.inputSearch);

  const handleSearchClick = () => {
    if (inputSearch) {
      CachedService.navigation(`/node/${inputSearch}`);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 px-2">
      <input
        value={inputSearch}
        onChange={(e) => dispatch(setInputSearch(e.target.value))}
        className="border border-white text-accent max-w-[400px] p-2 rounded-lg w-full"
        placeholder="search validator address"
      />
      <div
        className="btn btn-accent text-base-100 w-full max-w-[400px] sm:w-auto"
        onClick={handleSearchClick}
      >
        Search
      </div>
    </div>
  );
};

export default InputSearch;
