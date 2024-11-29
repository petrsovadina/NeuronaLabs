import * as React from "react"
import { type VariantProps } from "class-variance-authority"

const TOAST_LIMIT = 3
const TOAST_REMOVE_DELAY = 1000

type ToastVariant = "default" | "destructive"

interface Toast {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: ToastVariant
}

type ToastActionElement = React.ReactElement<
  typeof ToastAction,
  string | React.JSXElementConstructor<any>
>

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type State = {
  toasts: Toast[]
}

type Action =
  | {
      type: typeof actionTypes.ADD_TOAST
      toast: Toast
    }
  | {
      type: typeof actionTypes.DISMISS_TOAST
      toastId?: Toast["id"]
    }
  | {
      type: typeof actionTypes.REMOVE_TOAST
      toastId?: Toast["id"]
    }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action

      return {
        ...state,
        toasts: state.toasts.map((toast) =>
          toast.id === toastId ? { ...toast, open: false } : toast
        ),
      }
    }
    case actionTypes.REMOVE_TOAST:
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = {
  toasts: [],
}

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

function toast({
  title,
  description,
  variant = "default",
  action,
}: Omit<Toast, "id">) {
  const id = genId()

  const update = (props: Toast) =>
    dispatch({
      type: actionTypes.UPDATE_TOAST,
      toast: { ...props, id },
    })

  const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id })

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      id,
      title,
      description,
      open: true,
      variant,
      action,
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>({ toasts: [] })

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
  }
}

export { useToast, toast }
