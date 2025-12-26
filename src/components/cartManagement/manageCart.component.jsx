import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import { DownloadTableExcel } from "react-export-table-to-excel";

import { fetchCartStartAsync } from '../../redux/cart/cart.actions';
import cartService from '../../services/cart.services';

const ManageCart = ({
    fetchCartStartAsync,
    cartData = [],
    isFetching,
    errorMessage
}) => {
    const [carts, setCarts] = useState([]);
    const [selectedCart, setSelectedCart] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const tableRef = React.useRef(null);
    const middlewareUrl = import.meta.env.VITE_MIDDLEWARE;

    useEffect(() => {
        fetchCartStartAsync();
    }, [fetchCartStartAsync]);

    useEffect(() => {
        if (cartData && Array.isArray(cartData)) {
            setCarts(cartData);
        }
    }, [cartData]);

    const viewCartDetails = async (cart) => {
        setLoading(true);
        setSelectedCart(cart);
        setCartItems([]);
        try {
            const response = await cartService.getCartDetails(cart.id);
            setCartItems(response.data || []);
        } catch (err) {
            setMessage("Failed to load cart items");
        } finally {
            setLoading(false);
        }
    };

    const updateCartStatus = async (cartId, newStatus) => {
        setLoading(true);
        try {
            await cartService.updateCart(cartId, { status: newStatus });
            setMessage(`Cart status updated to ${newStatus}`);
            fetchCartStartAsync();
            if (selectedCart?.id === cartId) {
                setSelectedCart({ ...selectedCart, status: newStatus });
            }
        } catch (err) {
            setMessage("Failed to update cart status");
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (value) => {
        return parseFloat(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2 });
    };

    // Pagination
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentCarts = carts.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(carts.length / itemsPerPage);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Cart Management</h1>
                <DownloadTableExcel filename="All_Carts_Report" sheet="Carts" currentTableRef={tableRef.current}>
                    <button className="btn btn-success">
                        Export All Carts to Excel
                    </button>
                </DownloadTableExcel>
            </div>

            {message && (
                <div className={`alert ${message.includes('updated') ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`}>
                    {message}
                    <button className="btn-close" onClick={() => setMessage("")}></button>
                </div>
            )}

            {isFetching && (
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

            {errorMessage && (
                <div className="alert alert-danger">{errorMessage}</div>
            )}

            {/* Carts Table */}
            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">All Customer Carts</h4>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0" ref={tableRef}>
                            <thead className="table-dark">
                                <tr>
                                    <th>Cart ID</th>
                                    <th>Customer ID</th>
                                    <th>Customer Name</th>
                                    <th>Status</th>
                                    <th>Total Items</th>
                                    <th>Total Value</th>
                                    <th>Created At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentCarts.length > 0 ? (
                                    currentCarts.map((cart) => (
                                        <tr key={cart.id}>
                                            <td><strong>{cart.id}</strong></td>
                                            <td>{cart.userId}</td>
                                            <td>{cart.userName || 'N/A'}</td>
                                            <td>
                                                <span className={`badge ${
                                                    cart.status === 'PENDING' ? 'bg-warning' :
                                                    cart.status === 'READY FOR DELIVERY' ? 'bg-info' :
                                                    cart.status === 'COMPLETED' ? 'bg-success' :
                                                    cart.status === 'DELETED' ? 'bg-danger' : 'bg-secondary'
                                                }`}>
                                                    {cart.status || 'UNKNOWN'}
                                                </span>
                                            </td>
                                            <td>{cart.totalItems || 0}</td>
                                            <td>Rs {formatPrice(cart.totalValue)}</td>
                                            <td>{new Date(cart.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-primary me-2"
                                                    onClick={() => viewCartDetails(cart)}
                                                >
                                                    View Items
                                                </button>
                                                {cart.status === 'PENDING' && (
                                                    <button
                                                        className="btn btn-sm btn-success"
                                                        onClick={() => updateCartStatus(cart.id, 'READY FOR DELIVERY')}
                                                        disabled={loading}
                                                    >
                                                        Mark Ready
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center py-4">
                                            No carts found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="card-footer d-flex justify-content-between align-items-center">
                            <div>
                                Showing {indexOfFirst + 1} to {Math.min(indexOfLast, carts.length)} of {carts.length} carts
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
            </div>

            {/* Cart Items Modal */}
            <Modal show={!!selectedCart} onHide={() => setSelectedCart(null)} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>
                        Cart Details - ID: {selectedCart?.id} ({selectedCart?.userName || 'Unknown User'})
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary"></div>
                        </div>
                    ) : cartItems.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Item Name</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((item) => (
                                        <tr key={item.cartid}>
                                            <td>
                                                <img
                                                    src={`${middlewareUrl}/itemsImages/${item.imageUrl}`}
                                                    alt={item.name}
                                                    className="img-thumbnail"
                                                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                                    onError={(e) => e.target.src = '/placeholder.jpg'}
                                                />
                                            </td>
                                            <td><strong>{item.name}</strong></td>
                                            <td>{item.quantity}</td>
                                            <td>Rs {formatPrice(item.onlineprice)}</td>
                                            <td>Rs {formatPrice(item.quantity * item.onlineprice)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center text-muted">No items in this cart</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setSelectedCart(null)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

const mapStateToProps = (state) => ({
    cartData: state.cart.carts || [],
    isFetching: state.cart.isFetching || false,
    errorMessage: state.cart.errorMessage
});

const mapDispatchToProps = {
    fetchCartStartAsync
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageCart);