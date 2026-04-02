import { notFound } from "next/navigation";
import { getWorkoutById } from "@/data/workouts";
import { EditWorkoutForm } from "./_components/edit-workout-form";

export default async function EditWorkoutPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { workoutId } = await params;
  const id = parseInt(workoutId, 10);

  if (isNaN(id)) notFound();

  const workout = await getWorkoutById(id);

  if (!workout) notFound();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Edit Workout</h1>
      <EditWorkoutForm workout={workout} />
    </div>
  );
}
