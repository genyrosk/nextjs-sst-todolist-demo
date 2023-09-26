import { Protected } from "@/components";

export default function Page() {
  return (
    <Protected>
      <div>This route is protected</div>
    </Protected>
  );
}
