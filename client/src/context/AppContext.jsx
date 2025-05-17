import { createContext, useState } from "react";

export const AppContext = createContext(null);

const AppcontextProvider = (props) => {
  const [user, setUser] = useState("");

  localStorage.getItem("token");
  const contextValue = {
    user,
    setUser,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppcontextProvider;
