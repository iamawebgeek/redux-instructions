# redux-instructions
A library that intended to move logic out of reducer to reusable instructions

## Installation
Installing using node package manager. Type the following in your console inside your project directory:
```
npm install redux-instructions --save
```
With yarn:
```
yarn add redux-instructions
```

## Usage
#### Define reusable instructions
```typescript
const add = (state, newObject) => ([ ...state, newObject ])
const update = (state, newObject) => ({...state, ...newObject })

const remove = (state, object) => state
  .filter((stateObj) => stateObj.id !== object.id)
```
#### Create instructed reducer
```typescript
import { handleInstructions } from 'redux-instructions'

export type User = {
  id: number
  name: string
}
export type State = {
  isLoading: boolean
  error: any
}
export const usersReducer = handleInstructions<User[]>([])
export const stateReducer = handleInstructions<State>({
  isLoading: false,
  error: null,
})
```
#### Create instructing action
```typescript
import { instructingAction, instruct } from 'redux-instructions'
// code
const fetchUser = instructingAction<null, { id: number }>(() => {
  instruct(stateReducer, update, { isLoading: true, error: null })
})
```
#### Use instructing action inside component
```typescript
dispatch(fetchUser(null, { id: 1 }))
```
#### Inside your middleware
```typescript
import { instruct, applyInstructionAction } from 'redux-instructions'
// import reducers and instructors
// saga
function* userFetchHandler({ meta }) {
  try {
    const response = call(fetch, `http://localhost/api/${meta.id}`)
    instruct(usersReducer, add, response.data.user)
    instruct(stateReducer, update, { isLoading: false })    
  }
  catch (e) {
    instruct(stateReducer, update, { isLoading: false, error: e })    
  }
  yield put(applyInstructionAction())
}
export default function* () {
  yield takeLatest(fetchUser.toString(), userFetchHandler)
}
```