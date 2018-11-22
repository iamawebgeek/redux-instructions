import * as uniqid from 'uniqid'
import { Reducer } from 'redux'

const NAMESPACE = '@@instructions'
const applyAction = { type: `${NAMESPACE}/APPLY` }

export type Instruction<T, M = any> = (current: T, modifier: M) => T
export type InstructingReducer<S = any> = Reducer<S> & {
  reducerKey: string
}
export type InstructingFunction<P, M> = (payload: P, meta: M) => void
type Instructions = {
  [key: string]: [Instruction<any>, any][]
}

function isInstructorActionType(type: string) {
  return type === applyAction.type || type.startsWith(`${NAMESPACE}/ACTION/`)
}

export function createInstance() {
  let instructions: Instructions = {}
  function handleInstructions<S>(defaultState: S): InstructingReducer<S> {
    const reducerKey = uniqid()
    const reducer: InstructingReducer<S> = (state = defaultState, { type }) => {
      let awaitingInstructions = instructions[reducerKey]
      if (isInstructorActionType(type) && awaitingInstructions) {
        delete instructions[reducerKey]
        return awaitingInstructions.reduce(
          (currentState, [instruction, modifier]) => {
            return instruction(currentState, modifier)
          },
          state,
        )
      }
      return state
    }
    reducer.reducerKey = reducerKey
    return reducer
  }

  function instruct<S, M>(
    reducer: InstructingReducer<S>,
    instruction: Instruction<S, M>,
    modifier: M,
  ) {
    let key = reducer.reducerKey
    if (!instructions[key]) {
      instructions[key] = []
    }
    instructions[key] = [...instructions[key], [instruction, modifier]]
  }

  function instructingAction<P, M>(instructingFunc: InstructingFunction<P, M>) {
    const type = `${NAMESPACE}/ACTION/${uniqid()}`
    const actionCreator = function(payload: P, meta: M) {
      instructingFunc(payload, meta)
      return {
        type,
        payload,
        meta,
      }
    }
    actionCreator.toString = () => type
    return actionCreator
  }

  function applyInstructionAction() {
    return applyAction
  }

  return {
    instruct,
    handleInstructions,
    applyInstructionAction,
    instructingAction,
  }
}
