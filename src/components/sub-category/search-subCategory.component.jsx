import React from 'react';
import {connect} from 'react-redux';

import {fetchAllSubCategoryStartAsync} from '../../redux/sub-category/subCategory.actions';
import {fetchCategoryStartAsync} from '../../redux/cateogry/category.actions';
import SubCategoryList from './list-subCategory.component';
import { checkAccess } from '../../helper/checkAuthorization';

class SearchSubCategory extends React.Component { 

    constructor(props) {
        super(props);
        this.state = { 
            content: "",
            access: false,
           
        }
      }
      componentDidMount() {
        this.setState({access:checkAccess("SEARCH SUBCATEGORY",this.props.currentUser.rights) });
        
    }
   
    handleSubmit =  event => {
        event.preventDefault();
            console.log("submit handler of searchBrand ");
            const {fetchAllSubCategoryStartAsync,fetchCategoryStartAsync} = this.props;
            fetchAllSubCategoryStartAsync();
           fetchCategoryStartAsync();

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


    render(){
   return( <div>
    {this.state.access ?
        <div className="submit-form">
            <div className="searchFormHeader"><h1>Search Sub Category</h1></div>
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

           { this.props.SubCategoryData && this.props.categoryDate?(

     
            
        <SubCategoryList 
        subCategory= {this.props.SubCategoryData}
        category = {this.props.categoryDate}
        masterComp={this.props.masterComp} />
        

        ):(
           "")
           }
        </div>
        </div>
        :
        "Access denied for the screen"}
        </div>
       )}
}

const mapStateToProps = state => ({
  SubCategoryData: state.subCategory.subCategory,
  categoryDate :state.category.category,
  isFetching : state.subCategory.isFetching,
  currentUser: state.user.user.user
})

const mapDispatchToProps = dispatch =>({
    fetchAllSubCategoryStartAsync: () => dispatch(fetchAllSubCategoryStartAsync()),
    fetchCategoryStartAsync:() => dispatch(fetchCategoryStartAsync())  
});

export default connect(mapStateToProps,mapDispatchToProps)(SearchSubCategory);
