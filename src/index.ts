import { createInstance } from './createInstance'
export {
  Instruction,
  InstructingFunction,
  InstructingReducer,
} from './createInstance'

export const {
  instructingAction,
  applyInstructionAction,
  handleInstructions,
  instruct,
} = createInstance()
