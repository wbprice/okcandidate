import { combineReducers } from 'redux'

import survey from './survey/survey-reducer'
import candidate from './candidate/candidate-reducer'

export default combineReducers({
  candidate,
  survey
})
