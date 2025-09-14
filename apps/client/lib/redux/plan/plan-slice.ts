import { createAsyncThunk, createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { MacroSplit, MealType } from '@emagrecer/storage';




type SlotKey = `${number}:${MealType}`; // e.g. "2:dinner"


export interface Slot {
  day: number;
  meal: MealType;
  recipe?: {
    id: string;
    title: string;
    kcalPerServing: number;
    protein: number; carbs: number; fat: number;
  };
  servings: number;
}


export interface PlanState {
  planId?: string;
  weekStart: string;
  kcalTarget?: number | null;
  macroSplit?: MacroSplit | null;
  slotsByKey: Record<SlotKey, Slot>;
  status: 'idle'|'loading'|'ready'|'error';
  error?: string;
  selectedDay: number; // 0..6
}

const initialState: PlanState = {
  weekStart: '',
  slotsByKey: {},
  status: 'idle',
  selectedDay: 0
};






// Async thunks
export const ensurePlan = createAsyncThunk(
  'plan/ensurePlan',
  async (weekStart: string) => {
    const res = await fetch(`/api/plan?week=${weekStart}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('ensurePlan failed');
    return (await res.json()) as { id: string; weekStart: string; kcalTarget: number|null; macroSplit: MacroSplit|null; created: boolean };
  }
);

export const loadSlots = createAsyncThunk(
  'plan/loadSlots',
  async (planId: string) => {
    const res = await fetch(`/api/plan/slots?planId=${planId}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('loadSlots failed');
    return (await res.json()) as { slots: Slot[] };
  }
);

export const setSlot = createAsyncThunk(
  'plan/setSlot',
  async (args: { planId: string; day: number; meal: MealType; recipeId: string; servings: number }) => {
    const res = await fetch(`/api/plan/slots`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(args)
    });
    if (!res.ok) throw new Error('setSlot failed');
    return args;
  }
);

export const clearSlot = createAsyncThunk(
  'plan/clearSlot',
  async (args: { planId: string; day: number; meal: MealType }) => {
    const url = `/api/plan/slots?planId=${args.planId}&day=${args.day}&meal=${args.meal}`;
    const res = await fetch(url, { method: 'DELETE' });
    if (!res.ok) throw new Error('clearSlot failed');
    return args;
  }
);

const planSlice = createSlice({
  name: 'plan',
  initialState,
  reducers: {
    setSelectedDay(state, action: PayloadAction<number>) { state.selectedDay = action.payload; }
  },
  extraReducers: (b) => {
    b.addCase(ensurePlan.pending, (s) => { s.status = 'loading'; s.error = undefined; });
    b.addCase(ensurePlan.fulfilled, (s, a) => {
      s.status = 'ready';
      s.planId = a.payload.id;
      s.weekStart = a.payload.weekStart;
      s.kcalTarget = a.payload.kcalTarget;
      s.macroSplit = a.payload.macroSplit;
    });
    b.addCase(ensurePlan.rejected, (s, a) => { s.status = 'error'; s.error = a.error.message; });

    b.addCase(loadSlots.fulfilled, (s, a) => {
      const map: Record<SlotKey, Slot> = {};
      for (const slot of a.payload.slots) {
        map[`${slot.day}:${slot.meal}`] = slot;
      }
      s.slotsByKey = map;
    });

    b.addCase(setSlot.fulfilled, (s, a) => {
      const { day, meal, servings, recipeId } = a.payload;
      const key = `${day}:${meal}` as SlotKey;
      // optimistic: we don’t know full recipe macros here unless you return them; up to you.
      const existing = s.slotsByKey[key];
      s.slotsByKey[key] = {
        day, meal,
        servings,
        recipe: existing?.recipe && existing.recipe.id === recipeId ? existing.recipe : existing?.recipe // keep if unchanged
      };
    });

    b.addCase(clearSlot.fulfilled, (s, a) => {
      const key = `${a.payload.day}:${a.payload.meal}` as SlotKey;
      delete s.slotsByKey[key];
    });
  }
});
export const { setSelectedDay } = planSlice.actions;
export default planSlice.reducer;



// Selectors
export const selectPlan = (s: { plan: PlanState }) => s.plan;
export const selectDayTotals = (day: number) => createSelector(selectPlan, (p) => {
  let kcal=0, protein=0, carbs=0, fat=0;
  for (const slot of Object.values(p.slotsByKey)) {
    if (slot.day !== day || !slot.recipe) continue;
    const servings = slot.servings ?? 1;
    kcal += Math.round(slot.recipe.kcalPerServing * servings);
    protein += (slot.recipe.protein * servings);
    carbs += (slot.recipe.carbs * servings);
    fat += (slot.recipe.fat * servings);
  }
  return { kcal, protein, carbs, fat };
});
export const selectWeekTotals = createSelector(selectPlan, (p) => {
  let kcal=0, protein=0, carbs=0, fat=0;
  for (const slot of Object.values(p.slotsByKey)) {
    if (!slot.recipe) continue;
    const servings = slot.servings ?? 1;
    kcal += Math.round(slot.recipe.kcalPerServing * servings);
    protein += (slot.recipe.protein * servings);
    carbs += (slot.recipe.carbs * servings);
    fat += (slot.recipe.fat * servings);
  }
  return { kcal, protein, carbs, fat };
});