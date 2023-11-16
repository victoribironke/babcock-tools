import { auth } from "@/services/firebase";

export const signOutUser = () => auth.signOut();

export const getCurrentUser = () => auth.currentUser;
