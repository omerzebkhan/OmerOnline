import React, { useState, useEffect, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import { fetchEditSale } from '../../redux/Sale/sale.action';
import { fetchItemStartAsync } from '../../redux/item/item.action';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { checkAccess } from '../../helper/checkAuthorization';

const EditSaleReport = ({
    fetchItemStartAsync,
    itemData = [],
    fetchEditSale,
    editSaleData = [],
    currentUser
}) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [invoiceNo, setInvoiceNo] = useState("");
    const [message, setMessage] = useState("");
    const [access, setAccess] = useState(false);

    // Autocomplete states for Item
    const [itemInput, setItemInput] = useState("");
    const [activeOptionItem, setActiveOptionItem] = useState(0);
    const [showOptionsItem, setShowOptionsItem] = useState(false);
    const [filteredOptionsItem, setFilteredOptionsItem] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null); // selected item object

    // Table data
    const [filteredSale, setFilteredSale] = useState([]);

    useLayoutEffect(() => {
        const hasAccess = checkAccess("SALE RETURN", currentUser?.rights);
        setAccess(hasAccess || true); // Remove || true in production
    }, [currentUser]);

    useEffect(() => {
        fetchItemStartAsync();
    }, [fetchItemStartAsync]);

    // Sync editSaleData from Redux to local state
    useEffect(() => {
        setFilteredSale(editSaleData || []);
    }, [editSaleData]);

    const handleChange = (e) => {
        const { id, value } = e.target;

        if (id === "invoiceNo") {
            setInvoiceNo(value);
        } else if (id === "itemSearch") {
            setItemInput(value);

            if (value.trim() === "") {
                setFilteredOptionsItem([]);
                setShowOptionsItem(false);
                setSelectedItem(null);
                return;
            }

            const filtered = itemData.filter(item =>
                item.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredOptionsItem(filtered);
            setActiveOptionItem(0);
            setShowOptionsItem(true);
        }
    };

    const handleStartDTPicker = (date) => setStartDate(date);
    const handleEndDTPicker = (date) => setEndDate(date);

    const handleSubmit = (e) => {
        e.preventDefault();

        const itemId = selectedItem ? selectedItem.id : "0";
        const inv = invoiceNo.trim() || "0";

        // Better: format date as YYYY-MM-DD for backend consistency
        const formatDate = (date) => {
            const d = new Date(date);
            return d.toISOString().split('T')[0]; // "2025-12-23"
        };

        fetchEditSale(
            formatDate(startDate),
            formatDate(endDate),
            itemId,
            inv
        );
    };

    // Autocomplete key navigation
    const onKeyDownItem = (e) => {
        if (e.keyCode === 13) { // Enter
            if (showOptionsItem && filteredOptionsItem.length > 0) {
                const item = filteredOptionsItem[activeOptionItem];
                selectItem(item);
            }
        } else if (e.keyCode === 38) { // Up arrow
            e.preventDefault();
            if (activeOptionItem > 0) setActiveOptionItem(activeOptionItem - 1);
        } else if (e.keyCode === 40) { // Down arrow
            e.preventDefault();
            if (activeOptionItem < filteredOptionsItem.length - 1) {
                setActiveOptionItem(activeOptionItem + 1);
            }
        } else if (e.keyCode === 27) { // Escape
            setShowOptionsItem(false);
        }
    };

    const selectItem = (item) => {
        setSelectedItem(item);
        setItemInput(item.name);
        setShowOptionsItem(false);
        setFilteredOptionsItem([]);
        setActiveOptionItem(0);
    };

    const onClickItem = (e) => {
        const itemId = e.currentTarget.dataset.id;
        const item = itemData.find(i => i.id == itemId);
        if (item) selectItem(item);
    };

    // Autocomplete dropdown
    let optionListItem = null;
    if (showOptionsItem && itemInput) {
        if (filteredOptionsItem.length > 0) {
            optionListItem = (
                <ul className="options" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {filteredOptionsItem.map((item, index) => (
                        <li
                            key={item.id}
                            className={index === activeOptionItem ? 'option-active' : ''}
                            data-id={item.id}
                            onClick={onClickItem}
                            style={{ cursor: 'pointer' }}
                        >
                            <table className="table table-sm table-bordered table-striped mb-0">
                                <thead className="thead-light">
                                    <tr>
                                        <th>Name</th>
                                        <th>Showroom</th>
                                        <th>Cost</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{item.name}</td>
                                        <td>{item.showroom}</td>
                                        <td>{item.averageprice}</td>
                                        <td>{item.showroomprice}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </li>
                    ))}
                </ul>
            );
        } else {
            optionListItem = (
                <div className="no-options p-2">
                    <em>No items found</em>
                </div>
            );
        }
    }

    return (
        <div className="container mt-4">
            {access ? (
                <div>
                    <h1 className="mb-4">Sale Edit Report</h1>
                    {message && <div className="alert alert-warning">{message}</div>}

                    <form onSubmit={handleSubmit} className="mb-5">
                        <div className="row mb-3">
                            <div className="col-md-3">
                                <label>Start Date</label>
                                <DatePicker
                                    selected={startDate}
                                    onChange={handleStartDTPicker}
                                    className="form-control"
                                    dateFormat="MM/dd/yyyy"
                                />
                            </div>
                            <div className="col-md-3">
                                <label>End Date</label>
                                <DatePicker
                                    selected={endDate}
                                    onChange={handleEndDTPicker}
                                    className="form-control"
                                    dateFormat="MM/dd/yyyy"
                                />
                            </div>
                        </div>

                        <div className="row mb-3 align-items-center position-relative">
                            <div className="col-md-2">
                                <label>Item</label>
                            </div>
                            <div className="col-md-4">
                                <input
                                    type="text"
                                    id="itemSearch"
                                    className="form-control"
                                    placeholder="Search item..."
                                    value={itemInput}
                                    onChange={handleChange}
                                    onKeyDown={onKeyDownItem}
                                    autoComplete="off"
                                />
                                {optionListItem && (
                                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1000, background: 'white', border: '1px solid #ccc', borderTop: 'none' }}>
                                        {optionListItem}
                                    </div>
                                )}
                            </div>
                            <div className="col-md-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Showroom Qty"
                                    value={selectedItem?.showroom || ""}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-2">
                                <label>Invoice No.</label>
                            </div>
                            <div className="col-md-3">
                                <input
                                    type="text"
                                    id="invoiceNo"
                                    className="form-control"
                                    placeholder="Enter invoice number"
                                    value={invoiceNo}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-success">
                            Search
                        </button>
                    </form>

                    {filteredSale.length > 0 ? (
                        <div>
                            <h3>Sale Edit History</h3>
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th>ID</th>
                                            <th>Sale ID</th>
                                            <th>Detail ID</th>
                                            <th>Item Name</th>
                                            <th>Old Price</th>
                                            <th>Old Qty</th>
                                            <th>New Price</th>
                                            <th>New Qty</th>
                                            <th>Final Qty</th>
                                            <th>Before Edit Qty</th>
                                            <th>Comments</th>
                                            <th>Created At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredSale.map((item) => (
                                            <tr key={item.id}>
                                                <td>{item.id}</td>
                                                <td>{item.saleinvoiceid}</td>
                                                <td>{item.saledetailid}</td>
                                                <td>{item.name}</td>
                                                <td>{item.oldprice}</td>
                                                <td>{item.oldqty}</td>
                                                <td>{item.newprice}</td>
                                                <td>{item.newqty}</td>
                                                <td>{item.finalqty}</td>
                                                <td>{item.beforeqty}</td>
                                                <td>{item.comments}</td>
                                                <td>{new Date(item.createdAt).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <p>No data found for the selected criteria.</p>
                    )}
                </div>
            ) : (
                <div className="alert alert-danger">Access denied for this screen.</div>
            )}
        </div>
    );
};

const mapStateToProps = (state) => ({
    currentUser: state.user.user,
    editSaleData: state.sale.editSale || [],
    itemData: state.item.items || [],
});

const mapDispatchToProps = (dispatch) => ({
    fetchEditSale: (sDate, eDate, itemId, invoiceId) =>
        dispatch(fetchEditSale(sDate, eDate, itemId, invoiceId)),
    fetchItemStartAsync: () => dispatch(fetchItemStartAsync()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditSaleReport);