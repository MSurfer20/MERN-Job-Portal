import React, {Component} from 'react';
import {useState} from 'react';
import axios from 'axios';
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Applregister from '../Applicant/Register'
import Register from '../Recruiter/Register'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import FormControl from 'react-bootstrap/FormControl'
const rest_form=[];
let educatin_code=<div></div>;


export default class ApplicantNav extends Component {

    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
    }

    logout(event)
    {
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_type");
        window.location = '/';
    }

    render() {
        return(
        <Navbar bg="light" expand="lg">
  <Navbar.Brand href="#home">UnLinkedIn</Navbar.Brand>
  <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Collapse id="basic-navbar-nav">
    <Nav className="mr-auto">
      <Nav.Link href="/applicant">Home</Nav.Link>
      <Nav.Link href="/applicant/myjobs">My Applications</Nav.Link>
      <Nav.Link href="/applicant/profile">My Profile</Nav.Link>
      <Nav.Link href="/applicant/editprofile">Edit Profile</Nav.Link>
      <Button onClick={this.logout}>Logout</Button>
    </Nav>
  </Navbar.Collapse>
</Navbar>
        )
    }
}