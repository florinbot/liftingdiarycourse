export const dynamic = 'force-dynamic'

import Link from "next/link"
import { format, parseISO } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DatePicker } from "./_components/date-picker"
import { getWorkoutsForDate } from "@/data/workouts"
import { auth } from "@clerk/nextjs/server"
import { SignInButton, SignUpButton } from "@clerk/nextjs"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const { userId } = await auth()

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Sign in to continue</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <p className="text-muted-foreground text-center">
              You need to be signed in to access your dashboard.
            </p>
            <div className="flex gap-3">
              <SignInButton mode="modal">
                <Button>Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="outline">Sign Up</Button>
              </SignUpButton>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { date } = await searchParams
  const selectedDate = date ? parseISO(date) : new Date()

  const workouts = await getWorkoutsForDate(selectedDate)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      <div className="flex gap-6 items-start">
        {/* Left: Calendar */}
        <div className="flex-shrink-0">
          <DatePicker selectedDate={selectedDate} />
        </div>

        {/* Right: Workouts */}
        <div className="flex-1 space-y-4">
          <h2 className="text-lg font-medium">
            Workouts for {format(selectedDate, "do MMM yyyy")}
          </h2>

          {workouts.length === 0 ? (
            <Card>
              <CardContent className="py-16 flex flex-col items-center justify-center gap-4">
                <p className="text-base text-muted-foreground">
                  No workouts logged for this date.
                </p>
                <Button asChild>
                  <Link href={`/dashboard/workout/new?date=${format(selectedDate, "yyyy-MM-dd")}`}>Log a Workout</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            workouts.map((workout) => (
              <Link key={workout.id} href={`/dashboard/workout/${workout.id}`} className="block">
                <Card className="hover:bg-accent transition-colors cursor-pointer">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{workout.name ?? "Workout"}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {workout.workoutExercises.map((we) => (
                        <li key={we.id}>
                          <span className="font-medium">{we.exercise.name}</span>
                          <ul className="ml-4 mt-1 space-y-0.5 text-muted-foreground">
                            {we.sets.map((set) => (
                              <li key={set.id}>
                                Set {set.setNumber}: {set.reps} reps @ {set.weight} {set.weightUnit}
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
