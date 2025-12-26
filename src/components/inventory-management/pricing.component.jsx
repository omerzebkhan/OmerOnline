import React, { useState, useEffect, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from 'react-bootstrap';

import { fetchItemStartAsync, setCurrentItem } from '../../redux/item/item.action';
import itemService from "../../services/item.services";
import { checkAccess } from '../../helper/checkAuthorization';

const Pricing = ({
    fetchItemStartAsync,
    itemData = [],
    currentItem,
    setCurrentItem,
    currentUser
}) => {
    const [access, setAccess] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredItems, setFilteredItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    // Edit fields
    const [onlinePrice, setOnlinePrice] = useState("");
    const [showroomPrice, setShowroomPrice] = useState("");
    const [onlineDiscount, setOnlineDiscount] = useState("");

    // Feedback
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Confirmation modal
    const [showConfirm, setShowConfirm] = useState(false);

    useLayoutEffect(() => {
        const hasAccess = checkAccess("PRICING", currentUser?.rights);
        setAccess(hasAccess || true); // Remove || true in production
    }, [currentUser]);

    useEffect(() => {
        fetchItemStartAsync();
    }, [fetchItemStartAsync]);

    // Filter items
    useEffect(() => {
        const filtered = itemData.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredItems(filtered);
        setCurrentPage(1);
    }, [searchTerm, itemData]);

    // Load current item into form
    useEffect(() => {
        if (currentItem) {
            setOnlinePrice(currentItem.onlineprice?.toString() || "");
            setShowroomPrice(currentItem.showroomprice?.toString() || "");
            setOnlineDiscount(currentItem.onlinediscount?.toString() || "");
        }
    }, [currentItem]);

    const selectItem = (item) => {
        setCurrentItem(item);
        setMessage("");
    };

    const clearSelection = () => {
        setCurrentItem(null);
        setOnlinePrice("");
        setShowroomPrice("");
        setOnlineDiscount("");
        setMessage("");
    };

    const confirmUpdate = () => {
        setShowConfirm(true);
    };

    const handleUpdate = async () => {
        if (!currentItem) return;

        setLoading(true);
        setShowConfirm(false);

        const updateData = {
            onlineprice: parseFloat(onlinePrice) || 0,
            showroomprice: parseFloat(showroomPrice) || 0,
            onlinediscount: parseFloat(onlineDiscount) || 0
        };

        try {
            await itemService.update(currentItem.id, updateData);
            setMessage("Pricing updated successfully!");
            clearSelection();
            fetchItemStartAsync(); // Refresh list
        } catch (error) {
            console.error("Update failed:", error);
            setMessage("Failed to update pricing: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const formatPrice = (value) => {
        const num = parseFloat(value);
        return isNaN(num) ? '0.00' : num.toLocaleString('en-US', { minimumFractionDigits: 2 });
    };

    if (!access) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger text-center">
                    <h4>Access Denied</h4>
                    <p>You do not have permission to manage pricing.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Item Pricing Management</h1>

            {message && (
                <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`}>
                    {message}
                    <button className="btn-close" onClick={() => setMessage("")}></button>
                </div>
            )}

            {(loading) && (
                <div className="text-center my-4">
                    <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Updating pricing...</p>
                </div>
            )}

            {/* Search */}
            <div className="card mb-4">
                <div className="card-body">
                    <div className="row align-items-end g-3">
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Search Item</label>
                            <input
                                type="text"
                                className="form-control form-control-lg"
                                placeholder="Type item name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <small className="text-muted">
                                {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found
                            </small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Item List */}
            {filteredItems.length > 0 && !currentItem && (
                <div className="card mb-4">
                    <div className="card-header bg-primary text-white">
                        <h5 className="mb-0">Select an Item to Update Pricing</h5>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-dark">
                                <tr>
                                    <th>Item Name</th>
                                    <th>Online Price</th>
                                    <th>Showroom Price</th>
                                    <th>Online Discount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item) => (
                                    <tr
                                        key={item.id}
                                        onClick={() => selectItem(item)}
                                        style={{ cursor: 'pointer' }}
                                        className="table-row-hover"
                                    >
                                        <td><strong>{item.name}</strong></td>
                                        <td>{formatPrice(item.onlineprice)}</td>
                                        <td>{formatPrice(item.showroomprice)}</td>
                                        <td>{formatPrice(item.onlinediscount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="card-footer d-flex justify-content-between align-items-center">
                            <div>
                                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredItems.length)} of {filteredItems.length}
                            </div>
                            <nav>
                                <ul className="pagination pagination-sm mb-0">
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => setCurrentPage(p => p - 1)}>«</button>
                                    </li>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                            <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                                        </li>
                                    ))}
                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => setCurrentPage(p => p + 1)}>»</button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    )}
                </div>
            )}

            {/* Edit Form */}
            {currentItem && (
                <div className="card border-primary">
                    <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                        <h4 className="mb-0">Editing Pricing: {currentItem.name}</h4>
                        <button className="btn btn-light btn-sm" onClick={clearSelection}>
                            Clear
                        </button>
                    </div>
                    <div className="card-body">
                        <div className="row g-4">
                            <div className="col-md-4">
                                <label className="form-label fw-bold">Online Price</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-control form-control-lg"
                                    value={onlinePrice}
                                    onChange={(e) => setOnlinePrice(e.target.value)}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-bold">Showroom Price</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-control form-control-lg"
                                    value={showroomPrice}
                                    onChange={(e) => setShowroomPrice(e.target.value)}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-bold">Online Discount</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-control form-control-lg"
                                    value={onlineDiscount}
                                    onChange={(e) => setOnlineDiscount(e.target.value)}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="mt-4 text-center">
                            <button
                                className="btn btn-success btn-lg px-5"
                                onClick={confirmUpdate}
                                disabled={loading}
                            >
                                {loading ? "Updating..." : "Update Pricing"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!currentItem && filteredItems.length === 0 && searchTerm && (
                <div className="text-center my-5">
                    <p className="text-muted fs-4">No items found matching "{searchTerm}"</p>
                </div>
            )}

            {/* Confirmation Modal */}
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Pricing Update</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to update the pricing for <strong>{currentItem?.name}</strong>?
                    <div className="mt-3">
                        <strong>New Values:</strong><br />
                        Online Price: {formatPrice(onlinePrice)}<br />
                        Showroom Price: {formatPrice(showroomPrice)}<br />
                        Online Discount: {formatPrice(onlineDiscount)}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
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
    currentUser: state.user.user
});

const mapDispatchToProps = {
    fetchItemStartAsync,
    setCurrentItem
};

export default connect(mapStateToProps, mapDispatchToProps)(Pricing);