import React, { PropTypes, Component } from 'react'

class CandidateList extends Component {

  render() {
    return (
      <div>
        <label>Candidates</label>
        {
          this.props.items.map(item => {
            return <pre>CandidateListItem</pre>
          })
        }
      </div>
    )
  }

}

CandidateList.propTypes = {
  items: PropTypes.array
}

export default CandidateList
