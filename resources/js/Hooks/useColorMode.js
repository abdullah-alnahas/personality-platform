import React from "react";

export const ColorModeContext = React.createContext({
    mode: "light",
    userChoice: "auto",
    setMode: () => {},
    toggleMode: () => {},
});

export const useColorMode = () => React.useContext(ColorModeContext);
