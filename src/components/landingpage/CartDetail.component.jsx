import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { Button, Modal } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";

import { fetchCartDetailByCust } from '../../redux/cart/cart.actions';
import cartService from '../../services/cart.services';

const CartDetail = ({
    fetchCartDetailByCust,
    currentUser,
    cartData = [],
    isFetching,
    errorMessage
}) => {
    const [totalCartValue, setTotalCartValue] = useState(0);
    const [totalCartQty, setTotalCartQty] = useState(0);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Confirmation modals
    const [showCheckoutConfirm, setShowCheckoutConfirm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletingItem, setDeletingItem] = useState(null);

    const navigate = useNavigate();
    const middlewareUrl = import.meta.env.VITE_MIDDLEWARE;

    useEffect(() => {
        if (currentUser?.id) {
            fetchCartDetailByCust(currentUser.id);
        }
    }, [currentUser?.id, fetchCartDetailByCust]);

    // Calculate totals whenever cartData changes
    useEffect(() => {
        if (cartData && cartData.length > 0) {
            const qty = cartData.reduce((sum, item) => sum + item.quantity, 0);
            const value = cartData.reduce((sum, item) => sum + (item.quantity * item.onlineprice), 0);
            setTotalCartQty(qty);
            setTotalCartValue(value);
        } else {
            setTotalCartQty(0);
            setTotalCartValue(0);
        }
    }, [cartData]);

    const updateQuantity = async (item, increment) => {
        const newQty = item.quantity + increment;
        if (newQty < 1) return;

        setLoading(true);
        try {
            const data = { quantity: newQty };
            await cartService.updateCartDetail(item.cartid, data);
            setMessage(`Quantity updated to ${newQty}`);
            fetchCartDetailByCust(currentUser.id);
        } catch (error) {
            setMessage("Failed to update quantity");
            if (error.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (item) => {
        setDeletingItem(item);
        setShowDeleteConfirm(true);
    };

    const deleteItem = async () => {
        if (!deletingItem) return;
        setLoading(true);
        try {
            const data = { status: "DELETE" };
            await cartService.updateCartDetail(deletingItem.cartid, data);

            // If it was the last item, update cart status
            if (totalCartQty === deletingItem.quantity) {
                const cartUpdate = { status: "DELETED" };
                await cartService.updateCart(deletingItem.id, cartUpdate);
            }

            setMessage("Item removed from cart");
            setShowDeleteConfirm(false);
            setDeletingItem(null);
            fetchCartDetailByCust(currentUser.id);
        } catch (error) {
            setMessage("Failed to remove item");
        } finally {
            setLoading(false);
        }
    };

    const confirmCheckout = () => {
        if (cartData.length === 0) {
            setMessage("Your cart is empty");
            return;
        }
        setShowCheckoutConfirm(true);
    };

    const checkout = async () => {
        setLoading(true);
        setShowCheckoutConfirm(false);
        try {
            const data = { status: "READY FOR DELIVERY" };
            await cartService.updateCart(cartData[0].id, data);
            setMessage("Your order has been placed successfully!");
            setTotalCartQty(0);
            setTotalCartValue(0);
            fetchCartDetailByCust(currentUser.id);
        } catch (error) {
            setMessage("Checkout failed");
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (value) => {
        return parseFloat(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2 });
    };

    if (!currentUser) {
        return (
            <div className="container mt-5 text-center">
                <div className="alert alert-info">
                    <h4>Please log in to view your cart</h4>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-lg-12">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white text-center">
                            <h2 className="mb-0">My Shopping Cart</h2>
                        </div>
                        <div className="card-body">
                            {message && (
                                <div className={`alert ${message.includes('success') || message.includes('updated') ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`}>
                                    {message}
                                    <button className="btn-close" onClick={() => setMessage("")}></button>
                                </div>
                            )}

                            {isFetching && (
                                <div className="text-center my-4">
                                    <div className="spinner-border text-primary"></div>
                                </div>
                            )}

                            {errorMessage && (
                                <div className="alert alert-danger">{errorMessage}</div>
                            )}

                            {cartData && cartData.length > 0 ? (
                                <>
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle">
                                            <thead className="table-dark">
                                                <tr>
                                                    <th>Image</th>
                                                    <th>Item Name</th>
                                                    <th>Price</th>
                                                    <th>Quantity</th>
                                                    <th>Total</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cartData.map((item) => (
                                                    <tr key={item.cartid}>
                                                        <td>
                                                            <img
                                                                src={`${middlewareUrl}/itemsImages/${item.imageUrl}`}
                                                                alt={item.name}
                                                                className="img-thumbnail"
                                                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                                                onError={(e) => {
                                                                    e.target.src = '/placeholder-image.jpg'; // fallback
                                                                }}
                                                            />
                                                        </td>
                                                        <td><strong>{item.name}</strong></td>
                                                        <td>Rs {formatPrice(item.onlineprice)}</td>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <button
                                                                    className="btn btn-sm btn-outline-primary me-2"
                                                                    onClick={() => updateQuantity(item, -1)}
                                                                    disabled={loading}
                                                                >
                                                                    -
                                                                </button>
                                                                <span className="mx-3 fw-bold">{item.quantity}</span>
                                                                <button
                                                                    className="btn btn-sm btn-outline-primary"
                                                                    onClick={() => updateQuantity(item, 1)}
                                                                    disabled={loading}
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td className="fw-bold">
                                                            Rs {formatPrice(item.quantity * item.onlineprice)}
                                                        </td>
                                                        <td>
                                                            <button
                                                                className="btn btn-sm btn-danger"
                                                                onClick={() => confirmDelete(item)}
                                                                disabled={loading}
                                                            >
                                                                Remove
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="card mt-4 bg-light">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-8">
                                                    <h4>Order Summary</h4>
                                                    <p className="mb-1">Total Items: <strong>{totalCartQty}</strong></p>
                                                    <h3 className="text-primary">Total Amount: Rs {formatPrice(totalCartValue)}</h3>
                                                </div>
                                                <div className="col-md-4 text-end">
                                                    <button
                                                        className="btn btn-success btn-lg px-5"
                                                        onClick={confirmCheckout}
                                                        disabled={loading}
                                                    >
                                                        {loading ? "Processing..." : "Proceed to Checkout"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-5">
                                    <h3>Your cart is empty</h3>
                                    <p className="text-muted">Start shopping to add items to your cart!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Remove Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to remove <strong>{deletingItem?.name}</strong> from your cart?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={deleteItem}>
                        Remove
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Checkout Confirmation Modal */}
            <Modal show={showCheckoutConfirm} onHide={() => setShowCheckoutConfirm(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Checkout</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>You're about to place an order for:</p>
                    <h5>{totalCartQty} items - Rs {formatPrice(totalCartValue)}</h5>
                    <p>Proceed with checkout?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCheckoutConfirm(false)}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={checkout}>
                        Confirm Order
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

const mapStateToProps = (state) => ({
    cartData: state.cart.carts || [],
    isFetching: state.cart.isFetching || false,
    errorMessage: state.cart.errorMessage,
    currentUser: state.user.user
});

const mapDispatchToProps = (dispatch) => ({
    fetchCartDetailByCust: (id) => dispatch(fetchCartDetailByCust(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(CartDetail);