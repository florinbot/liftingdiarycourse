import { db } from "@/db";
import { workouts, workoutExercises, sets } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and, gte, lt, isNull } from "drizzle-orm";

export async function createWorkout(data: {
  name?: string;
  startedAt: Date;
  notes?: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const [workout] = await db
    .insert(workouts)
    .values({
      userId,
      name: data.name,
      startedAt: data.startedAt,
      notes: data.notes,
    })
    .returning();

  return workout;
}

export async function getWorkoutById(workoutId: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.query.workouts.findFirst({
    where: and(
      eq(workouts.id, workoutId),
      eq(workouts.userId, userId),
      isNull(workouts.deletedAt),
    ),
  });
}

export async function updateWorkout(
  workoutId: number,
  data: { name?: string; startedAt: Date; notes?: string }
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const [updated] = await db
    .update(workouts)
    .set({
      name: data.name,
      startedAt: data.startedAt,
      notes: data.notes,
      updatedAt: new Date(),
    })
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)))
    .returning();

  return updated;
}

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
