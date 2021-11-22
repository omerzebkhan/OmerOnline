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
    
  // async function getImage  ()  {
  //   console.log('get image is fired');
  //  // setImageData({filename :'filename',path:'directoryPath'});
  // // const imageData ={filename :'filename',path:'directoryPath'};
  //  var imagedata = {
  //   filename :'1.jpg',
  //   path:'\\App\\uploads\\brandsImages\\'
  // };
  // const response = await UploadService.getImage(imagedata)  
  //   .then(response => {
  //     // this.setState({
  //     //   id: response.data.id,
  //     //   name: response.data.name,
  //     //   description: response.data.description,
  //     //   url: response.data.url
  //     // });
  //     console.log(response.status);
  //     //console.log(response.data);
  //     //setImageData(response.data)
  //     //return (response.data)
    
  // })
  // .catch(e => {
  //     console.log(e);
  // });;
  // console.log(`response is sent`);
  // return response;
  // }
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
          //  console.log(`${process.env.REACT_APP_MIDDLEWARE}/${item.imageUrl}`),
        			 
         <tr key={index} 
         onClick={() => setActiveBrand(item,index)}
         >
          <td>{item.name}</td>
          <td>{item.description}</td>
          <td><img src={`${process.env.REACT_APP_MIDDLEWARE}/brandsImages/${item.imageUrl}`} alt="no data" width="100" height="100" /></td>
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