import React, { useState, useEffect, useMemo, useRef } from 'react';
import { connect } from 'react-redux';
import { DownloadTableExcel } from 'react-export-table-to-excel';

import {
    fetchSaleByInputStartAsync,
    fetchSalInvPayDetial,
    fetchSaleAR,
    fetchSalePayHist,
} from '../../redux/Sale/sale.action';
import inventoryService from '../../services/inventory.service';
import { checkAccess } from '../../helper/checkAuthorization';

const AccountReceivable = ({
    userRights,
    saleAR: rawSaleAR,
    saleInvoices: rawInvoices,
    salInvPayDetail: rawPayDetails,
    salePayHist: rawPayHist,
    isFetching,
    fetchSaleByInputStartAsync,
    fetchSalInvPayDetial,
    fetchSaleAR,
    fetchSalePayHist,
}) => {
    const tableRef = useRef(null);

    const [access] = useState(checkAccess('ACCOUNT RECEIVABLE', userRights));
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Filters
    const [nameFilter, setNameFilter] = useState('');
    const [agentFilter, setAgentFilter] = useState('');
    const [addressFilter, setAddressFilter] = useState('');
    const [amountFilter, setAmountFilter] = useState('');
    const [amountOp, setAmountOp] = useState('Please Select');
    const [ageFilter, setAgeFilter] = useState('');
    const [ageOp, setAgeOp] = useState('Please Select');
    const [invoiceSearch, setInvoiceSearch] = useState('');

    // Selection & Payment
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [adjustAgainstInvoice, setAdjustAgainstInvoice] = useState(null);
    const [cashPayment, setCashPayment] = useState('');
    const [bankPayment, setBankPayment] = useState('');

    const [selectedInvoiceForPay, setSelectedInvoiceForPay] = useState(null);
    const [selectedInvoiceForDetails, setSelectedInvoiceForDetails] = useState(null);

    const [viewMode, setViewMode] = useState('invoices'); // 'invoices', 'history'

    useEffect(() => {
        fetchSaleAR();
    }, []);  // Remove fetchSaleAR from dependencies
    // Safe arrays




    const saleAR = useMemo(() => Array.isArray(rawSaleAR) ? rawSaleAR : [], [rawSaleAR]);
    const invoices = useMemo(() => Array.isArray(rawInvoices) ? rawInvoices : [], [rawInvoices]);
    const payDetails = useMemo(() => Array.isArray(rawPayDetails) ? rawPayDetails : [], [rawPayDetails]);
    const payHist = useMemo(() => Array.isArray(rawPayHist) ? rawPayHist : [], [rawPayHist]);

    useEffect(() => {
        console.log('saleAR reference changed', saleAR.length);
    }, [saleAR]);

    // Sorted invoices
    const sortedInvoices = useMemo(() => {
        return [...invoices].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }, [invoices]);

    // Filtered customers
    const filteredCustomers = useMemo(() => {
        return saleAR.filter((c) => {
            const nameOk = !nameFilter || c.name?.toLowerCase().includes(nameFilter.toLowerCase());
            const agentOk = !agentFilter || c.agentname?.toLowerCase().includes(agentFilter.toLowerCase());
            const addrOk = !addressFilter || c.address?.toLowerCase().includes(addressFilter.toLowerCase());
            const days = c.diff?.days || 0;

            let amountOk = true;
            if (amountOp !== 'Please Select' && amountFilter) {
                const val = parseFloat(amountFilter);
                if (isNaN(val)) return false;
                const out = parseFloat(c.salesOutstanding) || 0;
                if (amountOp === 'Equal To') amountOk = out === val;
                else if (amountOp === 'Greater Than') amountOk = out > val;
                else if (amountOp === 'Less Than') amountOk = out < val;
            }

            let ageOk = true;
            if (ageOp !== 'Please Select' && ageFilter) {
                const val = parseFloat(ageFilter);
                if (isNaN(val)) return false;
                if (ageOp === 'Equal To') ageOk = days === val;
                else if (ageOp === 'Greater Than') ageOk = days > val;
                else if (ageOp === 'Less Than') ageOk = days < val;
            }

            return nameOk && agentOk && addrOk && amountOk && ageOk;
        });
    }, [saleAR, nameFilter, agentFilter, addressFilter, amountFilter, amountOp, ageFilter, ageOp]);

    // Totals
    const totals = useMemo(() => {
        const totalOutstanding = saleAR.reduce((sum, c) => sum + (parseFloat(c.salesOutstanding) || 0), 0);
        const filteredInvoiceValue = filteredCustomers.reduce((sum, c) => sum + (parseFloat(c.saleInvoiceValue) || 0), 0);
        const filteredOutstanding = filteredCustomers.reduce((sum, c) => sum + (parseFloat(c.salesOutstanding) || 0), 0);

        return {
            totalOutstanding,
            filteredCount: filteredCustomers.length,
            filteredInvoiceValue,
            filteredOutstanding,
        };
    }, [saleAR, filteredCustomers]);

    // Positive invoices for adjustment
    const positiveInvoicesForAdjustment = useMemo(() => {
        if (!selectedInvoice || selectedInvoice.Outstanding >= 0) return [];
        return sortedInvoices.filter(inv => parseFloat(inv.Outstanding) > 0);
    }, [selectedInvoice, sortedInvoices]);


    // const selectCustomer = (customer) => {
    //     setSelectedCustomer(customer);
    //     setSelectedInvoiceForPay(null);
    //     setSelectedInvoiceForDetails(null);
    //     setAdjustAgainstInvoice(null);
    //     setCashPayment('');
    //     setBankPayment('');
    //     // Add this:
    //     // Clear any previous global payment history
    //     // If you have a clear action in Redux, use it. Otherwise, just rely on not calling fetchSalePayHist
    //     fetchSaleByInputStartAsync(customer.customerId);
    // };

    const selectCustomer = (customer) => {
        setSelectedCustomer(customer);
        setViewMode('invoices'); // default to invoices
        setSelectedInvoiceForPay(null);
        setSelectedInvoiceForDetails(null);
        setCashPayment('');
        setBankPayment('');
        fetchSaleByInputStartAsync(customer.customerId);
    };



    const searchByInvoice = async () => {
        if (!invoiceSearch.trim()) return;
        setLoading(true);
        try {
            const res = await inventoryService.getSaleARByInvoiceId(invoiceSearch);
            const data = res.data?.[0];
            if (!data) throw new Error('Not found');

            const customerSummary = {
                customerId: data.customerId,
                name: data.name,
                address: data.address,
                agentname: data.agentname,
                saleInvoiceValue: data.invoicevalue,
                salesOutstanding: data.Outstanding,
                diff: data.diff,
            };
            selectCustomer(customerSummary);
            setMessage('');
        } catch (err) {
            setMessage('Invoice not found');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePayment = async () => {
        const cash = parseFloat(cashPayment) || 0;
        const bank = parseFloat(bankPayment) || 0;
        const totalPay = cash + bank;

        if (totalPay <= 0) {
            setMessage('Enter a valid payment amount');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            if (selectedInvoice.Outstanding < 0) {
                if (!adjustAgainstInvoice) {
                    setMessage('Please select an invoice to adjust against');
                    setLoading(false);
                    return;
                }

                const creditAmount = Math.abs(selectedInvoice.Outstanding);
                const availableDebit = adjustAgainstInvoice.Outstanding;
                const adjustAmt = Math.min(creditAmount, availableDebit);

                const newCurrentOut = selectedInvoice.Outstanding + adjustAmt;
                const newSecondaryOut = adjustAgainstInvoice.Outstanding - adjustAmt;

                await Promise.all([
                    inventoryService.createSaleInvPay({
                        reffInvoice: selectedInvoice.id,
                        cashPayment: adjustAmt,
                        bankPayment: 0,
                        comments: `Adjusted against #${adjustAgainstInvoice.id}`,
                    }),
                    inventoryService.createSaleInvPay({
                        reffInvoice: adjustAgainstInvoice.id,
                        cashPayment: -adjustAmt,
                        bankPayment: 0,
                        comments: `Adjusted from #${selectedInvoice.id}`,
                    }),
                    inventoryService.updateSale(selectedInvoice.id, { Outstanding: newCurrentOut }),
                    inventoryService.updateSale(adjustAgainstInvoice.id, { Outstanding: newSecondaryOut }),
                ]);

                setMessage('Credit adjustment successful');
            } else {
                if (totalPay > selectedInvoice.Outstanding) {
                    setMessage('Payment cannot exceed outstanding amount');
                    setLoading(false);
                    return;
                }

                await inventoryService.createSaleInvPay({
                    reffInvoice: selectedInvoice.id,
                    cashPayment: cash,
                    bankPayment: bank,
                    comments: '',
                });

                await inventoryService.updateSale(selectedInvoice.id, {
                    Outstanding: selectedInvoice.Outstanding - totalPay,
                });

                setMessage('Payment recorded successfully');
            }

            fetchSaleAR();
            if (selectedCustomer) fetchSaleByInputStartAsync(selectedCustomer.customerId);
            setSelectedInvoice(null);
            setAdjustAgainstInvoice(null);
            setCashPayment('');
            setBankPayment('');
        } catch (err) {
            setMessage('Transaction failed. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!access) return <div className="alert alert-danger">Access denied</div>;

    return (
        <div className="container mt-4">
            <h1>Accounts Receivable</h1>

            {(loading || (isFetching && saleAR.length === 0)) && (
                <div className="alert alert-info">Loading data...</div>
            )}
            {message && <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-warning'}`}>{message}</div>}

            {/* Filters */}
            <div className="card mb-3">
                <div className="card-body">
                    <div className="row g-2 align-items-end">
                        <div className="col-md-2"><input className="form-control" placeholder="Name" value={nameFilter} onChange={e => setNameFilter(e.target.value)} /></div>
                        <div className="col-md-2"><input className="form-control" placeholder="Agent" value={agentFilter} onChange={e => setAgentFilter(e.target.value)} /></div>
                        <div className="col-md-2"><input className="form-control" placeholder="Address" value={addressFilter} onChange={e => setAddressFilter(e.target.value)} /></div>
                        <div className="col-md-2">
                            <select className="form-select mb-1" value={amountOp} onChange={e => setAmountOp(e.target.value)}>
                                <option>Please Select</option>
                                <option>Equal To</option>
                                <option>Greater Than</option>
                                <option>Less Than</option>
                            </select>
                            <input className="form-control" type="number" placeholder="Amount" value={amountFilter} onChange={e => setAmountFilter(e.target.value)} disabled={amountOp === 'Please Select'} />
                        </div>
                        <div className="col-md-2">
                            <select className="form-select mb-1" value={ageOp} onChange={e => setAgeOp(e.target.value)}>
                                <option>Please Select</option>
                                <option>Equal To</option>
                                <option>Greater Than</option>
                                <option>Less Than</option>
                            </select>
                            <input className="form-control" type="number" placeholder="Days Old" value={ageFilter} onChange={e => setAgeFilter(e.target.value)} disabled={ageOp === 'Please Select'} />
                        </div>
                        <div className="col-md-2">
                            <input className="form-control mb-1" placeholder="Invoice ID" value={invoiceSearch} onChange={e => setInvoiceSearch(e.target.value)} />
                            <button className="btn btn-primary w-100" onClick={searchByInvoice}>Search</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary */}
            <div className="row mb-3">
                <div className="col">
                    <div className="card"><div className="card-body"><strong>Total Outstanding:</strong> {totals.totalOutstanding.toFixed(2)}</div></div>
                </div>
                <div className="col">
                    <div className="card"><div className="card-body">
                        <strong>Filtered ({totals.filteredCount} customers):</strong><br />
                        Invoice Value: {totals.filteredInvoiceValue.toFixed(2)}<br />
                        Outstanding: {totals.filteredOutstanding.toFixed(2)}
                    </div></div>
                </div>
                <div className="col-auto">
                    <DownloadTableExcel filename="accounts_receivable" sheet="AR" currentTableRef={tableRef.current}>
                        <button className="btn btn-success">Export Excel</button>
                    </DownloadTableExcel>
                </div>
            </div>

            {/* Customers Table */}
            <table className="table table-bordered table-hover" ref={tableRef}>
                <thead className="table-light">
                    <tr>
                        <th>ID</th><th>Name</th><th>Address</th><th>Agent</th><th>Inv Value</th><th>Outstanding</th><th>Oldest (days)</th><th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCustomers.length === 0 ? (
                        <tr><td colSpan="8" className="text-center">No customers found</td></tr>
                    ) : (
                        filteredCustomers.map((c, index) => (
                            <tr key={`customer-${c.customerId}-${c.agentname}`}>
                                <td>{c.customerId}</td>
                                <td>{c.name}</td>
                                <td>{c.address}</td>
                                <td>{c.agentname}</td>
                                <td>{c.saleInvoiceValue}</td>
                                <td>{c.salesOutstanding}</td>
                                <td>{c.diff?.days || 0}</td>
                                <td>
                                    <button className="btn btn-sm btn-primary me-1" onClick={() => {
                                        setViewMode('invoices');
                                        selectCustomer(c)                                        
                                    }}>Invoices</button>
                                    <button className="btn btn-sm btn-info" onClick={() => {
                                        setViewMode('history');
                                        fetchSalePayHist(c.customerId);
                                    }}>History</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Invoices Table */}
            {invoices.length > 0 && viewMode === 'invoices' && selectedCustomer && (
                <>
                    <h4 className="mt-5">Outstanding Invoices - {selectedCustomer.name}</h4>
                    <table className="table table-bordered mb-4">
                        <thead className="table-light">
                            <tr><th>Date</th><th>ID</th><th>Value</th><th>Outstanding</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {sortedInvoices.map((inv, index) => (
                                <tr key={`invoice-${inv.id ?? index}`}>
                                    <td>{new Date(inv.createdAt).toLocaleDateString()}</td>
                                    <td>{inv.id}</td>
                                    <td>{inv.invoicevalue}</td>
                                    <td>{inv.Outstanding}</td>
                                    <td>
                                        {/* Pay button */}
                                        <button
                                            className="btn btn-sm btn-success me-1"
                                            onClick={() => {
                                                setSelectedInvoice(inv);
                                                setSelectedInvoiceForPay(inv);
                                                setSelectedInvoiceForDetails(null); // hide history
                                                setCashPayment('');
                                                setBankPayment('');
                                            }}
                                        >
                                            Pay
                                        </button>

                                        {/* Details button */}
                                        <button
                                            className="btn btn-sm btn-secondary"
                                            onClick={async () => {
                                                setSelectedInvoiceForPay(null); // hide payment form
                                                setSelectedInvoiceForDetails(inv); // show history
                                                await fetchSalInvPayDetial(inv.id);
                                            }}
                                        >
                                            Details
                                        </button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            {/* Payment Form */}
            {selectedInvoiceForPay && (
                <div className="card mb-4">
                    <div className="card-body">
                        <h5>Record Payment - Invoice #{selectedInvoiceForPay.id}</h5>
                        <p><strong>Customer:</strong> {selectedInvoiceForPay.customers?.name || 'N/A'}</p>
                        <p><strong>Outstanding:</strong> {selectedInvoiceForPay.Outstanding}</p>

                        <div className="row mb-3">
                            <div className="col-md-4">
                                <label className="form-label">Cash Payment</label>
                                <input type="number" className="form-control" value={cashPayment} onChange={e => setCashPayment(e.target.value)} />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Bank Payment</label>
                                <input type="number" className="form-control" value={bankPayment} onChange={e => setBankPayment(e.target.value)} />
                            </div>
                        </div>

                        <button className="btn btn-lg btn-success" onClick={async () => {
                            await handleUpdatePayment(); // record payment

                            // Refresh history automatically
                            if (selectedInvoiceForPay) {
                                await fetchSalInvPayDetial(selectedInvoiceForPay.id);
                                setSelectedInvoiceForDetails(selectedInvoiceForPay); // show updated history
                            }

                            setSelectedInvoiceForPay(null); // hide form
                            setCashPayment('');
                            setBankPayment('');
                        }}>
                            Record Payment
                        </button>
                    </div>
                </div>
            )}


            {/* Adjustment Selection */}
            {positiveInvoicesForAdjustment.length > 0 && (
                <div className="card mb-4">
                    <div className="card-body">
                        <h5>Select Invoice to Adjust Credit Against</h5>
                        <table className="table table-bordered">
                            <thead><tr><th>ID</th><th>Date</th><th>Outstanding</th><th>Action</th></tr></thead>
                            <tbody>
                                {positiveInvoicesForAdjustment.map((inv, index) => (
                                    <tr key={`adjust-${inv.id ?? index}`}>
                                        <td>{inv.id}</td>
                                        <td>{new Date(inv.createdAt).toLocaleDateString()}</td>
                                        <td>{inv.Outstanding}</td>
                                        <td>
                                            <button className="btn btn-sm btn-warning" onClick={() => {
                                                setAdjustAgainstInvoice(inv);
                                                setCashPayment(Math.abs(selectedInvoice.Outstanding).toString());
                                            }}>
                                                Select This Invoice
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {adjustAgainstInvoice && (
                            <div className="alert alert-success">
                                Adjusting against Invoice #{adjustAgainstInvoice.id} (Outstanding: {adjustAgainstInvoice.Outstanding})
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Only show customer-wide payment history if requested and no invoice-specific action is open */}
            {payHist.length > 0 && viewMode === 'history' && selectedCustomer && (
                <div className="mt-5">
                    <h4>Payment History</h4>
                    <table className="table table-bordered">
                        <thead className="table-light">
                            <tr><th>Date</th><th>Customer</th><th>Invoice</th><th>Cash</th><th>Bank</th></tr>
                        </thead>
                        <tbody>
                            {payHist.map((p, index) => (
                                <tr key={`payhist-${p.sipid ?? p.id ?? p.sid ?? index}`}>
                                    <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                                    <td>{p.name}</td>
                                    <td>{p.sid}</td>
                                    <td>{p.cashPayment}</td>
                                    <td>{p.bankPayment}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Invoice Payment Details */}
            {selectedInvoiceForDetails && payDetails.length > 0 && (
                <div className="mt-5">
                    <h4>Payment Details for Invoice #{selectedInvoiceForDetails.id}</h4>
                    <table className="table table-bordered">
                        <thead className="table-light">
                            <tr><th>Date</th><th>Cash</th><th>Bank</th><th>Comments</th></tr>
                        </thead>
                        <tbody>
                            {payDetails.map((d, index) => (
                                <tr key={`paydetail-${d.id ?? index}`}>
                                    <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                                    <td>{d.cashPayment}</td>
                                    <td>{d.bankPayment}</td>
                                    <td>{d.comments || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const mapStateToProps = state => ({
    userRights: state.user.user?.rights || [],
    saleAR: state.sale.saleAR,
    saleInvoices: state.sale.sale,
    salInvPayDetail: state.sale.salInvPayDetail,
    salePayHist: state.sale.salePayHist,
    isFetching: state.sale.isFetching,
});

const mapDispatchToProps = {
    fetchSaleByInputStartAsync,
    fetchSalInvPayDetial,
    fetchSaleAR,
    fetchSalePayHist,
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountReceivable);