import { Suspense } from "react";
import { Provider as ReduxProvider } from "react-redux";
import "./index.css";
import { PersistGate } from "redux-persist/integration/react";
import ReactDOM from "react-dom/client";
import App from "./App";
import hitLogo from "Assets/Images/hit-logo.png";
import { store, persister } from "Store";
import "react-loading-skeleton/dist/skeleton.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Listeners from "Components/listeners";
// if (process.env.REACT_APP_ENVIRONMENT === Environment.prod) {
//   console.log = () => {};
// }

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <Suspense
    fallback={
      <div className="preloader-container bouncing">
        <img src={hitLogo} alt="meshIcon" className="w-[200px] h-[200px]" />
      </div>
    }
  >
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persister}>
        <Listeners />
        <ToastContainer />
        <App />
      </PersistGate>
    </ReduxProvider>
  </Suspense>
);
