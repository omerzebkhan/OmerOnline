import React from 'react';
import {connect} from 'react-redux';


import { checkAdmin,checkAccess } from '../../helper/checkAuthorization';
import {fetchBrandStartAsync} from '../../redux/brands/brands.actions';



import BrandList from './list-brand.component';

import "../../App.css";

class SearchBrand extends React.Component { 
    constructor(props) {
        super(props);
        this.state = { 
            content: "",
            access: false,
           
        }
      }
   
    handleSubmit =  event => {
        event.preventDefault();
         
            const {fetchBrandStartAsync} = this.props;
            fetchBrandStartAsync();
    }


    handleChange = event => {
        //console.log(event);
        if (event.target.id === "Name") {
           // setName(event.target.value);
        //    setFileName(event.target.value);
        }
        else if (event.target.id === "Description") {
            //setDescription(event.target.value);
        }
    }

    componentDidMount() {
        checkAdmin().then((r) => {
            //console.log(`check admin return ....${r}`)
            this.setState({content:r});
        });
        this.setState({access:checkAccess("SEARCH BRAND",this.props.currentUser.rights) });
        
    }

    render(){
        return(
        <div >
             {this.state.access ?
                <div>

             <div className="searchFormHeader"><h1>Search Brand</h1></div>
             <div className="searchForm">
            <form onSubmit={this.handleSubmit}>
            <div className="form-group">    
            <label htmlFor="Name">Name</label>
            <input
                    type="text"
                    name="Name"
                    id="Name"
                    placeholder="Name"
                    onChange={this.handleChange} />
            Description
            <input
                    type="text"
                    name="Description"
                    id="Description"
                    placeholder="Description"
                    onChange={this.handleChange} />
             </div>       
                <div >
                    <button className="btn btn-success" type="submit" >Search</button>

                </div>
            </form>
            
            {this.props.isFetching ?
        <div>"Loading data ....."</div>:
        ""}
           { this.props.brandData?
           <BrandList brands={this.props.brandData} masterComp={this.props.masterComp}/>
           :
           ""
           }
        </div>
        </div>
        :
        "Access denied for the screen"}
        </div>
        )}
}


const mapStateToProps = state => ({
  brandData: state.brand.brands,
  isFetching : state.brand.isFetching,
  currentUser: state.user.user.user  
})

const mapDispatchToProps = dispatch =>({
    fetchBrandStartAsync: () => dispatch(fetchBrandStartAsync())  
});

export default connect(mapStateToProps,mapDispatchToProps)(SearchBrand);