import React, { useState, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import {
    fetchUserStartAsync,
    setCurrentUser,
} from "../../redux/user/user.action";

import AddUser from '../user/addUser.component';

const SearchUser = ({
    users,
    isFetching,
    currentUser,
    fetchUserStartAsync,
    setCurrentUser,
}) => {
    const [filters, setFilters] = useState({ Username: "", Email: "" });
    const [debouncedFilters, setDebouncedFilters] = useState(filters);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Fetch users on mount
    useEffect(() => {
        fetchUserStartAsync();
    }, [fetchUserStartAsync]);

    //Clean up function
        useEffect(() => {
        return () => {
            setCurrentUser(null);
        };
    }, []);
    



    // Debounce filter input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedFilters(filters);
        }, 300);

        return () => clearTimeout(handler);
    }, [filters]);

    // Apply filtering when debounced filters or users change
    useEffect(() => {
        if (!users || !Array.isArray(users)) {
            setFilteredUsers([]);
            return;
        }

        let result = [...users];

        if (debouncedFilters.Username) {
            result = result.filter((user) =>
                user.username
                    ?.toLowerCase()
                    .includes(debouncedFilters.Username.toLowerCase())
            );
        }

        if (debouncedFilters.Email) {
            result = result.filter((user) =>
                user.email
                    ?.toLowerCase()
                    .includes(debouncedFilters.Email.toLowerCase())
            );
        }

        setFilteredUsers(result);
        setCurrentPage(1); // Reset to first page on filter
    }, [debouncedFilters, users]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    // Pagination logic
    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredUsers.slice(start, start + itemsPerPage);
    }, [currentPage, filteredUsers]);

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    return (
        <div className="container">
            <h3>Search Users</h3>

            {/* Search Filters */}
            <div className="form-group">
                <label>Username</label>
                <input
                    type="text"
                    name="Username"
                    className="form-control"
                    value={filters.Username}
                    onChange={handleFilterChange}
                    placeholder="Search by username"
                />

                <label className="mt-2">Email</label>
                <input
                    type="text"
                    name="Email"
                    className="form-control"
                    value={filters.Email}
                    onChange={handleFilterChange}
                    placeholder="Search by email"
                />
            </div>

            {/* Loading State */}
            {isFetching && <div className="mt-3">Loading...</div>}

            {/* Users Table */}
            <table className="table table-bordered mt-2">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Select</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedUsers.length > 0 ? (
                        paginatedUsers.map((user, index) => (
                            <tr key={user.id}>
                                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                <td>{user.username || "-"}</td>
                                <td>{user.email || "-"}</td>
                                <td>{user.role || "user"}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-success"
                                        onClick={() => setCurrentUser(user)}
                                    >
                                        Select
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center py-3">
                                {!isFetching && filteredUsers.length === 0
                                    ? "No users found"
                                    : ""}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            {filteredUsers.length > itemsPerPage && (
                <div className="pagination-controls mt-3">
                    <button
                        className="btn btn-secondary btn-sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >
                        Prev
                    </button>

                    <span className="mx-2">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        className="btn btn-secondary btn-sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Selected User Section (Optional: Show AddUser form here or navigate) */}
            <div className="mt-4">
                {currentUser ? (
                    <div>
                        <h4>Edit User</h4>
                        <AddUser selectedUser={currentUser} />   {/* <-- form appears here */}
                        <button
                            className="btn btn-warning mt-3"
                            onClick={() => setCurrentUser(null)}
                        >
                            Clear Selection
                        </button>
                    </div>
                ) : (
                    <p>No user selected. Click "Select" to edit a user.</p>
                )}
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    users: state.user.users,
    isFetching: state.user.isFetching,
    currentUser: state.user.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
    fetchUserStartAsync: () => dispatch(fetchUserStartAsync()),
    setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchUser);