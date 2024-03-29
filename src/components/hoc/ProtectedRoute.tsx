import { PAGES } from "@/constants/pages";
import { auth } from "@/services/firebase";
// import { getCurrentUser } from "@/utils/firebase";
import { useRouter } from "next/router";
import { useState, useEffect, JSX } from "react";
import PageLoader from "../general/PageLoader";
import { onAuthStateChanged } from "firebase/auth";

// Check if user is logged in
export const checkAuthentication = (ProtectedComponent: () => JSX.Element) => {
  return function CheckIfTheUserIsLoggedIn(props: object) {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      // setTimeout(() => {
      //   if (getCurrentUser() === null) {
      //     router.push(`${PAGES.login}?redirect=${router.pathname}`);
      //     return null;
      //   }

      //   setIsLoading(false);
      // }, 2000);
      const unsub = onAuthStateChanged(auth, (user) => {
        setIsLoading(true);

        if (user === null) {
          router.push(`${PAGES.login}?redirect=${router.pathname}`);
          return;
        }

        setIsLoading(false);
      });

      return unsub;
    }, []);
    // }, [auth.currentUser]);

    if (isLoading) {
      return <PageLoader type="full" />;
    }

    return <ProtectedComponent {...props} />;
  };
};

// Prevents already logged in user access to auth modals
export const alreadyLoggedIn = (ProtectedComponent: () => JSX.Element) => {
  return function StopLoggedInUsersAccessToAuthModals(props: object) {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      // setTimeout(async () => {
      //   if (getCurrentUser()) {
      //     router.push(PAGES.dashboard);
      //     return null;
      //   }

      //   setIsLoading(false);
      // }, 2000);

      const unsub = onAuthStateChanged(auth, (user) => {
        setIsLoading(true);

        if (user) {
          setTimeout(() => {
            router.push(PAGES.dashboard);
            return;
          }, 500);
        }

        setIsLoading(false);
      });

      return unsub;
    }, []);
    // }, [auth.currentUser]);

    if (isLoading) {
      return <PageLoader type="full" />;
    }

    return <ProtectedComponent {...props} />;
  };
};
