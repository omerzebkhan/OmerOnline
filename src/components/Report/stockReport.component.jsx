import React,{useState,useEffect} from 'react';
import { connect } from 'react-redux';

//import { fetchStockStartAsync } from '../../redux/stock/stock.action';
import { fetchItemStartAsync } from '../../redux/item/item.action';

const StockReport =({
    fetchItemStartAsync,itemData,
    isFetching})=> {
    const [itemInput, setItemInput] = useState("");    
    const [filteredOptionsItem, setFilteredOptionsItem] = useState([]);

    useEffect(() => {
        fetchItemStartAsync();
    }, [fetchItemStartAsync])


    useEffect(() => {
        setFilteredOptionsItem(itemData);
    }, [itemData])

  

    const handleChange = event => {
        //console.log(event);
        if (event.target.id === "Name") {
            setItemInput(event.target.value);
            if (event.target.value === ""){
                setFilteredOptionsItem(itemData);
            }
            else{
                         
              setFilteredOptionsItem(itemData.filter(
                (option) => option.name.toLowerCase().indexOf(itemInput.toLowerCase()) > -1
            ));}
        }
        else if (event.target.id === "Description") {
            //setDescription(event.target.value);
        }
    }

    
        return (
            <div className="submit-form container">

                <h1>Stock Report</h1>
                <form >
                    <div className="form-group">
                        <label htmlFor="Name">Name</label>
                        <input
                            type="text"
                            name="Name"
                            id="Name"
                            placeholder="Name"
                            value = {itemInput}
                            onChange={handleChange} />
            Description
            <input
                            type="text"
                            name="Description"
                            id="Description"
                            placeholder="Description"
                            onChange={handleChange} />
                    </div>
                    
                </form>
                {isFetching ?
                    <div>"Loading data ....."</div> :
                    ""}
                {filteredOptionsItem ?
                    <div>
                        <h3>Stock View</h3>
                        <table border='1'>

                            <thead>
                                <tr>
                                    <th>Item Name</th>
                                    <th>Average Cost</th>
                                    <th>Quantity</th>
                                    <th>Online Qty</th>
                                    <th>Showroom Qty</th>
                                    <th>Warehouse Qty</th>
                                    <th>Online Price</th>
                                    <th>Showroom Price</th>
                                    <th>Online Discount</th>
                                </tr>
                            </thead>

                            <tbody>


                                {
                                    filteredOptionsItem.map((item, index) => (
                                        //   console.log(item);

                                        <tr key={index}
                                        //onClick={() => setActiveBrand(item, index)}
                                        >
                                            <td>{item.name}</td>
                                            <td>{item.averageprice}</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.online}</td>
                                            <td>{item.showroom}</td>
                                            <td>{item.warehouse}</td>
                                            <td>{item.onlineprice}</td>
                                            <td>{item.showroomprice}</td>
                                            <td>{item.onlinediscount}</td>
                                        </tr>
                                    )
                                    )

                                }
                            </tbody>
                        </table>
                    </div>
                    :
                    ""
                }
            </div>
        )
    }


const mapStateToProps = state => ({
    itemData: state.item.items,
    isFetching: state.item.isFetching
})

const mapDispatchToProps = dispatch => ({
    fetchItemStartAsync: () => dispatch(fetchItemStartAsync())
});

export default connect(mapStateToProps, mapDispatchToProps)(StockReport);
