import React, { PropTypes, Component } from 'react'

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

  render() {
    return (
      <section>
        <Grid>
          <Row>
            <Col sm={5}>
              <Card>
                <CandidateListFilter />
                <CandidateList />
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

CandidateManager.propTypes = {}

export default CandidateManager
