import React, { PropTypes, Component } from 'react'

import CandidateList from './../organisms/CandidateList.jsx'
import CandidateListFilter from './../organisms/CandidateListFilter.jsx'
import NewCandidateForm from './../organisms/NewCandidateForm.jsx'

import {
  Col,
  Row,
  Grid
} from 'react-bootstrap'

class CandidateManager extends Component {

  render() {
    return (
      <section>
        <Grid>
          <Row>
            <Col sm={5}>
              <CandidateListFilter />
              <CandidateList />
            </Col>
            <Col sm={7}>
              <NewCandidateForm />
            </Col>
          </Row>
        </Grid>
      </section>

    )
  }

}

CandidateManager.propTypes = {}

export default CandidateManager
