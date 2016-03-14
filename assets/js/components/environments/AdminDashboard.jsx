import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import {
  setAdminDashboardMood
} from './../../redux/admin/admin-actions'

import QuestionBuilder from './../ecosystems/QuestionBuilder.jsx'
import SurveyBuilder from './../ecosystems/SurveyBuilder.jsx'

class AdminDashboard extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.dispatch(setAdminDashboardMood('Fine, thanks for asking.'))
  }

  render() {
    return (
      <article>
        <h1>Admin Dashboard</h1>

        <SurveyBuilder
          surveyBuilder={this.props.surveyBuilder}
          dispatch={this.props.dispatch} />

        <QuestionBuilder
          questionBuilder={this.props.questionBuilder}
          dispatch={this.props.dispatch} />

      </article>
    )
  }
}

AdminDashboard.propTypes = {
  surveyBuilder: PropTypes.object,
  questionBuilder: PropTypes.object,
  admin: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(
  state => ({
    admin: state.admin,
    questionBuilder: state.questionBuilder,
    surveyBuilder: state.surveyBuilder
  })
)(AdminDashboard)
