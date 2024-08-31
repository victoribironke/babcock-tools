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

export const getAccountName = async (acct_no: string, bank_code: string) => {
  if (!acct_no || !bank_code) {
    return {
      data: null,
      error: "The account number or bank name is not correct.",
    };
  }

  try {
    const url = `https://api.paystack.co/bank/resolve?account_number=${acct_no}&bank_code=${bank_code}`;

    const req = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_LIVE_SECRET_KEY}`,
      },
    });
    const data = await req.json();

    if (!data.status) {
      return {
        data: null,
        error: "The account number or bank name is not correct.",
      };
    }

    return { data: data.data.account_name, error: null };
  } catch (e) {
    return { data: null, error: "An error occured." };
  }
};

export const createSubaccount = async (
  account_name: string,
  bank_code: string,
  account_number: string
) => {
  const req = await fetch("https://api.paystack.co/subaccount", {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_LIVE_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      business_name: account_name,
      settlement_bank: bank_code,
      account_number,
      percentage_charge: 0,
    }),
  });
  const data = await req.json();

  if (!data.status) {
    return { data: null, error: "An error occured." };
  }

  return { data: data.data.subaccount_code, error: null };
};

export const updateSubaccount = async (
  code: string,
  account_name: string,
  bank_code: string,
  account_number: string
) => {
  const req = await fetch(`https://api.paystack.co/subaccount/${code}`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_LIVE_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify({
      business_name: account_name,
      settlement_bank: bank_code,
      account_number: account_number,
    }),
  });
  const data = await req.json();
  console.log(data);
  if (!data.status) {
    return { data: null, error: "An error occured." };
  }

  return { data: "Success.", error: null };
};

export const getFeesFromTicketPrice = (price: number) => {
  let fee = Math.floor((4 / 100) * price);

  if (fee < 100) fee = 100;
  else if (fee > 1000) fee = 1000;

  return fee;
};
