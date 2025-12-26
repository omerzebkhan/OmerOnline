import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { Modal, Button } from 'react-bootstrap';
import { DownloadTableExcel } from "react-export-table-to-excel";

import expenseService from "../../services/expense.service";
import { checkAccess } from '../../helper/checkAuthorization';

const ExpenseList = () => {
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [access, setAccess] = useState(false);

    // Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    // Edit modal
    const [showEdit, setShowEdit] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [editForm, setEditForm] = useState({ name: "", description: "", amount: "", expensedate: new Date() });

    // Delete confirmation
    const [showDelete, setShowDelete] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const tableRef = useRef(null);
    const currentUser = useSelector((state) => state.user.user);

    useLayoutEffect(() => {
        const hasAccess = checkAccess("VIEW EXPENSE", currentUser?.rights) || checkAccess("ADD EXPENSE", currentUser?.rights);
        setAccess(hasAccess || true);
    }, [currentUser]);

    useEffect(() => {
        if (access) {
            fetchExpenses();
        }
    }, [access]);

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const res = await expenseService.getAll();
            const data = res.data || [];
            setExpenses(data);
            setFilteredExpenses(data);

            // Extract unique categories
            const uniqueCats = [...new Set(data.map(e => e.name))].sort();
            setCategories(uniqueCats);
        } catch (err) {
            setMessage("Failed to load expenses");
        } finally {
            setLoading(false);
        }
    };

    // Filtering
    useEffect(() => {
        let filtered = expenses;

        if (searchTerm) {
            filtered = filtered.filter(e =>
                e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                e.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory) {
            filtered = filtered.filter(e => e.name === selectedCategory);
        }

        if (startDate) {
            filtered = filtered.filter(e => new Date(e.expensedate) >= startDate);
        }

        if (endDate) {
            filtered = filtered.filter(e => new Date(e.expensedate) <= endDate);
        }

        setFilteredExpenses(filtered);
        setCurrentPage(1);
    }, [searchTerm, selectedCategory, startDate, endDate, expenses]);

    const handleEdit = (expense) => {
        setEditingExpense(expense);
        setEditForm({
            name: expense.name,
            description: expense.description || "",
            amount: expense.amount.toString(),
            expensedate: new Date(expense.expensedate)
        });
        setShowEdit(true);
    };

    const saveEdit = async () => {
        setLoading(true);
        try {
            await expenseService.update(editingExpense.id, {
                name: editForm.name,
                description: editForm.description,
                amount: parseFloat(editForm.amount),
                expensedate: editForm.expensedate.toISOString().split('T')[0]
            });
            setMessage("Expense updated successfully");
            setShowEdit(false);
            fetchExpenses();
        } catch (err) {
            setMessage("Update failed");
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (id) => {
        setDeletingId(id);
        setShowDelete(true);
    };

    const executeDelete = async () => {
        setLoading(true);
        try {
            await expenseService.remove(deletingId);
            setMessage("Expense deleted successfully");
            setShowDelete(false);
            fetchExpenses();
        } catch (err) {
            setMessage("Delete failed");
        } finally {
            setLoading(false);
        }
    };

    // Monthly Summary
    const monthlySummary = filteredExpenses.reduce((acc, exp) => {
        const date = new Date(exp.expensedate);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        acc[monthKey] = (acc[monthKey] || 0) + parseFloat(exp.amount);
        return acc;
    }, {});

    const sortedMonths = Object.keys(monthlySummary)
        .sort((a, b) => b.localeCompare(a))
        .slice(0, 12);

    // Pagination
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentExpenses = filteredExpenses.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

    const formatCurrency = (value) => {
        const num = parseFloat(value) || 0;
        return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const totalAmount = filteredExpenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

    if (!access) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger text-center">
                    <h4>Access Denied</h4>
                    <p>You do not have permission to view expenses.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Expense Report</h1>
                <DownloadTableExcel filename="Expenses_Report" sheet="Expenses" currentTableRef={tableRef.current}>
                    <button className="btn btn-success">Export to Excel</button>
                </DownloadTableExcel>
            </div>

            {message && (
                <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`}>
                    {message}
                    <button className="btn-close" onClick={() => setMessage("")}></button>
                </div>
            )}

            {/* Summary Cards */}
            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="card bg-primary text-white">
                        <div className="card-body text-center">
                            <h5>Total Expenses</h5>
                            <h3>{formatCurrency(totalAmount)}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card bg-info text-white">
                        <div className="card-body text-center">
                            <h5>Total Records</h5>
                            <h3>{filteredExpenses.length}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card bg-success text-white">
                        <div className="card-body text-center">
                            <h5>Categories</h5>
                            <h3>{categories.length}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="card mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-4">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search name/description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <select className="form-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                                <option value="">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-2">
                            <DatePicker
                                selected={startDate}
                                onChange={setStartDate}
                                placeholderText="Start Date"
                                className="form-control"
                                isClearable
                            />
                        </div>
                        <div className="col-md-2">
                            <DatePicker
                                selected={endDate}
                                onChange={setEndDate}
                                placeholderText="End Date"
                                className="form-control"
                                isClearable
                            />
                        </div>
                        <div className="col-md-1">
                            <button className="btn btn-outline-secondary w-100" onClick={() => {
                                setSearchTerm(""); setSelectedCategory(""); setStartDate(null); setEndDate(null);
                            }}>
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Monthly Summary */}
            {sortedMonths.length > 0 && (
                <div className="card mb-4">
                    <div className="card-header bg-light">
                        <h5>Monthly Summary (Last 12 Months)</h5>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-sm">
                            <thead>
                                <tr>
                                    <th>Month</th>
                                    <th className="text-end">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedMonths.map(month => (
                                    <tr key={month}>
                                        <td>{new Date(month + "-01").toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</td>
                                        <td className="text-end fw-bold">{formatCurrency(monthlySummary[month])}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Expense Table */}
            <div className="card">
                <div className="card-header bg-primary text-white">
                    <h5>Expense List</h5>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover" ref={tableRef}>
                        <thead className="table-dark">
                            <tr>
                                <th>Date</th>
                                <th>Category</th>
                                <th>Description</th>
                                <th className="text-end">Amount</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentExpenses.map(exp => (
                                <tr key={exp.id}>
                                    <td>{new Date(exp.expensedate).toLocaleDateString()}</td>
                                    <td><strong>{exp.name}</strong></td>
                                    <td>{exp.description || '-'}</td>
                                    <td className="text-end">{formatCurrency(exp.amount)}</td>
                                    <td>
                                        <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(exp)}>
                                            Edit
                                        </button>
                                        <button className="btn btn-sm btn-danger" onClick={() => confirmDelete(exp.id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="card-footer d-flex justify-content-between">
                        <div>Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filteredExpenses.length)} of {filteredExpenses.length}</div>
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

            {/* Edit Modal */}
            <Modal show={showEdit} onHide={() => setShowEdit(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Expense</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label className="form-label">Category</label>
                        <input type="text" className="form-control" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea className="form-control" rows="3" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Amount</label>
                        <input type="number" step="0.01" className="form-control" value={editForm.amount} onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Date</label>
                        <DatePicker selected={editForm.expensedate} onChange={(date) => setEditForm({ ...editForm, expensedate: date })} className="form-control" />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEdit(false)}>Cancel</Button>
                    <Button variant="primary" onClick={saveEdit}>Save Changes</Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Confirmation */}
            <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this expense?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDelete(false)}>Cancel</Button>
                    <Button variant="danger" onClick={executeDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ExpenseList;