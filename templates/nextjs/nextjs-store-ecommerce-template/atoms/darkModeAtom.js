import * as React from "react";
import { atom, useRecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const darkModeAtom = atom({
  key: "darkMode",
  default: false,
  effects_UNSTABLE: [persistAtom]
});

export function useDarkMode() {
  const [isInitial, setIsInitial] = React.useState(true);
  const [darkModeStored, setDarkModeStored] = useRecoilState(darkModeAtom);

  React.useEffect(() => {
    setIsInitial(false);
  }, []);

  return [
    isInitial === true ? false : darkModeStored,
    setDarkModeStored
  ] 
}