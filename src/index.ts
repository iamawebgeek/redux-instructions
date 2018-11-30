import { createInstance } from './createInstance'
export {
  Instruction,
  InstructingFunction,
  InstructingReducer,
  InstructingAction,
} from './createInstance'

export const {
  instructingAction,
  applyInstructionAction,
  handleInstructions,
  instruct,
} = createInstance()
