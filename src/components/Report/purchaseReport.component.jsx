import React, {
    useState,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef
} from 'react';
import { connect } from 'react-redux';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { DownloadTableExcel } from "react-export-table-to-excel";

import {
    fetchPurchaseByDate,
    fetchPurchaseInvoiceDetailAsync,
    fetchPurchaseByDateSummary
} from '../../redux/purchase/purchase.action';

import { fetchUserStartAsync } from '../../redux/user/user.action';
import { checkAccess } from '../../helper/checkAuthorization';

import PrintPurchaseSummary from './printPurchaseSummary';

const PurchaseReport = ({
    fetchPurchaseByDate,
    fetchPurchaseInvoiceDetailAsync,
    fetchPurchaseByDateSummary,
    fetchUserStartAsync,
    currentUser,
    purchaseData,
    purchaseSummary,
    purchaseInvoiceDetailData,
    userData
}) => {

    /* ================= SAFE REDUX DATA ================= */
    const safePurchaseData = Array.isArray(purchaseData) ? purchaseData : [];
    const safePurchaseSummary = Array.isArray(purchaseSummary) ? purchaseSummary : [];
    const safeInvoiceDetails = Array.isArray(purchaseInvoiceDetailData) ? purchaseInvoiceDetailData : [];
    const safeUsers = Array.isArray(userData?.user) ? userData.user : [];

    const tableRef = useRef(null);

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [access, setAccess] = useState(false);

    const [hasSearched, setHasSearched] = useState(false);
    const [loading, setLoading] = useState(false);

    const [selectedInvoice, setSelectedInvoice] = useState(null);

    /* ================= ACCESS ================= */
    useLayoutEffect(() => {
        setAccess(checkAccess("STOCK REPORT", currentUser?.rights || []));
    }, [currentUser]);

    /* ================= INIT ================= */
    useEffect(() => {
        fetchUserStartAsync();
        setHasSearched(false);
        setSelectedInvoice(null);
    }, [fetchUserStartAsync]);

    /* ================= SUMMARY ================= */
    const summary = useMemo(() => {
        if (!safePurchaseData.length) {
            return { records: 0, totalItems: 0, totalValue: 0 };
        }
        return safePurchaseData.reduce((acc, inv) => ({
            records: acc.records + 1,
            totalItems: acc.totalItems + Number(inv.totalitems || 0),
            totalValue: acc.totalValue + Number(inv.invoicevalue || 0)
        }), { records: 0, totalItems: 0, totalValue: 0 });
    }, [safePurchaseData]);

    /* ================= SEARCH ================= */
    const handleSubmit = async (e) => {
        e.preventDefault();

        setHasSearched(true);
        setLoading(true);
        setSelectedInvoice(null);

        try {
            await Promise.all([
                fetchPurchaseByDate(
                    startDate.toDateString(),
                    endDate.toDateString(),
                    "0"
                ),
                fetchPurchaseByDateSummary(
                    startDate.toDateString(),
                    endDate.toDateString()
                )
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => window.print();

    /* ================= ACCESS DENIED ================= */
    if (!access) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger text-center">
                    <h4>Access Denied</h4>
                    <p>You do not have permission to view Purchase Report</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h2 className="text-center fw-bold mb-4">Purchase Report</h2>

            {/* ================= SEARCH FORM ================= */}
            <div className="card shadow mb-4">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label className="fw-bold">Start Date</label>
                                <DatePicker
                                    selected={startDate}
                                    onChange={setStartDate}
                                    className="form-control"
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="fw-bold">End Date</label>
                                <DatePicker
                                    selected={endDate}
                                    onChange={setEndDate}
                                    className="form-control"
                                    minDate={startDate}
                                />
                            </div>
                            <div className="col-md-4 align-self-end">
                                <button className="btn btn-primary w-100">
                                    Search
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* ================= LOADING ================= */}
            {hasSearched && loading && (
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" />
                    <p className="mt-3">Loading purchase data...</p>
                </div>
            )}

            {/* ================= RESULTS ================= */}
            {hasSearched && !loading && (
                <>
                    {safePurchaseSummary.length > 0 && (
                        <PrintPurchaseSummary
                            data={safePurchaseSummary}
                            sDate={startDate.toLocaleDateString('en-US')}
                            eDate={endDate.toLocaleDateString('en-US')}
                        />
                    )}

                    {safePurchaseData.length === 0 && (
                        <div className="alert alert-info text-center">
                            No purchase records found
                        </div>
                    )}

                    {safePurchaseData.length > 0 && (
                        <>
                            {/* ================= SUMMARY CARDS ================= */}
                            <div className="card shadow mb-4">
                                <div className="card-body row text-center">
                                    <div className="col-md-4">
                                        <h6>Total Records</h6>
                                        <h3>{summary.records}</h3>
                                    </div>
                                    <div className="col-md-4">
                                        <h6>Total Items</h6>
                                        <h3>{summary.totalItems}</h3>
                                    </div>
                                    <div className="col-md-4">
                                        <h6>Total Value</h6>
                                        <h3>{summary.totalValue.toFixed(3)}</h3>
                                    </div>
                                </div>
                            </div>

                            {/* ================= EXPORT ================= */}
                            <div className="text-end mb-3">
                                <DownloadTableExcel
                                    filename="purchase_report"
                                    sheet="Purchases"
                                    currentTableRef={tableRef.current}
                                >
                                    <button className="btn btn-success me-2">
                                        Export Excel
                                    </button>
                                </DownloadTableExcel>
                                <button className="btn btn-secondary" onClick={handlePrint}>
                                    Print
                                </button>
                            </div>

                            {/* ================= PURCHASE TABLE ================= */}
                            <div className="card shadow">
                                <div className="card-body p-0">
                                    <table ref={tableRef} className="table table-bordered mb-0">
                                        <thead className="table-dark text-center">
                                            <tr>
                                                <th>#</th>
                                                <th>Invoice No</th>
                                                <th>Date</th>
                                                <th>Supplier</th>
                                                <th>Total Items</th>
                                                <th>Invoice Value</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {safePurchaseData.map((row, index) => (
                                                <tr key={row.id}>
                                                    <td className="text-center">{index + 1}</td>
                                                    <td>{row.id}</td>
                                                    <td>{row.createdAt}</td>
                                                    <td>{row.suppliers.name}</td>
                                                    <td className="text-end">{row.totalitems}</td>
                                                    <td className="text-end">
                                                        {Number(row.invoicevalue).toFixed(3)}
                                                    </td>
                                                    <td className="text-center">
                                                        <button
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() => {
                                                                setSelectedInvoice(row);
                                                                fetchPurchaseInvoiceDetailAsync(row.id);
                                                            }}
                                                        >
                                                            View
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* ================= INVOICE DETAILS ================= */}
                            {selectedInvoice && safeInvoiceDetails.length > 0 && (
                                <div className="card shadow mt-4">
                                    <div className="card-header fw-bold">
                                        Invoice Details – {selectedInvoice.invoiceno}
                                    </div>
                                    <div className="card-body p-0">
                                        <table className="table table-bordered mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Item</th>
                                                    <th>Qty</th>
                                                    <th>Rate</th>
                                                    <th>Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {safeInvoiceDetails.map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td>{item.items.name}</td>
                                                        <td className="text-end">{item.quantity}</td>
                                                        <td className="text-end">{item.price}</td>
                                                        <td className="text-end">{item.quantity*item.price}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}

            {!hasSearched && (
                <div className="text-center text-muted my-5">
                    Please search to generate purchase report
                </div>
            )}
        </div>
    );
};

/* ================= REDUX ================= */
const mapStateToProps = state => ({
    currentUser: state.user.currentUser,
    userData: state.user,
    purchaseData: state.purchase.purchase,
    purchaseSummary: state.purchase.purchaseSummary,
    purchaseInvoiceDetailData: state.purchase.purchaseInvoiceDetail
});

const mapDispatchToProps = {
    fetchPurchaseByDate,
    fetchPurchaseInvoiceDetailAsync,
    fetchPurchaseByDateSummary,
    fetchUserStartAsync
};

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseReport);
