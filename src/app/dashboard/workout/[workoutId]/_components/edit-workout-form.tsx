"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateWorkoutAction } from "../actions";
import type { Workout } from "@/db/schema";

export function EditWorkoutForm({ workout }: { workout: Workout }) {
  const router = useRouter();
  const [name, setName] = useState(workout.name ?? "");
  const [startedAt, setStartedAt] = useState(
    new Date(workout.startedAt).toISOString().slice(0, 16)
  );
  const [notes, setNotes] = useState(workout.notes ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await updateWorkoutAction({
        workoutId: workout.id,
        name: name.trim() || undefined,
        startedAt: new Date(startedAt),
        notes: notes.trim() || undefined,
      });
      router.push("/dashboard");
    } catch {
      setError("Failed to update workout. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Edit Workout</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name (optional)</Label>
            <Input
              id="name"
              placeholder="e.g. Morning Push"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={255}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="startedAt">Date &amp; Time</Label>
            <Input
              id="startedAt"
              type="datetime-local"
              value={startedAt}
              onChange={(e) => setStartedAt(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any notes about this workout..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={1000}
              rows={4}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
