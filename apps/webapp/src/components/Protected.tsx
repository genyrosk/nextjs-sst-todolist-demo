import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const RedirectWithoutAuth = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log("session", { status });
    if (status === "unauthenticated") {
      console.log("lets redirect to signIn flow");
      void signIn(undefined, { callbackUrl: router.route });
    }
  }, [status, router.route]);

  if (status === "authenticated") {
    return <div>{children}</div>;
  }
  return <div className="opacity-25">{children}</div>;
};

export const Protected = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();
  console.log("Protected", { status });

  if (status === "authenticated") {
    return <>{children}</>;
  }

  return null;
};
