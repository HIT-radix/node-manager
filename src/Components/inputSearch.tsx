import CachedService from "Classes/cachedService";
import MainLayout from "Layout/mainLayout";
import { MoveLeft } from "lucide-react";
import { dispatch, useSelector } from "Store";
import { setInputSearch } from "Store/Reducers/session";

const InputSearch = () => {
  const inputSearch = useSelector((state) => state.session.inputSearch);

  return (
    <>
      {window.location.pathname.includes("/node") && (
        <MainLayout>
          <div
            className="flex gap-2 mb-2 cursor-pointer"
            onClick={() => CachedService.navigation(-1)}
          >
            <MoveLeft className="text-secondary" />
            <p className="text-secondary underline">Back</p>
          </div>
        </MainLayout>
      )}
      <div className="flex flex-col sm:flex-row items-center justify-center px-2">
        <input
          value={inputSearch}
          onChange={(e) => dispatch(setInputSearch(e.target.value))}
          className="border border-white text-accent max-w-[400px] p-2 rounded-lg w-full"
          placeholder="search validator name or address"
        />
      </div>
    </>
  );
};

export default InputSearch;
