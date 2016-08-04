import React, { PropTypes, Component } from 'react'

import CandidateListItem from './../organisms/CandidateListItem.jsx'
import {
  ListGroup
} from 'react-bootstrap'

class CandidateList extends Component {

  render() {
    return (
      <div>
        <label>Candidates</label>
        <ListGroup>
          {
            this.props.candidates.map(item => {
              return <CandidateListItem candidate={item} />
            })
          }
        </ListGroup>
      </div>
    )
  }

}

CandidateList.propTypes = {
  candidates: PropTypes.array,
  items: PropTypes.array
}

export default CandidateList
