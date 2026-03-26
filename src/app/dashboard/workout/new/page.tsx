import { NewWorkoutForm } from "./_components/new-workout-form";

export default async function NewWorkoutPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Log a Workout</h1>
      <NewWorkoutForm initialDate={date} />
    </div>
  );
}
