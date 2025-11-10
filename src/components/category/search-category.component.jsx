import React from 'react';
import {connect} from 'react-redux';

import {fetchCategoryStartAsync} from '../../redux/cateogry/category.actions';
import { checkAdmin,checkAccess } from '../../helper/checkAuthorization';

import categoryService from "../../services/category.services";
import CategoryList from './list-category.component';


class SearchCategory extends React.Component { 
    constructor(props) {
        super(props);
        this.state = { 
            content: "",
            access: false,
           
        }
      }

      componentDidMount() {
        checkAdmin().then((r) => {
            //console.log(`check admin return ....${r}`)
            this.setState({content:r});
        });
        this.setState({access:checkAccess("SEARCH CATEGORY",this.props.currentUser.rights) });
        
    }


    handleSubmit =  event => {
        event.preventDefault();
        const {fetchCategoryStartAsync} = this.props;
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
        return(
            <div>
            {this.state.access ?
            <div className="submit-form">
            <div className="searchFormHeader"><h1>Search Categories</h1></div>
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
           { this.props.categoryData?
           <CategoryList categories={this.props.categoryData} masterComp={this.props.masterComp}/>
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
    categoryData: state.category.category,
    isFetching : state.category.isFetching,
    currentUser: state.user.user.user 
  })
  
  const mapDispatchToProps = dispatch =>({
      fetchCategoryStartAsync: () => dispatch(fetchCategoryStartAsync())  
  });
  
  export default connect(mapStateToProps,mapDispatchToProps)(SearchCategory);
  