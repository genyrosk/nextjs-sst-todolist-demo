import { getServerSession } from "next-auth";
import type { GetServerSideProps } from "next";
import type { Todo } from "@prisma/client";

import { authOptions } from "@/server/auth";
import { db } from "@/server/db";
import { getAllTodos } from "@/server/api/routers/todo";
import { Todos } from "@/components";

const Page = ({ todosRaw }: { todosRaw: string }) => {
  const todos = JSON.parse(todosRaw) as Todo[];
  return (
    <div>
      <Todos todos={todos} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const userId = session?.user.id;
  const todos = userId ? await getAllTodos(userId, db) : [];

  console.log("getServerSideProps", todos);

  return {
    props: {
      todosRaw: JSON.stringify(todos),
    },
  };
};

export default Page;
