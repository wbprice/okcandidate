import React, { PropTypes, Component } from 'react'

import { connect } from 'react-redux'

import CandidateList from './../organisms/CandidateList.jsx'
import CandidateListFilter from './../organisms/CandidateListFilter.jsx'
import NewCandidateForm from './../organisms/NewCandidateForm.jsx'

import {
  Col,
  Row,
  Grid
} from 'react-bootstrap'

import Card from './../atoms/Card.jsx'

class CandidateManager extends Component {

  getList() {
    return this.props.candidate.items
  }

  render() {

    const candidates = this.getList()

    return (
      <section>
        <Grid>
          <Row>
            <Col sm={5}>
              <Card>
                <CandidateListFilter />
                <CandidateList candidates={candidates} />
              </Card>
            </Col>
            <Col sm={7}>
              <Card>
                <NewCandidateForm />
              </Card>
            </Col>
          </Row>
        </Grid>
      </section>

    )
  }

}

CandidateManager.propTypes = {
  dispatch: PropTypes.func,
  candidate: PropTypes.object
}

export default connect(
  state => ({
    candidate: state.candidate
  })
)(CandidateManager)
