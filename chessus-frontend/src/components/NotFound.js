import React, { Component } from 'react'
import { Container, Button } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import { Link } from 'react-router-dom'

class NotFound extends Component {
  render () {
    return <Container text textAlign='center'>
      <h1>Sorry, we couldn't find a page here!</h1>
      <Button as={Link} to='/'>Back to home</Button>
    </Container>
  }
}

export default NotFound