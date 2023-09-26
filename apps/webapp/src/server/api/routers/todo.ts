import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import type { PrismaClient } from "@prisma/client";

export const getAllTodos = async (userId: string, db: PrismaClient) => {
  return db.todo.findMany({
    where: { userId },
  });
};

export const todoRouter = createTRPCRouter({
  countAll: publicProcedure.query(async ({ ctx }) => {
    const count = await ctx.db.todo.count();
    return { count };
  }),

  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.todo.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
      });
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return getAllTodos(ctx.session.user.id, ctx.db);
  }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newTodo = await ctx.db.todo.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      return newTodo;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        done: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("update todo", input);
      const { id, ...rest } = input;
      const newTodo = await ctx.db.todo.update({
        where: { id: id },
        data: {
          ...rest,
          updatedAt: new Date(),
        },
      });
      return newTodo;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.todo.delete({
        where: { id: input.id, userId: ctx.session.user.id },
      });
    }),
});
