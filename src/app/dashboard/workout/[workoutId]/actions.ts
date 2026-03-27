"use server";

import { z } from "zod";
import { updateWorkout } from "@/data/workouts";

const updateWorkoutSchema = z.object({
  workoutId: z.number().int().positive(),
  name: z.string().min(1).max(255).optional(),
  startedAt: z.date(),
  notes: z.string().max(1000).optional(),
});

type UpdateWorkoutParams = z.infer<typeof updateWorkoutSchema>;

export async function updateWorkoutAction(params: UpdateWorkoutParams) {
  const parsed = updateWorkoutSchema.safeParse(params);
  if (!parsed.success) {
    throw new Error("Invalid input");
  }

  const { workoutId, ...data } = parsed.data;
  return updateWorkout(workoutId, data);
}
