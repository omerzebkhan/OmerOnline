import React, { useState, useEffect, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from 'react-bootstrap';

import inventoryService from "../../services/inventory.service";
import { checkAccess } from '../../helper/checkAuthorization';
import { formatPrice } from '../../helper/formatting';


import {
    fetchSaleByDate,
    fetchSaleInvoiceDetailAsync
} from '../../redux/Sale/sale.action';
import {
    fetchUserStartAsync,
    fetchUserByInputAsync
} from '../../redux/user/user.action';
import { fetchItemStartAsync } from '../../redux/item/item.action';

import {
    updateItemStock,
    mapInvoiceDetails,
    submitSaleInvoiceItems,
    deleteSaleDetail,
    deleteSaleInvoice
} from '../../helper/saleHelpers';

const EditSale = ({
    currentUser,
    itemData = [],
    userData = [],
    saleData = [],
    saleInvoiceDetailData = [],
    fetchSaleByDate,
    fetchSaleInvoiceDetailAsync,
    fetchUserByInputAsync,
    fetchUserStartAsync,
    fetchItemStartAsync
}) => {
    const [access, setAccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    // Search
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerInput, setCustomerInput] = useState("");
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [showCustomerOptions, setShowCustomerOptions] = useState(false);
    const [activeCustomerIndex, setActiveCustomerIndex] = useState(0);
    const [searchPerformed, setSearchPerformed] = useState(false);

    // Selected invoice
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [invoiceItems, setInvoiceItems] = useState([]);

    // Editing
    const [isEditing, setIsEditing] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Item autocomplete
    const [itemInput, setItemInput] = useState("");
    const [filteredItems, setFilteredItems] = useState([]);
    const [showItemOptions, setShowItemOptions] = useState(false);
    const [activeItemIndex, setActiveItemIndex] = useState(0);
    const [selectedItem, setSelectedItem] = useState(null);

    const [editQty, setEditQty] = useState("");
    const [editPrice, setEditPrice] = useState("");

    // Confirmation modal
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmMessage, setConfirmMessage] = useState("");

    useLayoutEffect(() => {
        const hasAccess = checkAccess("UPDATE SALE", currentUser?.rights);
        setAccess(hasAccess || true); // Remove || true in production
    }, [currentUser]);

    useEffect(() => {
        fetchUserStartAsync();
        fetchItemStartAsync();
    }, [fetchUserStartAsync, fetchItemStartAsync]);

    // Map invoice details
    useEffect(() => {
        if (saleInvoiceDetailData && saleInvoiceDetailData.length > 0) {
            const mapped = mapInvoiceDetails(saleInvoiceDetailData);
            //console.log("Mapped invoice details:", mapped); 
            setInvoiceItems(mapped);
            console.log("Invoice Items set:", mapped);
        } else {
            setInvoiceItems([]);
        }
    }, [saleInvoiceDetailData]);

    const formatDate = (date) => date.toISOString().split('T')[0];

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchPerformed(true);
        setInvoiceItems([]);
        setSelectedInvoice(null);

        const customerId = selectedCustomer?.id || "0";
        fetchSaleByDate(
            formatDate(startDate),
            formatDate(endDate),
            customerId,
            "0", "0", "0"
        );
    };

    const selectInvoice = (invoice) => {
        setSelectedInvoice(invoice);
        setInvoiceItems([]);
        fetchSaleInvoiceDetailAsync(invoice.saleInvoiceId);
        fetchUserByInputAsync(invoice.customerId);
    };

    const resetInvoiceView = () => {
        setInvoiceItems([]);
        setSelectedInvoice(null);
        setIsEditing(false);
        setEditingItem(null);
        setEditQty("");
        setEditPrice("");
        setItemInput("");
        setSelectedItem(null);

        // Refresh list
        const customerId = selectedCustomer?.id || "0";
        fetchSaleByDate(
            formatDate(startDate),
            formatDate(endDate),
            customerId,
            "0", "0", "0"
        );
    };

    const startEdit = (item) => {
        setIsEditing(true);
        setEditingItem(item);
        setItemInput(item.itemName);
        setEditQty(item.quantity.toString());
        setEditPrice(item.price.toString());
        setSelectedItem(itemData.find(i => i.id === item.itemId));
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setEditingItem(null);
        setEditQty("");
        setEditPrice("");
        setItemInput("");
        setSelectedItem(null);
    };

    const handleUpdate = async () => {
        if (!editingItem || !editQty || !editPrice) return;

        const newQty = parseFloat(editQty);
        const newPrice = parseFloat(editPrice);
        const oldQty = editingItem.quantity;
        const oldPrice = editingItem.price;
        const qtyDiff = oldQty - newQty;

        setLoading(true);
        try {
            // Update stock
            await updateItemStock(editingItem.itemId, qtyDiff);

            // Update sale detail
            await inventoryService.updateSaleDetail(editingItem.detailId, {
                quantity: newQty,
                price: newPrice
            });

            // Recalculate invoice
            await inventoryService.getSaleRecalculate(editingItem.invoiceId);

            // Log edit
            const editSaleData = {
                saleinvoiceid: editingItem.invoiceId,
                saledetailid: editingItem.detailId,
                itemid: editingItem.itemId,
                oldprice: oldPrice,
                oldqty: oldQty,
                newprice: newPrice,
                newqty: newQty,
                finalprice: (oldPrice - newPrice) * oldQty,
                finalqty: 0, // adjust if needed
                beforeqty: oldQty,
                comments: "Edit via UI"
            };
            await inventoryService.createEditSale(editSaleData);

            setMessage("Sale updated successfully!");
            cancelEdit();
            resetInvoiceView();
        } catch (err) {
            setMessage("Error: " + (err.message || "Update failed"));
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDetail = async () => {
        if (!editingItem) return;
        setLoading(true);
        try {
            await deleteSaleDetail(
                editingItem.detailId,
                editingItem.itemId,
                editingItem.quantity,
                editingItem.invoiceId
            );
            setMessage("Sale detail deleted");
            cancelEdit();
            resetInvoiceView();
        } catch (err) {
            setMessage("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteInvoice = async () => {
        setLoading(true);
        try {
            await deleteSaleInvoice({
                saleInvoiceId: selectedInvoice.saleInvoiceId,
                saleInvoiceDetailData
            });
            setMessage("Sale invoice deleted");
            resetInvoiceView();
        } catch (err) {
            setMessage("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const confirm = (action, msg) => {
        setConfirmAction(() => action);
        setConfirmMessage(msg);
        setShowConfirm(true);
    };

    const executeConfirm = async () => {
        setShowConfirm(false);
        await confirmAction();
    };

    // Customer autocomplete
    const handleCustomerInput = (value) => {
        setCustomerInput(value);
        if (!value.trim()) {
            setFilteredCustomers([]);
            setShowCustomerOptions(false);
            return;
        }
        const filtered = (userData.user || []).filter(u =>
            u.roles.toUpperCase() === "CUSTOMER" &&
            u.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredCustomers(filtered);
        setShowCustomerOptions(true);
        setActiveCustomerIndex(0);
    };

    const selectCustomer = (customer) => {
        setSelectedCustomer(customer);
        setCustomerInput(customer.name);
        setShowCustomerOptions(false);
    };

    // Item autocomplete
    const handleItemInput = (value) => {
        setItemInput(value);
        if (!value.trim()) {
            setFilteredItems([]);
            setShowItemOptions(false);
            return;
        }
        const filtered = itemData.filter(i =>
            i.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredItems(filtered);
        setShowItemOptions(true);
        setActiveItemIndex(0);
    };

    const selectItemForEdit = (item) => {
        setSelectedItem(item);
        setItemInput(item.name);
        setShowItemOptions(false);
    };

    if (!access) {
        return <div className="container mt-5 alert alert-danger">Access Denied</div>;
    }

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Edit Sale Invoice</h1>

            {message && (
                <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`}>
                    {message}
                    <button className="btn-close" onClick={() => setMessage("")}></button>
                </div>
            )}

            {loading && (
                <div className="text-center my-4">
                    <div className="spinner-border text-primary"></div>
                </div>
            )}

            {/* Search Form */}
            <div className="card mb-4">
                <div className="card-body">
                    <form onSubmit={handleSearch}>
                        <div className="row g-3">
                            <div className="col-md-3">
                                <label>Start Date</label>
                                <DatePicker selected={startDate} onChange={setStartDate} className="form-control" dateFormat="MM/dd/yyyy" />
                            </div>
                            <div className="col-md-3">
                                <label>End Date</label>
                                <DatePicker selected={endDate} onChange={setEndDate} className="form-control" dateFormat="MM/dd/yyyy" />
                            </div>
                            <div className="col-md-4 position-relative">
                                <label>Customer</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search customer..."
                                    value={customerInput}
                                    onChange={(e) => handleCustomerInput(e.target.value)}
                                />
                                {showCustomerOptions && filteredCustomers.length > 0 && (
                                    <ul className="list-group position-absolute top-100 start-0 end-0 mt-1" style={{ zIndex: 1000 }}>
                                        {filteredCustomers.map((c, i) => (
                                            <li
                                                key={c.id}
                                                className={`list-group-item ${i === activeCustomerIndex ? 'active' : ''}`}
                                                onClick={() => selectCustomer(c)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {c.name} - {c.address}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="col-md-2 d-flex align-items-end">
                                <button type="submit" className="btn btn-success w-100">Search</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Sale List */}
            {searchPerformed && saleData.length > 0 && (
                <div className="card mb-4">
                    <div className="card-header">
                        <h5>Sale Invoices</h5>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Customer</th>
                                    <th>Agent</th>
                                    <th>Value</th>
                                    <th>Items</th>
                                    <th>Outstanding</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {saleData.map(inv => (
                                    <tr key={inv.saleInvoiceId} onClick={() => selectInvoice(inv)} style={{ cursor: 'pointer' }}>
                                        <td>{inv.saleInvoiceId}</td>
                                        <td>{inv.name}</td>
                                        <td>{inv.agentname}</td>
                                        <td>{inv.invoicevalue?.toLocaleString()}</td>
                                        <td>{inv.totalitems}</td>
                                        <td>{inv.Outstanding}</td>
                                        <td>{new Date(inv.date).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Invoice Details */}
            {selectedInvoice && invoiceItems.length > 0 && (
                <div className="card mb-4">
                    <div className="card-header d-flex justify-content-between">
                        <h5>Sale Detail - Invoice #{selectedInvoice.saleInvoiceId}</h5>
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={() => confirm(handleDeleteInvoice, "Delete entire sale invoice? This cannot be undone.")}
                        >
                            Delete Invoice
                        </button>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Item</th>
                                    <th>Desc</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                    <th>Cost</th>
                                    <th>Profit</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoiceItems.map((item, idx) => (
                                    <tr key={item.detailId || idx}>
                                        <td>{idx + 1}</td>
                                        <td>{item.itemName}</td>
                                        <td>{item.description}</td>
                                        <td>{item.quantity}</td>
                                        <td>{formatPrice(item.price)}</td>
                                        <td>{formatPrice(item.price * item.quantity)}</td>
                                        <td>{formatPrice(item.cost * item.quantity)}</td>
                                        <td>{formatPrice(item.profit)}</td>
                                       
                                        <td>
                                            <button className="btn btn-sm btn-primary" onClick={() => startEdit(item)}>
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Edit Form */}
            {isEditing && (
                <div className="card border-primary mb-4">
                    <div className="card-header bg-primary text-white">
                        <h5>Editing: {editingItem.itemName}</h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-6 position-relative">
                                <label>Item</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={itemInput}
                                    onChange={(e) => handleItemInput(e.target.value)}
                                />
                                {showItemOptions && filteredItems.length > 0 && (
                                    <ul className="list-group position-absolute top-100 start-0 end-0 mt-1" style={{ zIndex: 1000 }}>
                                        {filteredItems.map((item, i) => (
                                            <li
                                                key={item.id}
                                                className={`list-group-item ${i === activeItemIndex ? 'active' : ''}`}
                                                onClick={() => selectItemForEdit(item)}
                                            >
                                                {item.name} (Stock: {item.showroom}, Cost: {item.averageprice})
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="col-md-3">
                                <label>New Quantity</label>
                                <input type="number" className="form-control" value={editQty} onChange={(e) => setEditQty(e.target.value)} />
                            </div>
                            <div className="col-md-3">
                                <label>New Price</label>
                                <input type="number" step="0.01" className="form-control" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} />
                            </div>
                        </div>
                        <div className="mt-3">
                            <button className="btn btn-success me-2" onClick={handleUpdate}>Update</button>
                            <button
                                className="btn btn-danger me-2"
                                onClick={() => confirm(handleDeleteDetail, "Delete this sale detail? Stock will be returned.")}
                            >
                                Delete Item
                            </button>
                            <button className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Action</Modal.Title>
                </Modal.Header>
                <Modal.Body>{confirmMessage}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
                    <Button variant="danger" onClick={executeConfirm}>Confirm</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

const mapStateToProps = (state) => ({
    currentUser: state.user.user,
    userData: state.user.users || {},
    itemData: state.item.items || [],
    saleData: state.sale.sale || [],
    saleInvoiceDetailData: state.sale.saleInvoiceDetail || []
});

const mapDispatchToProps = {
    fetchSaleByDate,
    fetchSaleInvoiceDetailAsync,
    fetchUserByInputAsync,
    fetchUserStartAsync,
    fetchItemStartAsync
};

export default connect(mapStateToProps, mapDispatchToProps)(EditSale);