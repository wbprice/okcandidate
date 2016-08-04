import candidates from './mock-candidates'

const intitialState = {
  items: candidates,
  newCandidate: {}
}

export default function candidateReducer(state = intitialState, action) {

  switch (action.type) {

  default:
    return state

  }

}
