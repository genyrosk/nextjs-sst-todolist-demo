import { useSession } from "next-auth/react";
import { api } from "@/utils/api";
import { Protected, Todos } from "@/components";

export function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <div>Home</div>
      <div>{hello.data ? hello.data.greeting : "Loading tRPC query..."}</div>
      <AuthShowcase />
      <Protected>
        <Todos todos={[]} />
      </Protected>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
    </div>
  );
}

export default function Page() {
  return <Home />;
}
