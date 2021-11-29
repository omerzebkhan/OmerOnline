import React from 'react';
import { connect } from 'react-redux';

//import { fetchStockStartAsync } from '../../redux/stock/stock.action';
import { fetchItemStartAsync } from '../../redux/item/item.action';

class StockReport extends React.Component {

    handleSubmit = event => {
        event.preventDefault();
        // console.log("submit handler of searchBrand ");
        const { fetchItemStartAsync } = this.props;
        fetchItemStartAsync();
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

    render() {
        return (
            <div className="submit-form container">

                <h1>Stock Report</h1>
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
                    <div>"Loading data ....."</div> :
                    ""}
                { this.props.itemData ?
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
                                    this.props.itemData.map((item, index) => (
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
}

const mapStateToProps = state => ({
    itemData: state.item.items,
    isFetching: state.item.isFetching
})

const mapDispatchToProps = dispatch => ({
    fetchItemStartAsync: () => dispatch(fetchItemStartAsync())
});

export default connect(mapStateToProps, mapDispatchToProps)(StockReport);
