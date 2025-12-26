import React, { useState, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import userService from "../../services/user.service";
import { checkAccess } from '../../helper/checkAuthorization';

const AddRole = () => {
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [access, setAccess] = useState(false);

    const currentUser = useSelector((state) => state.user.user);

    // Check access on mount
    useLayoutEffect(() => {
        if (currentUser?.rights) {
            const hasAccess = checkAccess("ADD ROLE", currentUser.rights);
            setAccess(hasAccess);
        }
    }, [currentUser?.rights]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setMessage("Role name is required!");
            return;
        }

        setLoading(true);
        setMessage("");

        const data = { name: name.trim() };

        try {
            const response = await userService.createRole(data);
            setMessage(`Role "${response.data.name}" added successfully! (ID: ${response.data.id})`);
            setName(""); // Clear input
        } catch (error) {
            const errMsg = error.response?.data?.message || error.message || "Failed to add role.";
            setMessage(`Error: ${errMsg}`);
            console.error("Add Role Error:", error);
        } finally {
            setLoading(false);
        }
    };

    // Early return if no access
    if (!access) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger text-center">
                    <h4>Access Denied</h4>
                    <p>You don't have permission to add roles.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h3 className="mb-0">Add New Role</h3>
                </div>
                <div className="card-body">
                    {message && (
                        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3 row">
                            <label htmlFor="name" className="col-sm-2 col-form-label fw-bold">
                                Role Name
                            </label>
                            <div className="col-sm-10">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    placeholder="Enter role name (e.g., Manager, Editor)"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="text-center">
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg px-5"
                                disabled={loading || !name.trim()}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        Adding...
                                    </>
                                ) : (
                                    "Add Role"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddRole;