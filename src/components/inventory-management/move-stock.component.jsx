import React, { useState, useEffect, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import "bootstrap/dist/css/bootstrap.min.css";
import { DownloadTableExcel } from "react-export-table-to-excel";
import { Modal, Button } from 'react-bootstrap';

import { fetchItemStartAsync, setCurrentItem } from '../../redux/item/item.action';
import itemService from "../../services/item.services";
import { checkAccess } from '../../helper/checkAuthorization';

const MoveStock = ({
    fetchItemStartAsync,
    itemData = [],
    currentItem,
    setCurrentItem,
    isFetching,
    currentUser
}) => {
    const [access, setAccess] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredItems, setFilteredItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15);

    // Edit states
    const [online, setOnline] = useState("");
    const [showroom, setShowroom] = useState("");
    const [warehouse, setWarehouse] = useState("");

    // Bulk move
    const [selectedItems, setSelectedItems] = useState([]);
    const [bulkOnline, setBulkOnline] = useState("");
    const [bulkShowroom, setBulkShowroom] = useState("");
    const [bulkWarehouse, setBulkWarehouse] = useState("");

    // History
    const [history, setHistory] = useState([]);
    const [historyPage, setHistoryPage] = useState(1);
    const [historyLoading, setHistoryLoading] = useState(false);

    // Modals & messages
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);

    const tableRef = React.useRef(null);

    useLayoutEffect(() => {
        const hasAccess = checkAccess("MOVE STOCK", currentUser?.rights);
        setAccess(hasAccess || true);
    }, [currentUser]);

    useEffect(() => {
        fetchItemStartAsync();
        fetchStockMovementHistory();
    }, [fetchItemStartAsync]);

    // Filter items
    useEffect(() => {
        const filtered = itemData.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredItems(filtered);
        setCurrentPage(1);
    }, [searchTerm, itemData]);

    // Load single item
    useEffect(() => {
        if (currentItem) {
            setOnline(currentItem.online?.toString() || "0");
            setShowroom(currentItem.showroom?.toString() || "0");
            setWarehouse(currentItem.warehouse?.toString() || "0");
        }
    }, [currentItem]);

    const fetchStockMovementHistory = async () => {
        setHistoryLoading(true);
        try {
            const res = await itemService.getStockMovements(); // Assume this endpoint exists
            setHistory(res.data || []);
        } catch (err) {
            console.error("Failed to load history", err);
        } finally {
            setHistoryLoading(false);
        }
    };

    const selectItem = (item) => {
        setCurrentItem(item);
        setSelectedItems([]); // Clear bulk selection
        setMessage("");
    };

    const toggleBulkSelect = (item) => {
        setSelectedItems(prev =>
            prev.find(i => i.id === item.id)
                ? prev.filter(i => i.id !== item.id)
                : [...prev, item]
        );
    };

    const clearSelection = () => {
        setCurrentItem(null);
        setSelectedItems([]);
        setOnline(""); setShowroom(""); setWarehouse("");
        setBulkOnline(""); setBulkShowroom(""); setBulkWarehouse("");
    };

    const confirmUpdate = (action) => {
        setConfirmAction(() => action);
        setShowConfirm(true);
    };

    const executeUpdate = async () => {
        setShowConfirm(false);
        await confirmAction();
    };

    const handleSingleUpdate = async () => {
        if (!currentItem) return;

        const o = parseInt(online) || 0;
        const s = parseInt(showroom) || 0;
        const w = parseInt(warehouse) || 0;
        const total = o + s + w;

        if (total !== currentItem.quantity) {
            setMessage(`Error: Total (${total}) must equal quantity (${currentItem.quantity})`);
            return;
        }

        setLoading(true);
        try {
            const data = { online: o, showroom: s, warehouse: w };
            await itemService.update(currentItem.id, data);
            await itemService.updateStockValue(currentItem.id, data);

            setMessage("Stock moved successfully!");
            clearSelection();
            fetchItemStartAsync();
            fetchStockMovementHistory();
        } catch (err) {
            setMessage("Update failed: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleBulkUpdate = async () => {
        if (selectedItems.length === 0) return;

        const o = parseInt(bulkOnline) || 0;
        const s = parseInt(bulkShowroom) || 0;
        const w = parseInt(bulkWarehouse) || 0;

        setLoading(true);
        try {
            for (const item of selectedItems) {
                if ((o + s + w) !== item.quantity) {
                    setMessage(`Warning: Skipping ${item.name} - total doesn't match quantity`);
                    continue;
                }
                const data = { online: o, showroom: s, warehouse: w };
                await itemService.update(item.id, data);
                await itemService.updateStockValue(item.id, data);
            }
            setMessage(`Bulk update completed for ${selectedItems.length} items!`);
            clearSelection();
            fetchItemStartAsync();
            fetchStockMovementHistory();
        } catch (err) {
            setMessage("Bulk update failed");
        } finally {
            setLoading(false);
        }
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const historyPerPage = 10;
    const historyStart = (historyPage - 1) * historyPerPage;
    const currentHistory = history.slice(historyStart, historyStart + historyPerPage);
    const totalHistoryPages = Math.ceil(history.length / historyPerPage);

    if (!access) {
        return <div className="container mt-5 alert alert-danger text-center">Access Denied</div>;
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Move Stock Between Locations</h1>
                <DownloadTableExcel filename="Current_Stock_Report" sheet="Stock" currentTableRef={tableRef.current}>
                    <button className="btn btn-success">
                        Export Current Stock to Excel
                    </button>
                </DownloadTableExcel>
            </div>

            {message && (
                <div className={`alert ${message.includes('success') || message.includes('completed') ? 'alert-success' : 'alert-danger'} alert-dismissible`}>
                    {message}
                    <button className="btn-close" onClick={() => setMessage("")} />
                </div>
            )}

            {(loading || isFetching) && (
                <div className="text-center my-4">
                    <div className="spinner-border text-primary" />
                </div>
            )}

            {/* Search & Bulk Controls */}
            <div className="card mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search items..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {selectedItems.length > 0 && (
                            <div className="col-md-6">
                                <small className="text-muted me-3">
                                    {selectedItems.length} item(s) selected
                                </small>
                                <button className="btn btn-outline-secondary btn-sm me-2" onClick={clearSelection}>
                                    Clear Selection
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Item Table */}
            <div className="card mb-5">
                <div className="card-header d-flex justify-content-between">
                    <h5>Items ({filteredItems.length})</h5>
                    {selectedItems.length > 0 && (
                        <div>
                            <input type="number" placeholder="Online" value={bulkOnline} onChange={e => setBulkOnline(e.target.value)} className="form-control d-inline-block w-auto me-2" style={{ width: '80px' }} />
                            <input type="number" placeholder="Showroom" value={bulkShowroom} onChange={e => setBulkShowroom(e.target.value)} className="form-control d-inline-block w-auto me-2" style={{ width: '80px' }} />
                            <input type="number" placeholder="Warehouse" value={bulkWarehouse} onChange={e => setBulkWarehouse(e.target.value)} className="form-control d-inline-block w-auto me-2" style={{ width: '80px' }} />
                            <button
                                className="btn btn-warning btn-sm"
                                onClick={() => confirmUpdate(handleBulkUpdate)}
                                disabled={loading}
                            >
                                Bulk Move Selected
                            </button>
                        </div>
                    )}
                </div>
                <div className="table-responsive">
                    <table className="table table-hover" ref={tableRef}>
                        <thead className="table-dark">
                            <tr>
                                <th><input type="checkbox" disabled /></th>
                                <th>Name</th>
                                <th>Total Qty</th>
                                <th>Online</th>
                                <th>Showroom</th>
                                <th>Warehouse</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map(item => (
                                <tr
                                    key={item.id}
                                    onClick={() => selectItem(item)}
                                    className={currentItem?.id === item.id ? 'table-primary' : ''}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <td onClick={(e) => { e.stopPropagation(); toggleBulkSelect(item); }}>
                                        <input type="checkbox" checked={selectedItems.some(i => i.id === item.id)} readOnly />
                                    </td>
                                    <td><strong>{item.name}</strong></td>
                                    <td><span className="badge bg-secondary">{item.quantity}</span></td>
                                    <td>{item.online || 0}</td>
                                    <td>{item.showroom || 0}</td>
                                    <td>{item.warehouse || 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="card-footer d-flex justify-content-between">
                        <div>
                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredItems.length)} of {filteredItems.length}
                        </div>
                        <nav>
                            <ul className="pagination pagination-sm mb-0">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setCurrentPage(prev => prev - 1)}>«</button>
                                </li>
                                {[...Array(totalPages)].map((_, i) => (
                                    <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                                    </li>
                                ))}
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setCurrentPage(prev => prev + 1)}>»</button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </div>

            {/* Single Edit Form */}
            {currentItem && (
                <div className="card border-primary mb-5">
                    <div className="card-header bg-primary text-white d-flex justify-content-between">
                        <h4>Moving: {currentItem.name}</h4>
                        <button className="btn btn-light btn-sm" onClick={clearSelection}>✕</button>
                    </div>
                    <div className="card-body">
                        <div className="row g-4">
                            <div className="col-md-4">
                                <label className="form-label fw-bold">Online</label>
                                <input type="number" className="form-control form-control-lg" value={online} onChange={e => setOnline(e.target.value)} />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-bold">Showroom</label>
                                <input type="number" className="form-control form-control-lg" value={showroom} onChange={e => setShowroom(e.target.value)} />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-bold">Warehouse</label>
                                <input type="number" className="form-control form-control-lg" value={warehouse} onChange={e => setWarehouse(e.target.value)} />
                            </div>
                        </div>
                        <div className="mt-4 text-center">
                            <button
                                className="btn btn-success btn-lg px-5"
                                onClick={() => confirmUpdate(handleSingleUpdate)}
                                disabled={loading || (parseInt(online || 0) + parseInt(showroom || 0) + parseInt(warehouse || 0)) !== currentItem.quantity}
                            >
                                Update Stock Movement
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Stock Movement History */}
            <div className="card">
                <div className="card-header">
                    <h4>Stock Movement History</h4>
                </div>
                {historyLoading ? (
                    <div className="card-body text-center"><div className="spinner-border" /></div>
                ) : (
                    <>
                        <div className="table-responsive">
                            <table className="table table-sm">
                                <thead className="table-light">
                                    <tr>
                                        <th>Date</th>
                                        <th>Item</th>
                                        <th>Online →</th>
                                        <th>Showroom →</th>
                                        <th>Warehouse →</th>
                                        <th>User</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentHistory.map((h, i) => (
                                        <tr key={i}>
                                            <td>{new Date(h.createdAt).toLocaleString()}</td>
                                            <td>{h.itemName || 'Unknown'}</td>
                                            <td>{h.online}</td>
                                            <td>{h.showroom}</td>
                                            <td>{h.warehouse}</td>
                                            <td>{h.user || 'System'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {totalHistoryPages > 1 && (
                            <div className="card-footer">
                                <nav>
                                    <ul className="pagination justify-content-center">
                                        <li className={`page-item ${historyPage === 1 ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => setHistoryPage(p => p - 1)}>Previous</button>
                                        </li>
                                        <li className="page-item disabled">
                                            <span className="page-link">Page {historyPage} of {totalHistoryPages}</span>
                                        </li>
                                        <li className={`page-item ${historyPage === totalHistoryPages ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => setHistoryPage(p => p + 1)}>Next</button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Confirmation Modal */}
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Stock Movement</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to update the stock locations?
                    This action will be recorded in history.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={executeUpdate}>
                        Yes, Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

const mapStateToProps = (state) => ({
    itemData: state.item.items || [],
    currentItem: state.item.currentItem,
    isFetching: state.item.isFetching || false,
    currentUser: state.user.user
});

const mapDispatchToProps = {
    fetchItemStartAsync,
    setCurrentItem
};

export default connect(mapStateToProps, mapDispatchToProps)(MoveStock);