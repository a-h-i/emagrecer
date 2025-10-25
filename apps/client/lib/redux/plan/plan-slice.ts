'use client';
import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  createSelector,
} from '@reduxjs/toolkit';
import {
  MacroSplit,
  MealSlotSchemaType,
  MealSlotSchemaTypeWithRecipe,
  mealSlotSchemaWithRecipe,
  MealType,
  planSchema,
} from '@emagrecer/storage';
import { z } from 'zod';

export type SlotKey = `${number}:${MealType}`; // e.g. "2:dinner"

export interface PlanState {
  planId?: string;
  weekStart: string;
  kcalTarget?: number | null;
  macroSplit?: MacroSplit | null;
  slotsByKey: Record<SlotKey, MealSlotSchemaTypeWithRecipe>;
  status: 'idle' | 'loading' | 'ready' | 'error';
  error?: string;
  selectedDay: number; // 0..6
  isCreated?: boolean;
}

const initialState: PlanState = {
  weekStart: '',
  slotsByKey: {},
  status: 'idle',
  selectedDay: 0,
};

// Async thunks
export const ensurePlan = createAsyncThunk(
  'plan/ensurePlan',
  async (weekStart: Date, thunkAPI) => {
    const res = await fetch(`/api/plan?week=${weekStart.toISOString()}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('ensurePlan failed');
    const json = await res.json();
    const dataSchema = z.object({
      plan: planSchema,
      created: z.boolean(),
    });
    const parsedData =  dataSchema.parse(json);
  thunkAPI.dispatch(loadSlots(parsedData.plan.id));
  return parsedData;
  },
);

export const loadSlots = createAsyncThunk(
  'plan/loadSlots',
  async (planId: string) => {
    const res = await fetch(`/api/plan/${planId}/slots`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('loadSlots failed');
    const json = await res.json();
    const dataSchema = z
      .object({
        slots: z.array(mealSlotSchemaWithRecipe),
      })
      .strict();
    return dataSchema.parse(json);
  },
);

export const setSlot = createAsyncThunk(
  'plan/setSlot',
  async (slot: MealSlotSchemaType) => {
    const res = await fetch(`/api/plan/${slot.plan_id}/slots`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(slot),
    });
    if (!res.ok) {
      throw new Error('setSlot failed');
    }

    const json = await res.json();
    const dataSchema = z
      .object({
        slot: mealSlotSchemaWithRecipe,
      })
      .strict();
    return dataSchema.parse(json);
  },
);

export const clearSlot = createAsyncThunk(
  'plan/clearSlot',
  async (slot: MealSlotSchemaType) => {
    const url = `/api/plan/${slot.plan_id}/slots/${slot.id}`;
    const res = await fetch(url, { method: 'DELETE' });
    if (!res.ok) {
      throw new Error('clearSlot failed');
    }
    return slot;
  },
);

const planSlice = createSlice({
  name: 'plan',
  initialState,
  reducers: {
    setSelectedDay(state, action: PayloadAction<number>) {
      state.selectedDay = action.payload;
    },
    incrementSlotServings(
      state,
      action: PayloadAction<{
        day: number;
        meal: MealType;
        increment: number;
      }>,
    ) {
      const key: SlotKey = `${action.payload.day}:${action.payload.meal}`;
      if (key in state.slotsByKey && action.payload.increment >= 0) {
        const slot = state.slotsByKey[key];
        slot.servings = slot.servings + action.payload.increment;
      }
    },
    decrementSlotServings(
      state,
      action: PayloadAction<{
        day: number;
        meal: MealType;
        decrement: number;
      }>,
    ) {
      const key: SlotKey = `${action.payload.day}:${action.payload.meal}`;
      if (key in state.slotsByKey && action.payload.decrement >= 0) {
        const slot = state.slotsByKey[key];
        const servings = slot.servings;
        slot.servings = Math.max(0, servings - action.payload.decrement);
      }
    },
  },
  extraReducers: (b) => {
    b.addCase(ensurePlan.pending, (s) => {
      s.status = 'loading';
      s.error = undefined;
    });
    b.addCase(ensurePlan.fulfilled, (state, action) => {
      state.status = 'ready';
      state.planId = action.payload.plan.id;
      state.weekStart = action.payload.plan.week_start;
      state.kcalTarget = action.payload.plan.kcal_target;
      state.macroSplit = action.payload.plan.macro_split;
      state.isCreated = action.payload.created;
    });
    b.addCase(ensurePlan.rejected, (s, a) => {
      s.status = 'error';
      s.error = a.error.message;
    });

    b.addCase(loadSlots.fulfilled, (state, action) => {
      const map: Record<SlotKey, MealSlotSchemaTypeWithRecipe> = {};
      for (const slot of action.payload.slots) {
        map[`${slot.day}:${slot.meal}`] = slot;
      }
      state.slotsByKey = map;
    });

    b.addCase(setSlot.fulfilled, (state, action) => {
      const key: SlotKey = `${action.payload.slot.day}:${action.payload.slot.meal}`;
      state.slotsByKey[key] = action.payload.slot;
    });

    b.addCase(clearSlot.fulfilled, (s, a) => {
      const key = `${a.payload.day}:${a.payload.meal}` as SlotKey;
      delete s.slotsByKey[key];
    });
  },
});
export const { setSelectedDay, incrementSlotServings, decrementSlotServings } =
  planSlice.actions;
export default planSlice.reducer;

function macroTotalsFromSlots(slots: MealSlotSchemaTypeWithRecipe[]) {
  let kcal = 0,
    protein = 0,
    carbs = 0,
    fat = 0;

  for (const slot of slots) {
    const servings = slot.servings;
    kcal += Math.round(slot.recipe.kcal_per_serving * servings);
    protein += slot.recipe.protein_g_per_serving * servings;
    carbs += slot.recipe.carbs_g_per_serving * servings;
    fat += slot.recipe.fat_g_per_serving * servings;
  }
  return { kcal, protein, carbs, fat };
}

// Selectors
export const selectPlan = (s: { plan: PlanState }) => s.plan;
export const selectDayTotals = (day: number) =>
  createSelector(selectPlan, (state) => {
    const slots = Object.values(state.slotsByKey).filter(
      (slot) => slot.day == day,
    );
    return macroTotalsFromSlots(slots);
  });
export const selectWeekTotals = createSelector(selectPlan, (p) => {
  const slots = Object.values(p.slotsByKey);
  return macroTotalsFromSlots(slots);
});
