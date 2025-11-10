import React from 'react';
import {connect} from 'react-redux';
import {setCurrentBrand} from '../../redux/brands/brands.actions';



import ManageBrand from './manage-brand.component';




const ListBrand =({brands,masterComp,setCurrentBrand,currentBrand})=>{
  
  console.log(masterComp);
  console.log(brands);
  //const [currentBrand,setCurrentBrand] = useState([]);


  const setActiveBrand =(brand, index) => {
    //update the value in the redux to current brand
    console.log(brand);
    setCurrentBrand(brand);
   // console.log(currentBrand.length)
  }
    
  
    return(
        <div>
        <h3>Brands View</h3>
        <table border='1' width='100%'> 
        
          <thead>
            <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Image</th>
            </tr>
            </thead>
          
            <tbody>
          
            
           {
        brands.map((item,index) => (
          //  console.log(`${import.meta.env.VITE_APP_MIDDLEWARE}/${item.imageUrl}`),
        			 
         <tr key={index} 
         onClick={() => setActiveBrand(item,index)}
         >
          <td>{item.name}</td>
          <td>{item.description}</td>
          {import.meta.env.VITE_S3 ==="True" ?
          <td><img src={item.imageUrl} alt="no data" width="100" height="100" /></td>
          :
          <td><img src={`${import.meta.env.VITE_MIDDLEWARE}/brandsImages/${item.imageUrl}`} alt="no data" width="100" height="100" /></td>
          }
          
          {masterComp === 'AddItem'?
          <td>select button</td>
          :
          ""
          }</tr>         
                    )
                )
            
            }
        </tbody>  
        </table>
        <div className="col-md-6">
          { currentBrand && !masterComp? (
          //Object.keys(currentBrand).length? (
          //  console.log(Object.keys(currentBrand).length)
            <div>
          <ManageBrand currentBrand={currentBrand}/>

            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a Brand...</p>
            </div>
          )}
        </div>
      </div>

    )
}


const mapStateToProps = state => ({
  currentBrand: state.brand.currentBrand
})

const mapDispatchToProps = dispatch => ({
  
  setCurrentBrand: (id) => dispatch(setCurrentBrand(id))

});

export default connect(mapStateToProps, mapDispatchToProps)(ListBrand);