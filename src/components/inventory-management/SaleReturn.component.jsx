import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { fetchSaleByDate, fetchSaleInvoiceDetailAsync } from '../../redux/Sale/sale.action';
import { fetchUserStartAsync } from '../../redux/user/user.action';
import { fetchItemStartAsync } from '../../redux/item/item.action';
import { checkAccess } from '../../helper/checkAuthorization';
import inventoryService from "../../services/inventory.service";
import itemService from "../../services/item.services";

const SaleReturn = ({
    fetchSaleByDate,
    saleData,
    fetchSaleInvoiceDetailAsync,
    saleInvoiceDetailData,
    fetchUserStartAsync,
    userData,
    fetchItemStartAsync,
    itemData,
    currentUser
}) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [invoiceNo, setInvoiceNo] = useState("");
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [returnQuantities, setReturnQuantities] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);

    // Search states
    const [customerSearch, setCustomerSearch] = useState('');
    const [agentSearch, setAgentSearch] = useState('');
    const [itemSearch, setItemSearch] = useState('');
    const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
    const [showAgentDropdown, setShowAgentDropdown] = useState(false);
    const [showItemDropdown, setShowItemDropdown] = useState(false);

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    const hasAccess = checkAccess("SALE RETURN", currentUser?.rights);

    useEffect(() => {
        fetchUserStartAsync();
        fetchItemStartAsync();
    }, [fetchUserStartAsync, fetchItemStartAsync]);

    // Filtered options
    const filteredCustomers = useMemo(() => {
        if (!customerSearch.trim()) return [];
        const users = userData?.user || [];
        return users.filter(u =>
            u.name?.toLowerCase().includes(customerSearch.toLowerCase()) &&
            u.roles?.toUpperCase() === "CUSTOMER"
        );
    }, [userData, customerSearch]);

    const filteredAgents = useMemo(() => {
        if (!agentSearch.trim()) return [];
        const users = userData?.user || [];
        return users.filter(u =>
            u.name?.toLowerCase().includes(agentSearch.toLowerCase()) &&
            u.roles?.toUpperCase() === "SALEAGENT"
        );
    }, [userData, agentSearch]);

    const filteredItems = useMemo(() => {
        if (!itemSearch.trim()) return [];
        return (itemData || []).filter(i =>
            i.name?.toLowerCase().includes(itemSearch.toLowerCase())
        );
    }, [itemData, itemSearch]);

    const handleSearch = (e) => {
        e.preventDefault();
        const custId = selectedCustomer?.id || "0";
        const agentId = selectedAgent?.id || "0";
        const itemId = selectedItem?.id || "0";
        const invNo = invoiceNo || "0";

        fetchSaleByDate(
            startDate.toLocaleDateString('en-CA'),
            endDate.toLocaleDateString('en-CA'),
            custId, agentId, itemId, invNo
        );
    };

    const selectInvoice = (invoice) => {
        setSelectedInvoice(invoice);
        setInvoiceNo(invoice.saleInvoiceId);
        fetchSaleInvoiceDetailAsync(invoice.saleInvoiceId);
    };

    const handleReturnQtyChange = (index, value) => {
        if (!value || parseInt(value) < 0) value = "0";
        setReturnQuantities(prev => ({ ...prev, [index]: value }));
    };

    const processReturn = async () => {
        if (isProcessing) return;
        setIsProcessing(true);

        const returnItems = saleInvoiceDetailData
            .map((item, idx) => ({
                ...item,
                returnQty: parseInt(returnQuantities[idx] || 0)
            }))
            .filter(item => item.returnQty > 0);

        // ← NEW VALIDATION: Check if any return exceeds original quantity
        const invalidItem = returnItems.find(item => item.returnQty > item.quantity);
        if (invalidItem) {
            toast.error(`Cannot return more than sold: ${invalidItem.itemname} (max ${invalidItem.quantity})`);
            setIsProcessing(false);
            return;
        }

        if (returnItems.length === 0) {
            toast.warning("Please enter quantity for at least one item to return");
            setIsProcessing(false);
            return;
        }

        try {
            let totalReturnValue = 0;
            let totalReturnQty = 0;

            for (const item of returnItems) {
                totalReturnValue += item.returnQty * item.price;
                totalReturnQty += item.returnQty;

                await inventoryService.createSaleReturn({
                    saleInvoiceId: item.saleInvoiceId,
                    itemId: item.itemid,
                    quantity: item.returnQty
                });

                const remaining = item.quantity - item.returnQty;
                if (remaining <= 0) {
                    await inventoryService.deleteSaleDetail(item.id);
                } else {
                    await inventoryService.updateSaleDetail(item.id, { quantity: remaining });
                }

                const itemRes = await itemService.get(item.itemid);
                await itemService.update(itemRes.data.id, {
                    quantity: itemRes.data.quantity + item.returnQty,
                    showroom: itemRes.data.showroom + item.returnQty
                });
            }

            await inventoryService.updateSale(selectedInvoice.saleInvoiceId, {
                Returned: parseFloat(selectedInvoice.Returned || 0) + totalReturnValue,
                invoicevalue: parseFloat(selectedInvoice.invoicevalue) - totalReturnValue,
                Outstanding: parseFloat(selectedInvoice.Outstanding) - totalReturnValue,
                totalitems: parseInt(selectedInvoice.totalitems) - totalReturnQty
            });

            toast.success("Sale return processed successfully!");
            setReturnQuantities({});
            setSelectedInvoice(null);
            setInvoiceNo("");
            handleSearch(new Event('submit'));
        } catch (err) {
            console.error(err);
            toast.error("Error processing return");
        } finally {
            setIsProcessing(false);
        }
    };

    if (!hasAccess) {
        return <div className="container mt-5"><div className="alert alert-danger">Access Denied</div></div>;
    }

    return (
        <div className="container mt-4">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="card shadow">
                <div className="card-header bg-danger text-white">
                    <h3 className="mb-0">Sale Return</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSearch}>
                        <div className="row mb-3">
                            <div className="col-md-3">
                                <label>Start Date</label>
                                <DatePicker selected={startDate} onChange={setStartDate} className="form-control" />
                            </div>
                            <div className="col-md-3">
                                <label>End Date</label>
                                <DatePicker selected={endDate} onChange={setEndDate} className="form-control" />
                            </div>
                        </div>

                        {/* Customer Search */}
                        <div className="row mb-3">
                            <div className="col-md-4">
                                <label>Customer</label>
                                <div className="position-relative">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search customer..."
                                        value={customerSearch}
                                        onChange={(e) => { setCustomerSearch(e.target.value); setShowCustomerDropdown(true); }}
                                        onFocus={() => setShowCustomerDropdown(true)}
                                    />
                                    {showCustomerDropdown && (
                                        <div className="border position-absolute bg-white w-100 mt-1 shadow" style={{ maxHeight: '200px', overflowY: 'auto', zIndex: 1000 }}>
                                            {filteredCustomers.map(c => (
                                                <div key={c.id} className="p-2 hover-bg-light cursor-pointer border-bottom"
                                                    onClick={() => { setSelectedCustomer(c); setCustomerSearch(c.name); setShowCustomerDropdown(false); }}>
                                                    <strong>{c.name}</strong> - {c.address}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Agent Search */}
                            <div className="col-md-4">
                                <label>Sales Agent</label>
                                <div className="position-relative">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search agent..."
                                        value={agentSearch}
                                        onChange={(e) => { setAgentSearch(e.target.value); setShowAgentDropdown(true); }}
                                        onFocus={() => setShowAgentDropdown(true)}
                                    />
                                    {showAgentDropdown && (
                                        <div className="border position-absolute bg-white w-100 mt-1 shadow" style={{ maxHeight: '200px', overflowY: 'auto', zIndex: 1000 }}>
                                            {filteredAgents.map(a => (
                                                <div key={a.id} className="p-2 hover-bg-light cursor-pointer border-bottom"
                                                    onClick={() => { setSelectedAgent(a); setAgentSearch(a.name); setShowAgentDropdown(false); }}>
                                                    <strong>{a.name}</strong> - {a.address}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Item Search */}
                            <div className="col-md-4">
                                <label>Item</label>
                                <div className="position-relative">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search item..."
                                        value={itemSearch}
                                        onChange={(e) => { setItemSearch(e.target.value); setShowItemDropdown(true); }}
                                        onFocus={() => setShowItemDropdown(true)}
                                    />
                                    {showItemDropdown && (
                                        <div className="border position-absolute bg-white w-100 mt-1 shadow" style={{ maxHeight: '300px', overflowY: 'auto', zIndex: 1000 }}>
                                            {filteredItems.map(i => (
                                                <div key={i.id} className="p-2 hover-bg-light cursor-pointer border-bottom"
                                                    onClick={() => { setSelectedItem(i); setItemSearch(i.name); setShowItemDropdown(false); }}>
                                                    <strong>{i.name}</strong> | Stock: {i.showroom} | Price: {i.showroomprice}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="row mb-4">
                            <div className="col-md-4">
                                <label>Invoice No.</label>
                                <input type="text" className="form-control" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} />
                            </div>
                            <div className="col-md-4 d-flex align-items-end">
                                <button type="submit" className="btn btn-primary w-100">Search Sales</button>
                            </div>
                        </div>
                    </form>

                    {/* Sales List */}
                    {saleData && saleData.length > 0 && (
                        <div className="mb-4">
                            <h4>Found Sales</h4>
                            <div className="table-responsive">
                                <table className="table table-hover table-bordered">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Invoice ID</th>
                                            <th>Customer</th>
                                            <th>Agent</th>
                                            <th>Value</th>
                                            <th>Items</th>
                                            <th>Outstanding</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {saleData.map((sale, i) => (
                                            <tr key={i} className="cursor-pointer" onClick={() => selectInvoice(sale)}>
                                                <td><strong>{sale.saleInvoiceId}</strong></td>
                                                <td>{sale.name}</td>
                                                <td>{sale.agentname || '-'}</td>
                                                <td>{sale.invoicevalue}</td>
                                                <td>{sale.totalitems}</td>
                                                <td>{sale.Outstanding}</td>
                                                <td>{new Date(sale.date).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Return Form */}
                    {selectedInvoice && saleInvoiceDetailData && saleInvoiceDetailData.length > 0 && (
                        <div>
                            <h4>Return Items from Invoice #{selectedInvoice.saleInvoiceId}</h4>
                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <thead className="table-danger">
                                        <tr>
                                            <th>Item</th>
                                            <th>Price</th>
                                            <th>Original Qty</th>
                                            <th>Return Qty</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {saleInvoiceDetailData.map((item, idx) => (
                                            <tr key={idx}>
                                                <td><strong>{item.itemname}</strong></td>
                                                <td>{item.price.toFixed(3)}</td>
                                                <td>{item.quantity}</td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max={item.quantity}  // ← Critical: cannot exceed sold quantity
                                                        className="form-control form-control-sm"
                                                        style={{ width: '100px' }}
                                                        value={returnQuantities[idx] || ''}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            if (val === '' || (parseInt(val) >= 0 && parseInt(val) <= item.quantity)) {
                                                                handleReturnQtyChange(idx, val);
                                                            }
                                                        }}
                                                        placeholder="0"
                                                    />
                                                    <small className="text-muted d-block">Max: {item.quantity}</small>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="text-center mt-4">
                                <button
                                    onClick={processReturn}
                                    disabled={isProcessing}
                                    className="btn btn-danger btn-lg px-5"
                                >
                                    {isProcessing ? 'Processing Return...' : 'Process Return'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    saleData: state.sale.sale || [],
    saleInvoiceDetailData: state.sale.saleInvoiceDetail || [],
    userData: state.user.users || { user: [] },
    itemData: state.item.items || [],
    currentUser: state.user.user || {}
});

const mapDispatchToProps = dispatch => ({
    fetchSaleByDate: (sDate, eDate, custId, agentId, itemId, invNo) =>
        dispatch(fetchSaleByDate(sDate, eDate, custId, agentId, itemId, invNo)),
    fetchSaleInvoiceDetailAsync: (id) => dispatch(fetchSaleInvoiceDetailAsync(id)),
    fetchUserStartAsync: () => dispatch(fetchUserStartAsync()),
    fetchItemStartAsync: () => dispatch(fetchItemStartAsync())
});

export default connect(mapStateToProps, mapDispatchToProps)(SaleReturn);