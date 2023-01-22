import React, { Component, state } from 'react'
import UserService from '../services/UserService'

state={
    searchTerm: ""
    }

class ListUserComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
                users: [],
                userApi:[]
        }
        this.addUser = this.addUser.bind(this);
        this.editUser = this.editUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.viewUser = this.viewUser.bind(this);
    }

    deleteUser(id){
        UserService.deleteUser(id).then( res => {
            this.setState({users: this.state.users.filter(user => user.id !== id)});
        });
        window.location.reload(false)
    }
    viewUser(id){
        this.props.history.push(`/view-user/${id}`);
        window.location.reload(false)
    }
    editUser(id){
        this.props.history.push(`/add-user/${id}`);
        window.location.reload(false)
    }

   componentDidMount(){
        UserService.getUsers().then((res) => {
            if(res.data==null)
            {
                this.props.history.push('/add-user/_add');
            }
            this.setState({ users: res.data});
        });
    }

    addUser(){
        this.props.history.push('/add-user/_add');
        window.location.reload(false)
    }

    sendEmail(){
       UserService.emailUser();
    }

    handleSubmit() {
        console.log("Hitting")
    }

    goBack() {
        window.location.href = "http://localhost:3000/users"
    }

    doingASearch = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    submitSearch = (event) => {
        event.preventDefault();
        this.filterBySearchTerm(this.state.searchTerm)
        this.setState({
            searchTerm: ""
        })
    }

    filterBySearchTerm = (search) => {
        this.setState({
            theLocationFilter: search,
        })
        fetch("http://localhost:5000/getAllData", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accepts": "application/json"
            },
            body: JSON.stringify({
                query: search
            })
        })
            .then(r => r.json())
            .then(theRes => {
                console.log("Logging data:",  theRes?.length)
                console.log("Logging data:",  theRes)
                if (theRes?.length > 0) {
                    this.setState({
                        userApi: theRes,
                        searchTerm: search,
                        filterAll: false,
                        searchRes: theRes.data,
                        isLoading: false
                    })
                }
                else {
                    this.setState({
                        theLocationFilter: search,
                        filterAll: false,
                        isLoading: false,
                        searchError: "No data found"
                    })
                }
            })
    }

    render() {
        if (this.state.userApi.length === 0) {
        return (
            <div>
                <form onSubmit={this.submitSearch}>
                    <label htmlFor="searchTerm">
                        <strong>Search by name/phone/email: </strong>
                        <input type="text" name="searchTerm" value={this.state.searchTerm} onChange={this.doingASearch} />
                        <input type="submit" value="submit" />
                    </label>
                </form>
                 <h2 className="text-center">Users List</h2>
                 <div className = "row">
                    <button className="btn btn-primary" onClick={this.addUser}> Add User</button>
                 </div>
                 <br></br>
                 <div className = "row">
                    <button className="btn btn-primary" onClick={this.sendEmail}> Send Email</button>
                 </div>
                 <br></br>
                 <div className = "row">
                        <table className = "table table-striped table-bordered">

                            <thead>
                                <tr>
                                    <th> User First Name</th>
                                    <th> User Last Name</th>
                                    <th> User Email Id</th>
                                    <th> User Phone Number</th>
                                    <th> User Message</th>
                                    <th> Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.users.map(
                                        user => 
                                        <tr key = {user.id}>
                                             <td> { user.firstName} </td>   
                                             <td> {user.lastName}</td>
                                             <td> {user.emailId}</td>
                                             <td> {user.phoneNumber}</td>
                                             <td> {user.message}</td>
                                             <td>
                                                 <button onClick={ () => this.editUser(user.id)} className="btn btn-info">Update </button>
                                                 <button style={{marginLeft: "10px"}} onClick={ () => this.deleteUser(user.id)} className="btn btn-danger">Delete </button>
                                                 <button style={{marginLeft: "10px"}} onClick={ () => this.viewUser(user.id)} className="btn btn-info">View </button>
                                             </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>

                 </div>
                                </div>
        )};
        return  (
            <div>
                 <div className = "row">
                        <table className = "table table-striped table-bordered">

                            <thead>
                                <tr>
                                    <th> User First Name</th>
                                    <th> User Last Name</th>
                                    <th> User Email Id</th>
                                    <th> User Phone Number</th>
                                    <th> User Message</th>
                                    <th> Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.userApi.map(
                                        userApi => 
                                        <tr key = {userApi.id}>
                                             <td> { userApi.firstName} </td>   
                                             <td> {userApi.lastName}</td>
                                             <td> {userApi.emailId}</td>
                                             <td> {userApi.phoneNumber}</td>
                                             <td> {userApi.message}</td>
                                             <td>
                                                 <button onClick={ () => this.editUser(userApi.id)} className="btn btn-info">Update </button>
                                                 <button style={{marginLeft: "10px"}} onClick={ () => this.deleteUser(userApi.id)} className="btn btn-danger">Delete </button>
                                                 <button style={{marginLeft: "10px"}} onClick={ () => this.viewUser(userApi.id)} className="btn btn-info">View </button>
                                             </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>

                 </div>
                 <br></br>
                <button style={{marginLeft: "500px"}} onClick={ () => this.goBack()} className="btn btn-info">Back </button>
            </div>
                            )
    }
}

export default ListUserComponent