import React from 'react';
import {connect} from 'react-redux';

import ManageSubCategory from './manage-subCategory.component';

import {setCurrentSubCategory} from '../../redux/sub-category/subCategory.actions';

const ListSubCategory =({category,
    subCategory,masterComp,
    setCurrentSubCategory,currentSubCategory
})=>{
  console.log(masterComp);
  console.log(category);
  console.log(subCategory);
  //const [currentBrand,setCurrentBrand] = useState([]);

  const setActiveSubCategory =(subCategory, index) => {
    //update the value in the redux to current brand

    setCurrentSubCategory(subCategory);
   // console.log(currentBrand.length)
  }
    
    return(
        <div>
        <h3>SubCategory View</h3>
        <table border='1'> 
        
          <thead>
            <tr>
            <th>Category</th>  
            <th>Sub Category</th>
            <th>Sub Cat Desc</th>
            <th>Image</th>
            </tr>
            </thead>
          
            <tbody>

           
           {
        subCategory.map((item,index) => (
         //   console.log(item);
        			 
         <tr key={index} 
         onClick={() => setActiveSubCategory(item,index)}
         >
          <td>{
            category.map((it)=>{
             // console.log(`item cat =${item.category} it id =${it.id}`)
             var a ="";
              if (item.category == it.id){
               // console.log(`inside ifitem cat =${item.category} it id =${it.id}`)
               // var a ="";
                a=it.name;
              }
              //console.log(`a = ${a}`)
              return a;
            })
            
            }</td> 

          <td>{item.name}</td>
          <td>{item.description}</td>
          
          <td><img src={`${import.meta.env.VITE_MIDDLEWARE}/subCategoriesImages/${item.imageUrl}`} alt="no data" width="100" height="100" /></td>
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
          { currentSubCategory && !masterComp? (
          //Object.keys(currentBrand).length? (
          //  console.log(Object.keys(currentBrand).length)
            <div>
          <ManageSubCategory currentSubCategory={currentSubCategory}/>

            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a Sub Category...</p>
            </div>
          )}
        </div>
      </div>

    )
}

const mapStateToProps = state => ({
  currentSubCategory: state.subCategory.currentSubCategory
})

const mapDispatchToProps = dispatch => ({
  
  setCurrentSubCategory: (id) => dispatch(setCurrentSubCategory(id))

});

export default connect(mapStateToProps, mapDispatchToProps)(ListSubCategory);