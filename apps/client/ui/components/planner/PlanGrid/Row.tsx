import { MealType } from '@emagrecer/storage';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  clearSlot,
  decrementSlotServings,
  incrementSlotServings,
  SlotKey,
} from '@/lib/redux/plan/plan-slice';
import clsx from 'clsx';
import { EmptyCell } from '@/ui/components/planner/PlanGrid/EmptyCell';
import { FilledCell } from '@/ui/components/planner/PlanGrid/FilledCell';

interface RowProps {
  meal: MealType;
  label: string;
  selectedDay: number;
  onRecipeAdd: (day: number, meal: MealType) => void;
}

export function Row(props: RowProps) {
  const slotsByKey = useAppSelector((state) => state.plan.slotsByKey);
  const slotIsLoadingByKey = useAppSelector(
    (state) => state.plan.slotIsLoading,
  );
  const dispatch = useAppDispatch();
  return (
    <>
      {/* sticky meal label */}
      <div className='sticky left-0 self-center bg-white p-3 text-sm font-medium text-neutral-700'>
        {props.label}
      </div>

      {/* 7 day cells */}
      {Array.from({ length: 7 }, (_, dayIndex) => {
        const slotKey: SlotKey = `${dayIndex}:${props.meal}`;
        const slot = slotKey in slotsByKey ? slotsByKey[slotKey] : null;
        const isSelectedDay = props.selectedDay === dayIndex;

        return (
          <div
            key={slotKey}
            className={clsx('min-h-24 border-t border-neutral-100 p-2 text-sm outline-none min-w-40', {
              'bg-neutral-50': isSelectedDay,
              'bg-white': !isSelectedDay,
            })}
          >
            {slot == null ? (
              <EmptyCell
                onRecipeAdd={() => props.onRecipeAdd(dayIndex, props.meal)}
              />
            ) : (
              <FilledCell
                slot={slot}
                isLoading={slotIsLoadingByKey[slotKey]}
                onInc={() =>
                  dispatch(
                    incrementSlotServings({
                      meal: slot.meal,
                      day: slot.day,
                      increment: 1,
                    }),
                  )
                }
                onDec={() =>
                  dispatch(
                    decrementSlotServings({
                      meal: slot.meal,
                      day: slot.day,
                      decrement: 1,
                    }),
                  )
                }
                onClear={() => dispatch(clearSlot(slot))}
              />
            )}
          </div>
        );
      })}
    </>
  );
}
