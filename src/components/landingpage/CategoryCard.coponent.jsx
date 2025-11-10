import React,{useEffect} from 'react';
import {Card} from 'react-bootstrap'
import {connect} from 'react-redux'; 
import {fetchCategoryStartAsync,setCurrentCategory} from '../../redux/cateogry/category.actions';
import {useNavigate } from "react-router-dom";

// import "../App.css"


const CategoryCard = ({
    fetchCategoryStartAsync,
    CategoryData,
    setCurrentCategory}) => {
    const history = useNavigate ();
  

    useEffect(() => {
        fetchCategoryStartAsync();
    }, [fetchCategoryStartAsync])

    return (
        <div className="grid">
           
            {CategoryData ?
            CategoryData.map((item,index) => {
            return( 
                <Card key={index} style={{width:"18rem"}} 
                className="box"
                onClick={()=>{
                console.log("calling item list");
                setCurrentCategory(item.id);
                localStorage.setItem("localCategory",item.id);
                history.push('/ItemList')
                }}>
                  <Card.Img 
                  variant="top" 
                  className="card-img-top"
                  { ...import.meta.env.VITE_S3 === "True" ?
                        {src:`${item.imageUrl}`,alt:"no data",width:"100",height:"100"}
                    :
                        {src:`${import.meta.env.VITE_MIDDLEWARE}/categoriesImages/${item.imageUrl}`,alt:"no data",width:"100",height:"100"}
	            }
                  />
                  <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    {/* <Card.Text>
                        {item.description}    
                    </Card.Text> */}
                  </Card.Body>
                </Card>
            );
            })
            :
            ""    
            }
           
        </div>
    )
}

const mapStateToProps = state => ({
    CategoryData: state.category.category,
})

const mapDispatchToProps = dispatch => ({
    fetchCategoryStartAsync: () => dispatch(fetchCategoryStartAsync()),
    setCurrentCategory:(id) => dispatch(setCurrentCategory(id))

});


export default connect(mapStateToProps, mapDispatchToProps)(CategoryCard);
