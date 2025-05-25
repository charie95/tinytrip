import { atom } from "recoil";

export const selectedDateState = atom<string>({
  key: "selectedDateState",
  default: "",
});

export const isEditModeState = atom<boolean>({
  key: "isEditModeState",
  default: false,
});
