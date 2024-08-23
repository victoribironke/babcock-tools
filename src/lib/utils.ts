import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const isValidEmail = (email: string) =>
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(email);

export const getValueFromTitle = (title: string) =>
  title.toLowerCase().split(" ").join("-");

export const getFishyDomains = async () => {
  try {
    const res = await (
      await fetch(
        "https://gist.githubusercontent.com/SimonHoiberg/f5a23b1fa3762330c8af1e9090918b63/raw/53963d0dbdd93c594fbc067cee95966156ee066b/temp-email-list.txt"
      )
    ).text();

    return { data: res, error: null };
  } catch (e) {
    return { data: null, error: "A server error occured." };
  }
};
