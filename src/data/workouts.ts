import { db } from "@/db";
import { workouts, workoutExercises, sets } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and, gte, lt, isNull } from "drizzle-orm";

export async function getWorkoutsForDate(date: Date) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return db.query.workouts.findMany({
    where: and(
      eq(workouts.userId, userId),
      gte(workouts.startedAt, startOfDay),
      lt(workouts.startedAt, endOfDay),
      isNull(workouts.deletedAt),
    ),
    with: {
      workoutExercises: {
        where: isNull(workoutExercises.deletedAt),
        orderBy: workoutExercises.order,
        with: {
          exercise: true,
          sets: {
            where: isNull(sets.deletedAt),
            orderBy: sets.setNumber,
          },
        },
      },
    },
  });
}
