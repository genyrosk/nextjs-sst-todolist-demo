import { useState } from "react";
import { useSession } from "next-auth/react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { api } from "@/utils/api";

import styles from "./todos.module.css";
import type { Todo } from "@prisma/client";

export const Todos = ({ todos: initialTodos }: { todos: Todo[] }) => {
  const { data: sessionData } = useSession();
  const userId = sessionData?.user.id;
  console.log("Todos", { userId });
  const utils = api.useContext();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { data: allTodos } = api.todo.getAll.useQuery(undefined, {
    initialData: initialTodos,
    enabled: false,
  });
  console.log({ allTodos });
  const create = api.todo.create.useMutation({
    async onSuccess(item) {
      await utils.todo.getAll.cancel();
      const previous = utils.todo.getAll.getData() ?? [];
      utils.todo.getAll.setData(undefined, [...previous, item]);
      setTitle("");
      setDescription("");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title,
      description,
    };
    await create.mutateAsync(data);
  };

  const update = api.todo.update.useMutation({
    async onSuccess(item) {
      await utils.todo.getAll.cancel();
      const previous = utils.todo.getAll.getData() ?? [];
      const element = previous.filter((x) => x.id === item.id)[0];
      if (!element) return;
      element.done = item.done;
    },
  });
  const handleToggleCheckbox =
    (id: number, currentValue: boolean) => (e: React.FormEvent) => {
      e.preventDefault();
      console.log("handleToggleCheckbox", { currentValue });
      update.mutate({ id, done: !currentValue });
    };

  return (
    <div className="m-4 p-4">
      <h2 className="text-xl">Todos:</h2>
      <div className="flex flex-col">
        {allTodos?.map((todo) => (
          <div key={todo.id} className={styles.item}>
            <div className="w-8 self-start">
              <input
                type="checkbox"
                checked={todo.done}
                onChange={handleToggleCheckbox(todo.id, todo.done)}
              />
            </div>
            <div>
              <div className="text-base">{todo.title}</div>
              <div className="text-sm">{todo.description}</div>
            </div>
          </div>
        ))}
        <div className={styles.item}>
          <form onSubmit={(e) => void handleSubmit(e)}>
            <input
              className="text-lg"
              name="title"
              type="text"
              placeholder="Title..."
              value={title}
              onChange={(e) => void setTitle(e.target.value)}
            ></input>
            <input
              className="text-md"
              name="description"
              type="text"
              placeholder="Description..."
              value={description}
              onChange={(e) => void setDescription(e.target.value)}
            ></input>
            <button
              type="submit"
              className="btn align-center mt-2 flex self-end bg-sky-500 text-white"
            >
              <PlusIcon className="h-6 w-6 text-white" />
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
