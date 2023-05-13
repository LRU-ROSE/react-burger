import { Provider } from "react-redux";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ModalProvider from "../../providers/ModalProvider";
import { store } from "../../services";
import AppHeader from "../AppHeader";
import ConstructorPage from "../ConstructorPage";

const App = () => {
  return (
    <>
      <AppHeader />
      <Provider store={store}>
        <ModalProvider>
          <DndProvider backend={HTML5Backend}>
            <ConstructorPage />
          </DndProvider>
        </ModalProvider>
      </Provider>
    </>
  );
};

export default App;
