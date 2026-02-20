import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  numeric,
  boolean,
  text,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================================================
// 1. EXERCISE CATALOG - Master list of exercise types
// ============================================================================

export const exerciseCatalog = pgTable(
  'exercise_catalog',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    category: varchar('category', { length: 100 }), // e.g., 'chest', 'legs', 'cardio'
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => ({
    nameIdx: uniqueIndex('exercise_catalog_name_idx').on(table.name),
  })
);

// ============================================================================
// 2. WORKOUTS - Individual workout sessions
// ============================================================================

export const workouts = pgTable(
  'workouts',
  {
    id: serial('id').primaryKey(),
    userId: varchar('user_id', { length: 255 }).notNull(), // Clerk user ID
    name: varchar('name', { length: 255 }),
    startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    isTemplate: boolean('is_template').default(false).notNull(),
    templateId: integer('template_id'), // Reference to another workout used as template
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => ({
    userStartedIdx: index('workouts_user_started_at_idx').on(table.userId, table.startedAt),
    userIdIdx: index('workouts_user_id_idx').on(table.userId),
    templateIdIdx: index('workouts_template_id_idx').on(table.templateId),
  })
);

// ============================================================================
// 3. WORKOUT EXERCISES - Junction table (workouts ↔ exercises)
// ============================================================================

export const workoutExercises = pgTable(
  'workout_exercises',
  {
    id: serial('id').primaryKey(),
    workoutId: integer('workout_id')
      .notNull()
      .references(() => workouts.id, { onDelete: 'cascade' }),
    exerciseId: integer('exercise_id')
      .notNull()
      .references(() => exerciseCatalog.id, { onDelete: 'restrict' }),
    order: integer('order').notNull(), // Order within the workout
    restSeconds: integer('rest_seconds'), // Target rest time between sets
    notes: text('notes'), // Exercise-specific notes for this workout
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => ({
    workoutIdIdx: index('workout_exercises_workout_id_idx').on(table.workoutId),
    exerciseIdIdx: index('workout_exercises_exercise_id_idx').on(table.exerciseId),
    workoutOrderIdx: index('workout_exercises_workout_order_idx').on(table.workoutId, table.order),
  })
);

// ============================================================================
// 4. SETS - Individual set performance data
// ============================================================================

export const sets = pgTable(
  'sets',
  {
    id: serial('id').primaryKey(),
    workoutExerciseId: integer('workout_exercise_id')
      .notNull()
      .references(() => workoutExercises.id, { onDelete: 'cascade' }),
    setNumber: integer('set_number').notNull(), // 1, 2, 3, etc.

    // Strength training fields
    reps: integer('reps'), // Number of repetitions
    weight: numeric('weight', { precision: 8, scale: 2 }), // Weight used
    weightUnit: varchar('weight_unit', { length: 10 }).default('lbs'), // 'lbs' or 'kg'

    // Cardio fields
    distance: numeric('distance', { precision: 8, scale: 2 }), // Distance covered
    distanceUnit: varchar('distance_unit', { length: 10 }), // 'mi', 'km', 'm', etc.
    durationSeconds: integer('duration_seconds'), // Time duration

    // Optional tracking fields
    rpe: numeric('rpe', { precision: 3, scale: 1 }), // Rate of Perceived Exertion (1-10)
    isWarmup: boolean('is_warmup').default(false).notNull(),
    isDropset: boolean('is_dropset').default(false).notNull(),
    isFailure: boolean('is_failure').default(false).notNull(), // Taken to failure
    notes: text('notes'),

    completedAt: timestamp('completed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => ({
    workoutExerciseIdIdx: index('sets_workout_exercise_id_idx').on(table.workoutExerciseId),
    workoutExerciseSetIdx: index('sets_workout_exercise_set_idx').on(
      table.workoutExerciseId,
      table.setNumber
    ),
  })
);

// ============================================================================
// 5. USER PREFERENCES - User-specific settings
// ============================================================================

export const userPreferences = pgTable(
  'user_preferences',
  {
    id: serial('id').primaryKey(),
    userId: varchar('user_id', { length: 255 }).notNull(), // Clerk user ID
    defaultWeightUnit: varchar('default_weight_unit', { length: 10 }).default('lbs').notNull(),
    defaultDistanceUnit: varchar('default_distance_unit', { length: 10 }).default('mi').notNull(),
    restTimerEnabled: boolean('rest_timer_enabled').default(true).notNull(),
    theme: varchar('theme', { length: 20 }).default('system').notNull(), // 'light', 'dark', 'system'
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: uniqueIndex('user_preferences_user_id_idx').on(table.userId),
  })
);

// ============================================================================
// RELATIONS - Define relationships between tables
// ============================================================================

export const exerciseCatalogRelations = relations(exerciseCatalog, ({ many }) => ({
  workoutExercises: many(workoutExercises),
}));

export const workoutsRelations = relations(workouts, ({ many }) => ({
  workoutExercises: many(workoutExercises),
}));

export const workoutExercisesRelations = relations(workoutExercises, ({ one, many }) => ({
  workout: one(workouts, {
    fields: [workoutExercises.workoutId],
    references: [workouts.id],
  }),
  exercise: one(exerciseCatalog, {
    fields: [workoutExercises.exerciseId],
    references: [exerciseCatalog.id],
  }),
  sets: many(sets),
}));

export const setsRelations = relations(sets, ({ one }) => ({
  workoutExercise: one(workoutExercises, {
    fields: [sets.workoutExerciseId],
    references: [workoutExercises.id],
  }),
}));

// ============================================================================
// TYPE EXPORTS - For TypeScript usage
// ============================================================================

export type ExerciseCatalog = typeof exerciseCatalog.$inferSelect;
export type NewExerciseCatalog = typeof exerciseCatalog.$inferInsert;

export type Workout = typeof workouts.$inferSelect;
export type NewWorkout = typeof workouts.$inferInsert;

export type WorkoutExercise = typeof workoutExercises.$inferSelect;
export type NewWorkoutExercise = typeof workoutExercises.$inferInsert;

export type Set = typeof sets.$inferSelect;
export type NewSet = typeof sets.$inferInsert;

export type UserPreference = typeof userPreferences.$inferSelect;
export type NewUserPreference = typeof userPreferences.$inferInsert;
