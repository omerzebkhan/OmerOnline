import React from 'react';
import { connect } from 'react-redux';



import { fetchItemStartAsync, setCurrentItem } from '../../redux/item/item.action';
import AddItem from './additem.component';

const SearchItem = ({fetchItemStartAsync,setCurrentItem,itemData,isFetching,errorMessage,
    currentItem}) =>{


   const  handleSubmit = (event) => {
        event.preventDefault();
        //const { fetchItemStartAsync } = this.props;
        fetchItemStartAsync();
    }

    
        return (
            <div>
                <div className="searchFormHeader"><h1>Search Items</h1></div>
                <div className="searchForm">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="Name">Name</label>
                            <input
                                type="text"
                                name="Name"
                                id="Name"
                                placeholder="Name"
                                 />
            Description
            <input
                                type="text"
                                name="Description"
                                id="Description"
                                placeholder="Description"
                                 />
                        </div>
                        <div >
                            <button className="btn btn-success" type="submit" >Search</button>

                        </div>
                    </form>
                    {isFetching ? <div className="alert alert-warning" role="alert">loading....</div> : ''}
                    {errorMessage ? <div className="alert alert-danger" role="alert">{errorMessage}</div> : ""}

                    {itemData ?
                        //    <BrandList brands={this.props.brandData} masterComp={this.props.masterComp}/>
                        //console.log(this.props.itemData)
                        <div>
                            <h3>Item View</h3>
                            <table border='1'>

                                <thead>
                                    <tr  >
                                        <th>Name</th>
                                        <th>Description</th>
                                        <th>Average Cost</th>
                                        <th>Quantity</th>
                                        <th>Online Qty</th>
                                        <th>Showroom Qty</th>
                                        <th>Warehouse Qty</th>
                                        <th>Online Price</th>
                                        <th>Showroom Price</th>
                                        <th>Online Discount</th>
                                        <th>Image</th>
                                    </tr>
                                </thead>

                                <tbody>


                                    {itemData ?
                                        itemData.map((item, index) => (
                                            //   console.log(item);

                                            <tr key={index}
                                                onClick={() => 
                                                    {console.log(`item is selected....`)
                                                    setCurrentItem(item)
                                                }}
                                            
                                            >
                                                <td>{item.name}</td>
                                                <td>{item.description}</td>
                                                <td>{item.averageprice}</td>
                                                <td>{item.quantity}</td>
                                                <td>{item.online}</td>
                                                <td>{item.showroom}</td>
                                                <td>{item.warehouse}</td>
                                                <td>{item.onlineprice}</td>
                                                <td>{item.showroomprice}</td>
                                                <td>{item.onlinediscount}</td>
                                                <td><img src={`${process.env.REACT_APP_MIDDLEWARE}/itemsImages/${item.imageUrl}`} alt="no data" width="100" height="100" /></td>
                                            </tr>
                                        )
                                        )
                                        :
                                        "no data found"

                                    }
                                </tbody>
                            </table>
                        </div>
                        :
                        ""}
                    <div className="col-md-12">
                        {currentItem ? (
                            //Object.keys(currentBrand).length? (
                            //  console.log(Object.keys(currentBrand).length)
                            <div>
                                <AddItem selectedItem={currentItem} />

                            </div>
                        ) : (
                                <div>
                                    <br />
                                    <p> No current Item Please click on a Item...</p>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        )
    }


const mapStateToProps = state => ({
    itemData: state.item.items,
    isFetching: state.item.isFetching,
    errorMessage: state.item.errorMessage,
    currentItem : state.item.currentItem
})

const mapDispatchToProps = dispatch => ({
    fetchItemStartAsync: () => dispatch(fetchItemStartAsync()),
    setCurrentItem: (id) => dispatch(setCurrentItem(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchItem);
