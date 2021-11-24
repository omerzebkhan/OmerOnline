import React from 'react';
import {connect} from 'react-redux';

import ManageCategory from './manage-category.component';
import {setCurrentCategory} from '../../redux/cateogry/category.actions';


const ListBrand =({
  categories,
  masterComp,
  setCurrentCategory,
  currentCategory})=>{
  console.log(categories);
  //const [currentBrand,setCurrentBrand] = useState([]);
  const setActiveCategory =(category, index) => {
    //update the value in the redux to current brand
    setCurrentCategory(category);
   // console.log(currentBrand.length)
  }
    
    return(
        <div>
        <h3>Category View</h3>
        <table border='1'>         
          <thead>
            <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Image</th>
            </tr>
            </thead>
            <tbody>
           {
        categories.map((item,index) => (
         //   console.log(item); 
         <tr key={index} 
         onClick={() => setActiveCategory(item,index)}>
          <td>{item.name}</td>
          <td>{item.description}</td>
          { process.env.REACT_APP_S3 ==="True" ?
          <td><img src={item.imageUrl} alt="no data" width="100" height="100" /></td>
          :
          <td><img src={`${process.env.REACT_APP_MIDDLEWARE}/categoriesImages/${item.imageUrl}`} alt="no data" width="100" height="100" /></td>
          }
          {masterComp === 'AddItem'?
          <td>select button</td>
          :
          ""
          }
         </tr>         
                    )
                )
            
            }
        </tbody>  
        </table>
        <div className="col-md-6">
          { currentCategory && !masterComp? (
            <div>
          <ManageCategory currentCategory={currentCategory}/>
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a Category...</p>
            </div>
          )}
        </div>
      </div>

    )
}

const mapStateToProps = state => ({
  currentCategory: state.category.currentCategory
})

const mapDispatchToProps = dispatch => ({
  
  setCurrentCategory: (id) => dispatch(setCurrentCategory(id))

});

export default connect(mapStateToProps, mapDispatchToProps)(ListBrand);