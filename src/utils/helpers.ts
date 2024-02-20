import { Order, User } from "@/types/dashboard";

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const classNames = (...classes: (string | number | boolean)[]) =>
  classes.filter(Boolean).join(" ");

export const parseDate = (date: string, type: "text" | "object" = "text") => {
  const splitted = date.split("-").map((a) => parseInt(a));

  if (type === "object")
    return { year: splitted[0], month: splitted[1], day: splitted[2] };

  const d = new Date(date).toDateString().split(" ");

  return `${d[2]} ${d[1]} ${d[3]}`;
};

export const getTodaysDate = () => new Date().toISOString().split("T")[0];

export const isValidEmail = (email: string) =>
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(email);

export const isValidURL = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export const isUnder18 = (date: string) => {
  const { year, month, day } = parseDate(date, "object") as {
    year: number;
    month: number;
    day: number;
  };

  const dob = new Date(`${month}/${day}/${year}`);
  const monthDiff = Date.now() - dob.getTime();
  const ageDt = new Date(monthDiff);
  const ageYear = ageDt.getUTCFullYear();
  const age = Math.abs(ageYear - 1970);

  return age < 18;
};

export const checkPasswordStrength = (
  password: string,
  checkStrength = false
) => {
  const hasMinChar = password.length >= 8;
  const hasNum = /\d/.test(password);
  const hasSym = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password);
  const hasUpp = /[A-Z]/.test(password);

  if (checkStrength)
    return [hasMinChar, hasNum, hasSym, hasUpp].every((k) => k === true);

  return { hasMinChar, hasNum, hasSym, hasUpp };
};

export const formatNumber = (num: number) => num.toLocaleString("en-US");

export const generateRandomString = (len: number) => {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  let str = "";

  for (let i = 0; i < len; i++) {
    str += letters[Math.floor(Math.random() * 26)];
  }

  return str;
};

export const generateUniqueURL = () => {
  const now = Date.now().toString().slice(6);

  return `${generateRandomString(2)}${now}${generateRandomString(2)}`;
};

export const pickRandomFromArray = (array: any[]) =>
  array[Math.floor(Math.random() * array.length)];

export const shuffleArray = (array: any[]) => {
  const a = array.slice();

  for (let i = a.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }

  return a;
};

export const getUsersByHall = (users: User[]) => {
  const grouped_data = users.reduce((group, user) => {
    const { hall_of_residence } = user;

    group[hall_of_residence as keyof typeof group] =
      group[hall_of_residence as keyof typeof group] ?? [];

    (group[hall_of_residence as keyof typeof group] as User[]).push(user);

    return group;
  }, {}); // Group users according to their halls

  const arr: User[][] = [];

  for (let i in grouped_data) {
    arr.push(grouped_data[i as keyof typeof grouped_data]);
  }

  const data: { name: string; total: number }[] = arr.map((a) => {
    return {
      name: a[0].hall_of_residence,
      total: a.length,
    };
  });

  return data.sort((a, b) => (a.name > b.name ? 1 : -1));
};

export const getOrdersByMealType = (orders: Order[]) => {
  const grouped_data = orders.reduce((group, order) => {
    const { meal_type } = order;

    group[meal_type as keyof typeof group] =
      group[meal_type as keyof typeof group] ?? [];

    (group[meal_type as keyof typeof group] as Order[]).push(order);

    return group;
  }, {}); // Group orders according to the meal types

  const arr: Order[][] = [];

  for (let i in grouped_data) {
    arr.push(grouped_data[i as keyof typeof grouped_data]);
  }

  const data: { name: string; total: number }[] = arr.map((a) => {
    return {
      name: a[0].meal_type,
      total: a.length,
    };
  });

  return data;
};
