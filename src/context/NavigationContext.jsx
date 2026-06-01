/* eslint-disable react-refresh/only-export-components -- co-locate the useNav hook with its provider */
/**
 * NavigationContext — a tiny stack-based router.
 *
 * A kiosk tablet app doesn't need URL routing; it needs a predictable
 * back-stack and animated screen transitions. Views are plain strings with an
 * optional params object.
 */
import { createContext, useContext, useState, useCallback } from "react";

const NavigationContext = createContext(null);

const HOME = { view: "home", params: {} };

export function NavigationProvider({ children }) {
  const [stack, setStack] = useState([HOME]);

  const navigate = useCallback((view, params = {}) => {
    setStack((s) => [...s, { view, params }]);
  }, []);

  const goBack = useCallback(() => {
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  }, []);

  const reset = useCallback((view = "home", params = {}) => {
    setStack([{ view, params }]);
  }, []);

  const current = stack[stack.length - 1];

  const value = {
    view: current.view,
    params: current.params,
    depth: stack.length,
    canGoBack: stack.length > 1,
    navigate,
    goBack,
    reset,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNav() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error("useNav must be used within a NavigationProvider");
  return ctx;
}
