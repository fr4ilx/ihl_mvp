// Appearance inside the app: Dark mode, a switch on My Profile and My Practice. Until the person flips it the app
// follows the phone (mode 'automatic'). Flipping it sets 'light' or 'dark'.
// React Native: useColorScheme() for the phone setting, the person's choice saved with AsyncStorage.
import React, { createContext, useContext } from 'react';

const AppearanceContext = createContext({ mode: 'automatic', set: () => {} });
export const useAppearance = () => useContext(AppearanceContext);

export function AppearanceProvider({ mode, setMode, children }) {
  return <AppearanceContext.Provider value={{ mode, set: setMode }}>{children}</AppearanceContext.Provider>;
}
