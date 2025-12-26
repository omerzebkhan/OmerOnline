import React, { useState, useEffect, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";

import inventoryService from "../../services/inventory.service";
import itemService from "../../services/item.services";
import { checkAccess } from '../../helper/checkAuthorization';

import {
    fetchPurchaseByDate,
    fetchPurchaseInvoiceDetailAsync
} from '../../redux/purchase/purchase.action';
import {
    fetchUserStartAsync,
    fetchUserByInputAsync
} from '../../redux/user/user.action';
import { fetchItemStartAsync } from '../../redux/item/item.action';

const EditPurchase = ({
    currentUser,
    itemData = [],
    userData = [],
    purchaseData = [],
    purchaseInvoiceDetailData = [],
    fetchPurchaseByDate,
    fetchPurchaseInvoiceDetailAsync,
    fetchUserByInputAsync,
    fetchUserStartAsync,
    fetchItemStartAsync
}) => {
    const [access, setAccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    // Search filters
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [supplierInput, setSupplierInput] = useState("");
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);
    const [showSupplierOptions, setShowSupplierOptions] = useState(false);
    const [activeSupplierIndex, setActiveSupplierIndex] = useState(0);

    // Selected invoice
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [invoiceItems, setInvoiceItems] = useState([]);

    // Editing state
    const [isEditing, setIsEditing] = useState(false);
    const [editingItem, setEditingItem] = useState(null); // { detailId, itemId, oldQty, oldPrice, ... }

    // Item autocomplete
    const [itemInput, setItemInput] = useState("");
    const [filteredItems, setFilteredItems] = useState([]);
    const [showItemOptions, setShowItemOptions] = useState(false);
    const [activeItemIndex, setActiveItemIndex] = useState(0);
    const [selectedItem, setSelectedItem] = useState(null);

    const [editQty, setEditQty] = useState("");
    const [editPrice, setEditPrice] = useState("");

    useLayoutEffect(() => {
        const hasAccess = checkAccess("UPDATE PURCHASE", currentUser?.rights);
        setAccess(hasAccess || true); // Remove || true in production
    }, [currentUser]);

    useEffect(() => {
        fetchUserStartAsync();
        fetchItemStartAsync();
    }, [fetchUserStartAsync, fetchItemStartAsync]);

    // Load invoice details when selected
    useEffect(() => {
        if (purchaseInvoiceDetailData && purchaseInvoiceDetailData.length > 0) {
            const items = purchaseInvoiceDetailData.map(d => ({
                detailId: d.id,
                invoiceId: d.purchaseInvoiceId,
                itemId: d.itemId,
                itemName: d.items.name,
                description: d.items.description,
                quantity: d.quantity,
                price: d.price,
                total: d.price * d.quantity,
                isNew: false
            }));
            setInvoiceItems(items);
        } else {
            setInvoiceItems([]);
        }
    }, [purchaseInvoiceDetailData]);

    const formatDate = (date) => date.toISOString().split('T')[0];

    const handleSearch = (e) => {
        e.preventDefault();
        const supplierId = selectedSupplier?.id || "0";
        fetchPurchaseByDate(formatDate(startDate), formatDate(endDate), supplierId);
    };

    const selectInvoice = (invoice) => {
        setSelectedInvoice(invoice);
        setInvoiceItems([]);
        fetchPurchaseInvoiceDetailAsync(invoice.id);
        fetchUserByInputAsync(invoice.supplierId);
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
        setItemInput("");
        setEditQty("");
        setEditPrice("");
        setSelectedItem(null);
    };

    const updateRecord = async () => {
        if (!editingItem || !editQty || !editPrice) return;

        const newQty = parseFloat(editQty);
        const newPrice = parseFloat(editPrice);
        const oldQty = editingItem.quantity;
        const oldPrice = editingItem.price;
        const qtyDiff = oldQty - newQty;

        setLoading(true);
        try {
            // 1. Update Purchase Detail
            await inventoryService.updatePurchaseDetail(editingItem.detailId, {
                quantity: newQty,
                price: newPrice
            });

            // 2. Recalculate Invoice
            await inventoryService.getPurchaseRecalculate(editingItem.invoiceId);

            // 3. Update Item Stock & Average Price
            const itemRes = await itemService.get(editingItem.itemId);
            const item = itemRes.data;

            let newAvgPrice = item.averageprice;
            if (item.quantity > 0 && qtyDiff !== 0) {
                // Remove old cost contribution and adjust
                const totalOldCost = item.averageprice * item.quantity;
                const removedCost = oldPrice * oldQty;
                const remainingCost = totalOldCost - removedCost;
                const remainingQty = item.quantity - oldQty;

                if (remainingQty > 0) {
                    newAvgPrice = remainingCost / remainingQty;
                } else {
                    newAvgPrice = newPrice; // if all quantity removed
                }
            }

            await itemService.update(editingItem.itemId, {
                quantity: item.quantity - qtyDiff,
                showroom: item.showroom - qtyDiff,
                averageprice: parseFloat(newAvgPrice.toFixed(2))
            });

            // 4. Log Edit
            await inventoryService.createEditPurchase({
                purchaseinvoiceid: editingItem.invoiceId,
                purchasedetailid: editingItem.detailId,
                itemid: editingItem.itemId,
                oldprice: oldPrice,
                oldqty: oldQty,
                newprice: newPrice,
                newqty: newQty,
                finalqty: item.quantity - qtyDiff,
                beforeqty: item.quantity,
                comments: "Edit via UI"
            });

            setMessage("Purchase updated successfully!");
            cancelEdit();
            selectInvoice(selectedInvoice); // Refresh
        } catch (err) {
            setMessage("Error updating purchase: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    // Autocomplete handlers (Supplier)
    const handleSupplierInput = (value) => {
        setSupplierInput(value);
        if (!value.trim()) {
            setFilteredSuppliers([]);
            setShowSupplierOptions(false);
            return;
        }
        const filtered = (userData.user || []).filter(u =>
            u.roles.toUpperCase() === "SUPPLIER" &&
            u.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredSuppliers(filtered);
        setShowSupplierOptions(true);
        setActiveSupplierIndex(0);
    };

    const selectSupplier = (supplier) => {
        setSelectedSupplier(supplier);
        setSupplierInput(supplier.name);
        setShowSupplierOptions(false);
    };

    // Autocomplete handlers (Item)
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
            <h1 className="mb-4">Edit Purchase Invoice</h1>
            {message && <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`}>{message}</div>}
            {loading && <div className="text-center my-4"><div className="spinner-border text-primary"></div></div>}

            {/* Search Form */}
            <form onSubmit={handleSearch} className="card p-4 mb-4">
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
                        <label>Supplier</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search supplier..."
                            value={supplierInput}
                            onChange={(e) => handleSupplierInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && filteredSuppliers[activeSupplierIndex]) {
                                    selectSupplier(filteredSuppliers[activeSupplierIndex]);
                                }
                            }}
                        />
                        {showSupplierOptions && filteredSuppliers.length > 0 && (
                            <ul className="list-group position-absolute top-100 start-0 end-0 mt-1" style={{ zIndex: 1000 }}>
                                {filteredSuppliers.map((s, i) => (
                                    <li
                                        key={s.id}
                                        className={`list-group-item ${i === activeSupplierIndex ? 'active' : ''}`}
                                        onClick={() => selectSupplier(s)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {s.name} - {s.address}
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

            {/* Purchase List */}
            {purchaseData.length > 0 && (
                <div className="card mb-4">
                    <div className="card-header"><h3>Purchase Invoices</h3></div>
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>Ref Invoice</th>
                                    <th>ID</th>
                                    <th>Supplier</th>
                                    <th>Items</th>
                                    <th>Value</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {purchaseData.map(inv => (
                                    <tr key={inv.id} onClick={() => selectInvoice(inv)} style={{ cursor: 'pointer' }}>
                                        <td>{inv.reffInvoice}</td>
                                        <td>{inv.id}</td>
                                        <td>{inv.suppliers?.name}</td>
                                        <td>{inv.totalitems}</td>
                                        <td>{inv.invoicevalue?.toLocaleString()}</td>
                                        <td>{new Date(inv.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Invoice Details */}
            {selectedInvoice && invoiceItems.length > 0 && (
                <div className="card">
                    <div className="card-header d-flex justify-content-between">
                        <h3>Purchase Detail - Invoice #{selectedInvoice.id}</h3>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Item</th>
                                    <th>Description</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th>Total</th>
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
                                        <td>{item.price.toLocaleString()}</td>
                                        <td>{item.total.toLocaleString()}</td>
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

            {/* Edit Modal/Form */}
            {isEditing && (
                <div className="card mt-4 p-4">
                    <h4>Editing Item: {editingItem.itemName}</h4>
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
                        <button className="btn btn-success me-2" onClick={updateRecord}>Update</button>
                        <button className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const mapStateToProps = (state) => ({
    currentUser: state.user.user,
    userData: state.user.users || {},
    itemData: state.item.items || [],
    purchaseData: state.purchase.purchase || [],
    purchaseInvoiceDetailData: state.purchase.purchaseInvoiceDetail || []
});

const mapDispatchToProps = {
    fetchPurchaseByDate,
    fetchPurchaseInvoiceDetailAsync,
    fetchUserByInputAsync,
    fetchUserStartAsync,
    fetchItemStartAsync
};

export default connect(mapStateToProps, mapDispatchToProps)(EditPurchase);