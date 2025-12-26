import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { connect } from 'react-redux';
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from 'react-bootstrap';
import { DownloadTableExcel } from "react-export-table-to-excel";

import {
    fetchPurchaseByInputStartAsync,
    fetchPurInvPayDetial,
    fetchPurchaseAP
} from '../../redux/purchase/purchase.action';
import { checkAccess } from '../../helper/checkAuthorization';

const AccountPayable = ({
    fetchPurchaseByInputStartAsync,
    fetchPurInvPayDetial,
    fetchPurchaseAP,
    purchaseInvoice = [],
    purInvDetail = [],
    purchaseApData = [],
    currentUser
}) => {
    const [access, setAccess] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);
    const [selectedSupplierInvoices, setSelectedSupplierInvoices] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [cashPayment, setCashPayment] = useState("");
    const [bankPayment, setBankPayment] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const tableRef = useRef(null);

    useLayoutEffect(() => {
        const hasAccess = checkAccess("ACCOUNT PAYABLE", currentUser?.rights);
        setAccess(hasAccess || true); // Remove || true in production
    }, [currentUser]);

    useEffect(() => {
        fetchPurchaseAP();
    }, [fetchPurchaseAP]);

    // Filter suppliers
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredSuppliers(purchaseApData);
        } else {
            const filtered = purchaseApData.filter(s =>
                s.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredSuppliers(filtered);
        }
    }, [searchTerm, purchaseApData]);

    // Load supplier invoices
    useEffect(() => {
        setSelectedSupplierInvoices(purchaseInvoice);
    }, [purchaseInvoice]);

    // Load payment history
    useEffect(() => {
        setPaymentHistory(purInvDetail);
    }, [purInvDetail]);

    const selectSupplier = (supplier) => {
        setSelectedInvoice(null);
        setPaymentHistory([]);
        setCashPayment("");
        setBankPayment("");
        fetchPurchaseByInputStartAsync(supplier.supplierId);
    };

    const selectInvoiceForPayment = (invoice) => {
        setSelectedInvoice(invoice);
        setCashPayment("");
        setBankPayment("");
        setMessage("");
    };

    const viewPaymentHistory = (invoiceId) => {
        setSelectedInvoice(null);
        setCashPayment("");
        setBankPayment("");
        fetchPurInvPayDetial(invoiceId);
    };

    const confirmPayment = () => {
        const cash = parseFloat(cashPayment) || 0;
        const bank = parseFloat(bankPayment) || 0;
        const total = cash + bank;

        if (total <= 0) {
            setMessage("Please enter a payment amount");
            return;
        }
        if (total > selectedInvoice.Outstanding) {
            setMessage(`Payment (${total}) cannot exceed outstanding (${selectedInvoice.Outstanding})`);
            return;
        }

        setShowConfirm(true);
    };

    const processPayment = async () => {
        setLoading(true);
        setShowConfirm(false);

        const cash = parseFloat(cashPayment) || 0;
        const bank = parseFloat(bankPayment) || 0;

        try {
            // 1. Create payment record
            await inventoryService.createPurchaseInvPay({
                reffInvoice: selectedInvoice.id,
                cashPayment: cash,
                bankPayment: bank
            });

            // 2. Update invoice outstanding
            const newOutstanding = selectedInvoice.Outstanding - cash - bank;
            await inventoryService.updatePurchase(selectedInvoice.id, {
                Outstanding: newOutstanding
            });

            setMessage("Payment recorded successfully!");
            setCashPayment("");
            setBankPayment("");
            setSelectedInvoice(null);

            // Refresh data
            fetchPurchaseAP();
            fetchPurchaseByInputStartAsync(selectedInvoice.supplierId);
        } catch (err) {
            setMessage("Payment failed: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        const num = parseFloat(value) || 0;
        return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const totalOutstanding = purchaseApData.reduce((sum, s) => sum + (s.purchaseOutstanding || 0), 0);

    if (!access) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger text-center">
                    <h4>Access Denied</h4>
                    <p>You do not have permission to view Accounts Payable.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Accounts Payable</h1>
                <DownloadTableExcel
                    filename="Accounts_Payable_Report"
                    sheet="Suppliers"
                    currentTableRef={tableRef.current}
                >
                    <button className="btn btn-success">
                        Export to Excel
                    </button>
                </DownloadTableExcel>
            </div>

            {message && (
                <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`}>
                    {message}
                    <button className="btn-close" onClick={() => setMessage("")}></button>
                </div>
            )}

            {loading && (
                <div className="text-center my-4">
                    <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Processing...</span>
                    </div>
                </div>
            )}

            {/* Summary */}
            <div className="card mb-4 bg-light">
                <div className="card-body text-center">
                    <h3>Total Outstanding Amount</h3>
                    <h2 className="text-primary fw-bold">{formatCurrency(totalOutstanding)}</h2>
                </div>
            </div>

            {/* Supplier Search */}
            <div className="card mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Search Supplier</label>
                            <input
                                type="text"
                                className="form-control form-control-lg"
                                placeholder="Type supplier name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Suppliers Table */}
            {filteredSuppliers.length > 0 && (
                <div className="card mb-5">
                    <div className="card-header bg-primary text-white">
                        <h5>Suppliers with Outstanding Balances</h5>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover" ref={tableRef}>
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Supplier Name</th>
                                    <th>Address</th>
                                    <th>Total Invoiced</th>
                                    <th>Outstanding</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSuppliers.map((supplier) => (
                                    <tr
                                        key={supplier.supplierId}
                                        onClick={() => selectSupplier(supplier)}
                                        style={{ cursor: 'pointer' }}
                                        className="table-row-hover"
                                    >
                                        <td>{supplier.supplierId}</td>
                                        <td><strong>{supplier.name}</strong></td>
                                        <td>{supplier.address}</td>
                                        <td>{formatCurrency(supplier.purchaseInvoiceValue)}</td>
                                        <td className="text-danger fw-bold">
                                            {formatCurrency(supplier.purchaseOutstanding)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Supplier Invoices */}
            {selectedSupplierInvoices.length > 0 && (
                <div className="card mb-5">
                    <div className="card-header bg-info text-white">
                        <h5>Outstanding Invoices</h5>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Ref Invoice</th>
                                    <th>Invoice Value</th>
                                    <th>Outstanding</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedSupplierInvoices
                                    .filter(inv => inv.Outstanding > 0)
                                    .map((inv) => (
                                        <tr key={inv.id}>
                                            <td>{new Date(inv.createdAt).toLocaleDateString()}</td>
                                            <td>{inv.id}</td>
                                            <td>{formatCurrency(inv.invoicevalue)}</td>
                                            <td className="text-danger fw-bold">
                                                {formatCurrency(inv.Outstanding)}
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-success me-2"
                                                    onClick={() => selectInvoiceForPayment(inv)}
                                                >
                                                    Make Payment
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-secondary"
                                                    onClick={() => viewPaymentHistory(inv.id)}
                                                >
                                                    View History
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Payment Form */}
            {selectedInvoice && (
                <div className="card border-success mb-5">
                    <div className="card-header bg-success text-white">
                        <h5>Make Payment - Invoice #{selectedInvoice.id}</h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-3 mb-4">
                            <div className="col-md-4">
                                <label className="form-label">Supplier</label>
                                <input type="text" className="form-control" value={selectedInvoice.suppliers?.name || ''} disabled />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Invoice Value</label>
                                <input type="text" className="form-control" value={formatCurrency(selectedInvoice.invoicevalue)} disabled />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label text-danger fw-bold">Outstanding</label>
                                <input type="text" className="form-control bg-light" value={formatCurrency(selectedInvoice.Outstanding)} disabled />
                            </div>
                        </div>

                        <div className="row g-4">
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Cash Payment</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-control form-control-lg"
                                    value={cashPayment}
                                    onChange={(e) => setCashPayment(e.target.value)}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Bank Payment</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-control form-control-lg"
                                    value={bankPayment}
                                    onChange={(e) => setBankPayment(e.target.value)}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="mt-4 text-center">
                            <button
                                className="btn btn-success btn-lg px-5"
                                onClick={confirmPayment}
                                disabled={loading}
                            >
                                Record Payment
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment History */}
            {paymentHistory.length > 0 && (
                <div className="card">
                    <div className="card-header bg-secondary text-white">
                        <h5>Payment History</h5>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-sm">
                            <thead className="table-light">
                                <tr>
                                    <th>Date</th>
                                    <th>Ref Invoice</th>
                                    <th>Cash Payment</th>
                                    <th>Bank Payment</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paymentHistory.map((pay, i) => (
                                    <tr key={i}>
                                        <td>{new Date(pay.createdAt).toLocaleString()}</td>
                                        <td>{pay.reffInvoice}</td>
                                        <td>{formatCurrency(pay.cashPayment)}</td>
                                        <td>{formatCurrency(pay.bankPayment)}</td>
                                        <td className="fw-bold">{formatCurrency((pay.cashPayment || 0) + (pay.bankPayment || 0))}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Payment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Record payment of <strong>{formatCurrency((parseFloat(cashPayment) || 0) + (parseFloat(bankPayment) || 0))}</strong>
                    {' '}for Invoice #{selectedInvoice?.id}?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={processPayment}>
                        Confirm Payment
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

const mapStateToProps = (state) => ({
    currentUser: state.user.user,
    purchaseInvoice: state.purchase.purchase || [],
    purInvDetail: state.purchase.purInvPayDetail || [],
    purchaseApData: state.purchase.purchaseAP || []
});

const mapDispatchToProps = {
    fetchPurchaseByInputStartAsync,
    fetchPurInvPayDetial,
    fetchPurchaseAP
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountPayable);