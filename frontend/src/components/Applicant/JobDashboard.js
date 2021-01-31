import React, {Component} from 'react';
import { useState } from 'react';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Autocomplete from '@material-ui/lab/Autocomplete';
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import SearchIcon from "@material-ui/icons/Search";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Collapse from '@material-ui/core/Collapse'
import StarBorder from '@material-ui/icons/StarBorder'
import ListItemText from '@material-ui/core/ListItemText'
import moment from 'moment'
import Rating from '@material-ui/lab/Rating'
import Fuse from 'fuse.js'
import ApplicantNav from './applicantnavbar'
let applid=localStorage.getItem("user_id");
let fuse="";


class JobDashboard extends Component {


    constructor(props) {
        super(props);
        this.state = {jobs: [],sortedUsers: [], sortDur:true, sortRat:true, sortSal:true, filteredjobs: [], searchfilter: '', typefilter: "All", minsal: '', maxsal: '', durationfilter: ''};
        this.renderIconSal = this.renderIconSal.bind(this);
        this.renderIconDur = this.renderIconDur.bind(this);
        this.renderIconRat = this.renderIconRat.bind(this);
        this.sortChangeRat = this.sortChangeRat.bind(this);
        this.sortChangeDur = this.sortChangeDur.bind(this);
        this.sortChangeSal = this.sortChangeSal.bind(this);
        this.onchangeSearch = this.onchangeSearch.bind(this);
        this.changemax = this.changemax.bind(this);
        this.changemin = this.changemin.bind(this);
        this.typefilterchange = this.typefilterchange.bind(this);
        this.durationfilterchange = this.durationfilterchange.bind(this);
        // this.recruiterids = this.recruiterids.bind(this);
    }

recruiterids(index, event) {
    var institute = this.state.end_year.slice(); // Make a copy of the emails first.
    institute[index] = event.target.value; // Update it with the modified email.
    this.setState({end_year: institute}); // Update the state.
}

applyjob(index, event){
   axios.get('http://localhost:5000/applicant/getcount/'+applid)
    .then((res) => {
        console.log(res.data.count);
        if(res.data.count>=10)
        {
            alert("YOU CAN'T HAVE MORE THAN 10 ACTIVE APPLICATIONS!");
            return;
        }
        console.log(res.data.applications)
        axios.get('http://localhost:5000/applicant/checkaccept/'+applid)
        .then((res1) => {
            console.log(res1.data);
            if(res1.data.accept)
            {
                alert("YOU ALREADY HAVE BEEN ACCEPTED!");
                return;
            }
        var sop = prompt("ENTER SOP");
        console.log("NOOOOOO");
        if(sop==null)return;
        var words=sop.split(" ");
        if(words.length>250){alert("SOP SHOULD BE ATMOST 250 WORDS. TRY AGAIN");}
        else{
        this.setState({sop: sop});
        const UserData = {
                job_id: this.state.filteredjobs[index]._id,
                applicant_id: applid,
                sop: sop,
                recruiter_id: this.state.filteredjobs[index].recruiter_id
            }
            console.log(UserData)
            axios.post('http://localhost:5000/application/create', UserData)
                .then((res)=> {
                    console.log(res.data);
                    window.location = "/applicant";
                })
                .catch(function(res) {
                    alert("Error",res);
                });
    }

    })
    })
}


renderapplybutton(event, jobs)
{
    if(jobs.state == 1)
    {
        return <button>GREEN</button>
    }
    else
    {
        return <button>RED</button>
    }
}

typefilterchange(event) {
    this.setState({typefilter: event.target.value}); // Update the state.
    console.log(this.state.typefilter)
}

durationfilterchange(event) {
    this.setState({durationfilter: event.target.value}); // Update the state.
    console.log(this.state.durationfilter)
}

 onchangeSearch(event) {
        this.setState({ searchfilter: event.target.value });
        console.log(event.target.value);

    }
    changemax(event) {
        this.setState({ minsal: event.target.value });
        console.log(event.target.value);

    }
    changemin(event) {
        this.setState({ maxsal: event.target.value });
        console.log(event.target.value);

    }

    componentDidMount() {
        axios.get('http://localhost:5000/jobs/show/'+applid)
             .then(response => {
                 console.log("RESPPP",response)
                 this.setState({jobs: response.data, sortedUsers:response.data, filteredjobs: response.data});
                 fuse=new Fuse(response.data, {
                            keys: [
                                'title'
                            ]
                            });
             })
             .catch(function(error) {
                 console.log(error);
             })
    }

    filterJobs = (event) => {
        let jobfilter = this.state.searchfilter;
        console.log(jobfilter)
        let filteredjobs=[]
        if(!jobfilter)
        {
            filteredjobs=this.state.jobs;
        }
        else
        {
        // let filteredjobs=this.state.jobs;
        let results=fuse.search(jobfilter);
        console.log(results);
        filteredjobs = results.map(character => character.item);
        }
        filteredjobs = filteredjobs.filter((job) => {
            return ((this.state.typefilter == "All" || job.job_type == this.state.typefilter) && (this.state.minsal=='' || (job.salary>=this.state.minsal && job.salary!='')) && (this.state.maxsal=='' || job.salary<=this.state.maxsal) && ((this.state.durationfilter == "" || job.duration < this.state.durationfilter)))
        })

        console.log(filteredjobs);
        this.setState({
            filteredjobs: filteredjobs
        })

    }

    sortChangeDur(){
/**
 *      Note that this is sorting only at front-end.
 */

        var array = this.state.filteredjobs;
        var flag = !this.state.sortDur;
        array.sort(function(a, b) {
            if(a.duration != undefined && b.duration != undefined){
                return (flag ? (a.duration - b.duration) : (b.duration-a.duration));
            }
            else{
                return 1;
            }
          });
        this.setState({
            filteredjobs:array,
            sortDur:!this.state.sortDur,
        })
    }

    sortChangeSal(){
/**
 *      Note that this is sorting only at front-end.
 */

        var array = this.state.filteredjobs;
        var flag = !this.state.sortSal;
        array.sort(function(a, b) {
            if(a.salary != undefined && b.salary != undefined){
                return (flag ? (a.salary - b.salary) : (b.salary-a.salary));
            }
            else{
                return 1;
            }
          });
        this.setState({
            filteredjobs:array,
            sortSal:!this.state.sortSal,
        })
    }

    sortChangeRat(){
/**
 *      Note that this is sorting only at front-end.
 */

        var array = this.state.filteredjobs;
        var flag = !this.state.sortRat;
        array.sort(function(a, b) {
            if(a.rating != undefined && b.rating != undefined){
                return (flag ? (a.rating - b.rating) : (b.rating-a.rating));
            }
            else{
                return 1;
            }
          });
        this.setState({
            filteredjobs:array,
            sortRat:!this.state.sortRat,
        })
    }


    renderIconSal(){
        if(this.state.sortSal){
            return(
                <ArrowDownwardIcon/>
            )
        }
        else{
            return(
                <ArrowUpwardIcon/>
            )
        }
    }

    renderIconRat(){
        if(this.state.sortRat){
            return(
                <ArrowDownwardIcon/>
            )
        }
        else{
            return(
                <ArrowUpwardIcon/>
            )
        }
    }

    renderIconDur(){
        if(this.state.sortDur){
            return(
                <ArrowDownwardIcon/>
            )
        }
        else{
            return(
                <ArrowUpwardIcon/>
            )
        }
    }

    render() {
        return (
            <div>
            <ApplicantNav/>
                <Grid container>
                <Grid item xs={12} md={3} lg={3}>
                    <List component="nav" aria-label="mailbox folders">
                        <ListItem text>
                                        <h3>Filters</h3>
                        </ListItem>
                    </List>
                </Grid>
                    <Grid item xs={12} md={9} lg={9}>
                    <List component="nav" aria-label="mailbox folders">
                        <TextField value = {this.state.searchfilter} onChange={this.onchangeSearch}
                        id="standard-basic"
                        label="Search"
                        fullWidth={true}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment >
                                    <IconButton onClick = {this.filterJobs}>
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            )}}
                        />
                    </List>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} md={3} lg={3}>
                        <List component="nav" aria-label="mailbox folders">

                            <ListItem button>
                                <form noValidate autoComplete="off">
                                    <label>Salary</label>
                                    <TextField id="standard-basic" value={this.state.minsal} onChange={this.changemax} label="Enter Min" fullWidth={true} />
                                    <TextField id="standard-basic" value={this.state.maxsal} onChange={this.changemin} label="Enter Max" fullWidth={true}/>
                                </form>
                            </ListItem>
                            <Divider />
                            <ListItem button divider>
                                {/* <Autocomplete
                                    id="combo-box-demo"
                                    options={this.state.jobs}
                                    getOptionLabel={(option) => option.name}
                                    style={{ width: 300 }}
                                    renderInput={(params) => <TextField {...params} label="Select Names" variant="outlined" />}
                                /> */}
                                <FormControl>
                                <InputLabel id="demo-simple-select-helper-label">Job Type</InputLabel>
                                <Select
                                labelId="demo-simple-select-helper-label"
                                id="demo-simple-select-helper" onChange = {this.typefilterchange} value={this.state.typefilter}
                                >
                                <MenuItem value={"All"}>All</MenuItem>
                                <MenuItem value={"Part-time"}>Part Time</MenuItem>
                                <MenuItem value={"Full-time"}>Full Time</MenuItem>
                                <MenuItem value={"Work-from-home"}>Work From Home</MenuItem>
                                </Select>
                                </FormControl>
                            </ListItem>
                             <Divider />
                            <ListItem button divider>
                                {/* <Autocomplete
                                    id="combo-box-demo"
                                    options={this.state.jobs}
                                    getOptionLabel={(option) => option.name}
                                    style={{ width: 300 }}
                                    renderInput={(params) => <TextField {...params} label="Select Names" variant="outlined" />}
                                /> */}
                                <FormControl>
                                <InputLabel id="demo-simple-select-helper-label">Duration</InputLabel>
                                <Select
                                labelId="demo-simple-select-helper-label"
                                id="demo-simple-select-helper" onChange = {this.durationfilterchange} value={this.state.durationfilter}
                                >
                                <MenuItem value={''}>Any</MenuItem>
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={2}>2</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                                <MenuItem value={4}>4</MenuItem>
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={6}>6</MenuItem>
                                <MenuItem value={7}>7</MenuItem>
                                </Select>
                                </FormControl>
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid item xs={12} md={9} lg={9}>
                        <Paper>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                            {/* <TableCell> <Button onClick={this.sortChange}>{this.renderIcon()}</Button>Date</TableCell> */}
                                            <TableCell>Title</TableCell>
                                            <TableCell>Recruiter Name</TableCell>
                                            <TableCell> <Button onClick={this.sortChangeSal}>{this.renderIconSal()}</Button>Salary</TableCell>
                                            <TableCell> <Button onClick={this.sortChangeRat}>{this.renderIconRat()}</Button>Rating</TableCell>
                                            <TableCell> <Button onClick={this.sortChangeDur}>{this.renderIconDur()}</Button>Duration</TableCell>
                                            <TableCell>Deadline</TableCell>
                                            <TableCell>Job Type</TableCell>
                                            <TableCell>Apply!</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.filteredjobs.map((job,ind) => (
                                        // <div>
                                        <TableRow key={ind}>
                                            <TableCell>{job.title}</TableCell>
                                            <TableCell>{job.recruiter_id.name}</TableCell>
                                            <TableCell>{job.salary}</TableCell>
                                            <TableCell>
                                            <Rating name="read-only" value={job.rating} precision={0.1} readOnly />
                                            </TableCell>
                                            <TableCell>{job.duration}</TableCell>
                                            <TableCell>{moment(job.deadline).local().format("YYYY-MM-DD HH:mm:ss")}</TableCell>
                                            <TableCell>{job.job_type}</TableCell>
                                            <TableCell>
                                            {
                                                (() => {
                                                    if(job.status==0){return <button className="btn btn-info" onClick={this.applyjob.bind(this, ind)}>APPLY</button>;}
                                                    else if(job.status==1){return <button className="btn btn-success">APPLIED</button>;}
                                                    else if(job.status==-1){return <button className="btn btn-danger">FULL</button>}
                                                }
                                            )()}
                                    {/* <IconButton aria-label="expand row" size="small" onClick={() => prompt("ENTER SOP")}>
                                        {this.state.sop ? <ArrowUpwardIcon></ArrowUpwardIcon> : <ArrowDownwardIcon></ArrowDownwardIcon>}
                                    </IconButton>
                                    <Collapse in={this.state.sop} timeout="auto" unmountOnExit>
                                            <List component="div" disablePadding>
                                                <ListItem button >
                                                <ListItemText inset primary /> AAAAAAAAAAaas
                                                </ListItem>
                                            </List>
                                            </Collapse> */}
                                            </TableCell>
                                        </TableRow>

                                ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                </Grid>
                <div>{this.state.sop}</div>
            </div>
        )
    }
}

export default JobDashboard;