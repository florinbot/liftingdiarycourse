"use client"

import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DatePicker({ selectedDate }: { selectedDate: Date }) {
  const router = useRouter()

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Select Date</CardTitle>
      </CardHeader>
      <CardContent className="p-0 pb-3">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            if (date) {
              router.push(`/dashboard?date=${format(date, "yyyy-MM-dd")}`)
            }
          }}
        />
      </CardContent>
    </Card>
  )
}
