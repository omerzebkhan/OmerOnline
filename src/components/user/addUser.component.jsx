import React, { useState, useEffect, useLayoutEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import userService from "../../services/user.service";
import { checkAdmin, checkAccess } from '../../helper/checkAuthorization';
import { fetchRoleStartAsync } from '../../redux/role/roles.actions';
import { da } from 'date-fns/locale';

const AddUser = ({ fetchRoleStartAsync, roleData, selectedUser }) => {
    const loggedInUser = useSelector(state => state.user.user);

    // Form Fields
    const [name, setName] = useState("");
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repassword, setRePassword] = useState("");
    const [mobile, setMobile] = useState("");
    const [address, setAddress] = useState("");
    const [ph, setPh] = useState("");
    const [description, setDescription] = useState("");
    const [comments, setComments] = useState("");
    const [status, setStatus] = useState("DeActive");
    const [isValid, setIsValid] = useState(true); // Add this at the top of your component

    // Role Selection
    const [role, setRole] = useState(null);
    const [roleInput, setRoleInput] = useState("");
    const [filteredRoles, setFilteredRoles] = useState([]);
    const [showRoleOptions, setShowRoleOptions] = useState(false);
    const [activeRoleIndex, setActiveRoleIndex] = useState(0);

    // Messages and access
    const [message, setMessage] = useState("");
    const [error, setError] = useState({});
    const [access, setAccess] = useState(false);
    const [content, setContent] = useState("");

    // Check access
    useLayoutEffect(() => {
        checkAdmin().then(r => setContent(r));
        setAccess(checkAccess("ADD USER", loggedInUser.rights));
    }, [loggedInUser]);

    // Fetch roles
    useEffect(() => {
        fetchRoleStartAsync();
    }, [fetchRoleStartAsync]);

    // Populate form if editing
    useEffect(() => {
        if (selectedUser) {
            setName(selectedUser.name || "");
            setUserName(selectedUser.username || "");
            setEmail(selectedUser.email || "");
            setPassword(selectedUser.password || "");
            setRePassword(selectedUser.password || "");
            setMobile(selectedUser.mobile || "");
            setAddress(selectedUser.address || "");
            setPh(selectedUser.ph || "");
            setDescription(selectedUser.description || "");
            setComments(selectedUser.comments || "");
            setStatus(selectedUser.status || "DeActive");

            if (roleData && selectedUser.role) {
                const selRole = roleData.find(
                    r => r.name.toLowerCase() === selectedUser.role.toLowerCase()
                );
                if (selRole) setRole(selRole);
                setRoleInput(selRole?.name || "");

            }
        }
    }, [selectedUser, roleData]);

    // Role search/filter
    const handleRoleChange = (e) => {
        setRoleInput(e.target.value);
        const filtered = roleData.filter(r =>
            r.name.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredRoles(filtered);
        setShowRoleOptions(true);
        setActiveRoleIndex(0);
    };

    const selectRole = (r) => {
        setRole(r);
        setRoleInput(r.name);
        setShowRoleOptions(false);
    };

    // Validation
    const validate = () => {
        const errors = {};
        if (!name) errors.name = "Enter your Name";
        if (!username) errors.username = "Enter your Username";
        if (!email) errors.email = "Enter your Email";
        if (!password) errors.password = "Enter Password";
        if (password !== repassword) errors.repassword = "Password does not match";
        setError(errors);
        return Object.keys(errors).length === 0;
    };

    // Save or Update User
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const data = {
            name,
            username,
            email,
            password,
            mobile,
            address,
            ph,
            description,
            comments,
            status,
            roleId: role?.id || null, // Ensure roleId is null if not selected

        };

        const resetFields = () => {
            setName("");
            setUserName("");
            setEmail("");
            setPassword("");
            setRePassword("");
            setMobile("");
            setAddress("");
            setPh("");
            setDescription("");
            setComments("");
            setStatus("");
            setRole(null); // reset role to null, not empty string
            setRoleInput("");    // text in the input field
        };

        const handleError = (error, defaultMsg) => {
            const msg = error.response?.data?.message || defaultMsg;
            setIsValid(false);
            setMessage(msg);
            if (msg === "Unauthorized!") setContent(msg);
            console.log(msg, error);
        };

        try {
            if (selectedUser) {
                // -------- UPDATE USER --------
                const userRes = await userService.update(selectedUser.id, data);
                console.log(`User updated: userId = ${selectedUser.id}, new roleId = ${data.roleId}`);

                // Update Role Mapping
                if (data.roleId) {
                    await userService.updateUserRole(selectedUser.id, { roleId: data.roleId });
                    console.log("Role successfully updated…");
                    setMessage("Role successfully updated…");
                }

            } else {
                // -------- CREATE USER --------
                const response = await userService.create(data);
                const userId = response.data.id;
                console.log(`User created: userId = ${userId}, roleId = ${data.roleId}`);

                if (data.roleId) {
                    const roleRes = await userService.createUserRole({ userId, roleId: data.roleId });
                    console.log("Role successfully added…");
                    setMessage(`New User ID = ${userId} | New Role Record ID = ${roleRes.data.id}`);
                }
            }

            // Clear fields after success
            resetFields();

        } catch (error) {
            handleError(error, selectedUser ? "User update failed" : "User creation failed");
        }
    };


    if (!access) return <div>Access denied for this screen</div>;

    return (
        <div className="container">
            <h3>{selectedUser ? "Update User" : "Add New User"}</h3>
            {message && <div className="alert alert-warning">{message}</div>}

            <form onSubmit={handleSubmit}>
                {/* Name */}
                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Name</label>
                    <div className="col-sm-10">
                        <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} />
                        {error.name && <div className="text-danger">{error.name}</div>}
                    </div>
                </div>

                {/* Username */}
                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Username</label>
                    <div className="col-sm-10">
                        <input type="text" className="form-control" value={username} onChange={e => setUserName(e.target.value)} />
                        {error.username && <div className="text-danger">{error.username}</div>}
                    </div>
                </div>

                {/* Email */}
                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Email</label>
                    <div className="col-sm-10">
                        <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
                        {error.email && <div className="text-danger">{error.email}</div>}
                    </div>
                </div>

                {/* Password */}
                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Password</label>
                    <div className="col-sm-10">
                        <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
                        {error.password && <div className="text-danger">{error.password}</div>}
                    </div>
                </div>

                {/* Confirm Password */}
                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Confirm Password</label>
                    <div className="col-sm-10">
                        <input type="password" className="form-control" value={repassword} onChange={e => setRePassword(e.target.value)} />
                        {error.repassword && <div className="text-danger">{error.repassword}</div>}
                    </div>
                </div>

                {/* Mobile */}
                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Mobile</label>
                    <div className="col-sm-10">
                        <input type="text" className="form-control" value={mobile} onChange={e => setMobile(e.target.value)} />
                    </div>
                </div>

                {/* Address */}
                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Address</label>
                    <div className="col-sm-10">
                        <input type="text" className="form-control" value={address} onChange={e => setAddress(e.target.value)} />
                    </div>
                </div>

                {/* Ph */}
                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Ph</label>
                    <div className="col-sm-10">
                        <input type="text" className="form-control" value={ph} onChange={e => setPh(e.target.value)} />
                    </div>
                </div>

                {/* Description */}
                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Description</label>
                    <div className="col-sm-10">
                        <input type="text" className="form-control" value={description} onChange={e => setDescription(e.target.value)} />
                    </div>
                </div>

                {/* Comments */}
                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Comments</label>
                    <div className="col-sm-10">
                        <input type="text" className="form-control" value={comments} onChange={e => setComments(e.target.value)} />
                    </div>
                </div>

                {/* Role */}
                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Role</label>
                    <div className="col-sm-10 position-relative">
                        <input type="text" className="form-control" value={roleInput} onChange={handleRoleChange} />
                        {showRoleOptions && filteredRoles.length > 0 && (
                            <ul className="list-group position-absolute" style={{ zIndex: 1000 }}>
                                {filteredRoles.map(r => (
                                    <li key={r.id} className="list-group-item list-group-item-action" onClick={() => selectRole(r)}>
                                        {r.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Status */}
                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Status</label>
                    <div className="col-sm-10">
                        <select className="form-control" value={status} onChange={e => setStatus(e.target.value)}>
                            <option value="Active">Active</option>
                            <option value="DeActive">DeActive</option>
                        </select>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary">{selectedUser ? "Update" : "Add"}</button>
            </form>
        </div>
    );
};

const mapStateToProps = state => ({
    roleData: state.role.roles
});

const mapDispatchToProps = dispatch => ({
    fetchRoleStartAsync: () => dispatch(fetchRoleStartAsync())
});

export default connect(mapStateToProps, mapDispatchToProps)(AddUser);
