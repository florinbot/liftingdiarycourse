"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const mockWorkouts = [
  {
    id: 1,
    name: "Bench Press",
    sets: [
      { reps: 5, weight: 100 },
      { reps: 5, weight: 105 },
      { reps: 5, weight: 110 },
    ],
  },
  {
    id: 2,
    name: "Squat",
    sets: [
      { reps: 5, weight: 140 },
      { reps: 5, weight: 145 },
      { reps: 5, weight: 150 },
    ],
  },
  {
    id: 3,
    name: "Deadlift",
    sets: [
      { reps: 3, weight: 180 },
      { reps: 3, weight: 185 },
    ],
  },
]

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [open, setOpen] = useState(false)

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-52 justify-start gap-2">
            <CalendarIcon className="size-4" />
            {format(selectedDate, "do MMM yyyy")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                setSelectedDate(date)
                setOpen(false)
              }
            }}
          />
        </PopoverContent>
      </Popover>

      <div className="space-y-3">
        <h2 className="text-lg font-medium">
          Workouts for {format(selectedDate, "do MMM yyyy")}
        </h2>
        {mockWorkouts.map((workout) => (
          <Card key={workout.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{workout.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {workout.sets.map((set, index) => (
                  <li key={index}>
                    Set {index + 1}: {set.reps} reps @ {set.weight} kg
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
