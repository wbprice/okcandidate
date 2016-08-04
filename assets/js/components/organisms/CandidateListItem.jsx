import React, { PropTypes, Component } from 'react'

import {
  ListGroupItem,
  Glyphicon,
  Button
} from 'react-bootstrap'

const style = {
  container: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: '0 -.5em'
  },
  img: {
    margin: '0 .5em'
  },
  labels: {
    flex: 1,
    margin: '0 .5em'
  },
  buttons: {
    fontSize: '1.5em'
  }
}

class CandidateListItem extends Component {

  render() {
    return (
      <ListGroupItem style={style.container}>
        <img
          height="48"
          width="48"
          src={this.props.candidate.photo}
          alt={`${this.props.candidate.name} photo`} />
        <div style={style.labels}>
          <h3 style={{margin: 0, fontSize: '1em'}}>{this.props.candidate.name}</h3>
          <span>
            {`Running for ${this.props.candidate.city} ${this.props.candidate.office}`}
          </span>
        </div>
        <div style={style.buttons}>
          <Button><Glyphicon glyph="edit" /></Button>
          <Button><Glyphicon glyph="trash" /></Button>
        </div>
      </ListGroupItem>
    )
  }

}

CandidateListItem.propTypes = {
  candidate: PropTypes.object
}

export default CandidateListItem
