/* eslint-disable react-refresh/only-export-components -- co-locate the useFamily hook with its provider */
/**
 * FamilyContext — the app's data hub.
 *
 * Wraps the localStorage layer (src/utils/storage.js) in React state so the UI
 * re-renders after mutations. Components never touch storage directly; they
 * read `snapshot` and call the provided actions.
 */
import { createContext, useContext, useState, useCallback, useMemo } from "react";
import * as store from "../utils/storage.js";
import * as engine from "../utils/tasks.js";
import { seedChildTasks } from "../utils/tasks.js";

const FamilyContext = createContext(null);

function buildSnapshot() {
  const data = store.loadData();
  const children = data.children.map((child) => ({
    ...child,
    pet: data.childPets.find((p) => p.childId === child.id) ?? null,
  }));
  return {
    family: data.family,
    familyPet: data.familyPet,
    children,
    onboarded: Boolean(data.family && data.familyPet),
  };
}

export function FamilyProvider({ children }) {
  const [snapshot, setSnapshot] = useState(buildSnapshot);

  const refresh = useCallback(() => setSnapshot(buildSnapshot()), []);

  const actions = useMemo(
    () => ({
      /** Onboard the family: create family record + family pet together. */
      setupFamily({ name, pin, timezone, petType, petName }) {
        store.createFamily({ name, pin, timezone });
        store.createFamilyPet({ petType, petName });
        refresh();
      },
      updateFamily(patch) {
        const res = store.updateFamily(patch);
        refresh();
        return res;
      },
      updateFamilyPet(patch) {
        const res = store.updateFamilyPet(patch);
        refresh();
        return res;
      },
      verifyParentPin: store.verifyParentPin,
      /** Add a child + their personal pet. Returns the child record. */
      addChild(childAttrs, petAttrs) {
        const { child } = store.createChildWithPet(childAttrs, petAttrs);
        seedChildTasks(child.id, child.ageBracket); // starter daily habits
        refresh();
        return child;
      },
      updateChild(id, patch) {
        const res = store.children.update(id, patch);
        refresh();
        return res;
      },
      removeChild(id) {
        const pet = store.getChildPet(id);
        if (pet) store.childPets.remove(pet.id);
        const res = store.children.remove(id);
        refresh();
        return res;
      },
      verifyChildPin: store.verifyChildPin,

      // ── Task engine (each wraps an engine call + refresh) ──
      completeTask(args) {
        const res = engine.completeTask(args);
        refresh();
        return res;
      },
      undoTask(args) {
        const res = engine.undoTask(args);
        refresh();
        return res;
      },
      addKidGoal(childId, attrs) {
        const goal = engine.createKidGoal(childId, attrs);
        refresh();
        return goal;
      },
      approveCompletion(id) {
        const res = engine.approveCompletion(id);
        refresh();
        return res;
      },
      rejectCompletion(id) {
        const res = engine.rejectCompletion(id);
        refresh();
        return res;
      },

      reset() {
        store.resetData();
        refresh();
      },
    }),
    [refresh],
  );

  const value = useMemo(() => ({ ...snapshot, refresh, ...actions }), [snapshot, refresh, actions]);

  return <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>;
}

export function useFamily() {
  const ctx = useContext(FamilyContext);
  if (!ctx) throw new Error("useFamily must be used within a FamilyProvider");
  return ctx;
}
