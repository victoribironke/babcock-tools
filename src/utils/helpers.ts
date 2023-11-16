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

export const classNames = (...classes: (string | number | boolean)[]) => {
  return classes.filter(Boolean).join(" ");
};

export const parseDate = (date: string, type: "text" | "object" = "text") => {
  const splitted = date.split("-").map((a) => parseInt(a));

  if (type === "object")
    return { year: splitted[0], month: splitted[1], day: splitted[2] };

  const getSuffix = (day: string) => {
    if (day.split("").every((k) => k === "1")) return "th";

    if (day === "1" || day[1] === "1") return "st";
    if (day === "2" || day[1] === "2") return "nd";
    if (day === "3" || day[1] === "3") return "rd";

    return "th";
  };

  const day = splitted[2];
  const month = months[splitted[1] - 1];
  const year = splitted[0];
  const suffix = getSuffix(day.toString());

  return `${day}${suffix} ${month}, ${year}`;
};

export const isValidEmail = (email: string) => {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(email);
};

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

export const formatNumber = (num: number) => {
  return num.toLocaleString("en-US");
};

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
