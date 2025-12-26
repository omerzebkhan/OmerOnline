import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import userService from "../../services/user.service";
import { checkAccess } from '../../helper/checkAuthorization';
import { fetchRoleStartAsync } from '../../redux/role/roles.actions';
//label should be from the backend screenname field


const PERMISSIONS = [
  { key: 'addBrand', label: 'Add Brand' },
  { key: 'searchBrand', label: 'Search Brand' },
  { key: 'addCat', label: 'Add Category' },
  { key: 'searchCat', label: 'Search Category' },
  { key: 'addSubCat', label: 'Add Sub Category' },
  { key: 'searchSubCat', label: 'Search Sub Category' },
  { key: 'addItem', label: 'Add Item' },
  { key: 'searchItem', label: 'Search Item' },
  { key: 'purInv', label: 'Purchase Invoice' },
  { key: 'editPurInv', label: 'Edit Purchase' },
  { key: 'movStk', label: 'Move Stock' },
  { key: 'saleInvoice', label: 'Sale Invoice' },
  { key: 'saleReturn', label: 'Sale Return' },
  { key: 'editSaleInv', label: 'Edit Sale' },
  { key: 'pricing', label: 'Pricing' },
  { key: 'aR', label: 'Account Receivable' },
  { key: 'aP', label: 'Account Payable' },
  { key: 'addExpense', label: 'Add Expense' },
  { key: 'addUser', label: 'Add User' },
  { key: 'searchUser', label: 'Search User' },
  { key: 'addRole', label: 'Add Role' },
  { key: 'updateAccess', label: 'Update Access' },
  { key: 'addCashFlow', label: 'Add Cash Flow' },
  { key: 'cashAR', label: 'Cash AR' },
  { key: 'cashAP', label: 'Cash AP' },
  { key: 'stkRep', label: 'Stock Report' },
  { key: 'purRep', label: 'Purchase Report' },
  { key: 'saleRep', label: 'Sale Report' },
  { key: 'saleRRep', label: 'Sale Return Report' },
  { key: 'balSheet', label: 'Balance Sheet' },
  { key: 'iLmtRep', label: 'Item Limit Report' },
  { key: 'iTrendRep', label: 'Item Trend Report' },
  { key: 'MonthlySale', label: 'Monthly Sale' },
  { key: 'iSPD', label: 'ItemSalePurDateWise' },
  { key: 'saleAT', label: 'Sale Agent Trend' },
  { key: 'editPurRep', label: 'EditPurchase Report'},
  { key: 'editSaleRep', label: 'EditSale Report'},
  { key: 'invMismatchRep', label: 'Inventory Mismatch Report'},
  { key: 'saleDetailMismatchRep', label: 'SaleDetailMismatch Report'},
  { key: 'iCountDailyRep', label: 'Item Count Daily Report'},
  
];

const UpdateAccess = ({ currentUser, roleData, fetchRoleStartAsync }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleInput, setRoleInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const hasAccess = checkAccess("UPDATE ACCESS", currentUser?.rights);

  // Initialize all permissions to '0' (Denied)
  const initialPermissions = useMemo(() => {
    const init = {};
    PERMISSIONS.forEach(p => { init[p.key] = '0'; });
    return init;
  }, []);

  useEffect(() => {
    fetchRoleStartAsync();
  }, [fetchRoleStartAsync]);

  useEffect(() => {
    setFilteredRoles(roleData || []);
  }, [roleData]);

  // Handle role search input
  const handleRoleSearch = (value) => {
    setRoleInput(value);
    if (!value.trim()) {
      setFilteredRoles(roleData || []);
      setShowDropdown(false);
      return;
    }
    const filtered = roleData.filter(r =>
      r.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredRoles(filtered);
    setShowDropdown(true);
  };

  // When a role is selected → load its permissions
  const selectRole = async (role) => {
    setSelectedRole(role);
    setRoleInput(role.name);
    setShowDropdown(false);
    setPermissions(initialPermissions);
    setLoading(true);
    setMessage('');

    try {
      const res = await userService.getRoleAccess(role.id);
      const accessMap = {};
      res.data.forEach(item => {
        const perm = PERMISSIONS.find(p => p.label === item.screenName);
        if (perm) {
          // Convert backend "true"/true → '1', "false"/false → '0'
          const isAllowed = item.status === 'true' || item.status === true || item.status === 1 || item.status === '1';
          accessMap[perm.key] = isAllowed ? '1' : '0';
        }
      });
      setPermissions(prev => ({ ...prev, ...accessMap }));
    } catch (err) {
      setMessage('Failed to load permissions');
      console.error('Error loading role access:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle dropdown change
  const handlePermissionChange = (key, value) => {
    setPermissions(prev => ({ ...prev, [key]: value }));
  };

  // Submit updated permissions
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) {
      setMessage('Please select a role first');
      return;
    }

    setLoading(true);
    setMessage('Updating permissions...');

    const data = PERMISSIONS.map(p => ({
      screenname: p.label,
      status: permissions[p.key] === '1' ? 1 : 0   // ← Sends 1 or 0 as number
    }));

    try {
      await userService.updateRoleAccess(selectedRole.id, data);
      setMessage(`Permissions updated successfully for "${selectedRole.name}"`);
    } catch (err) {
      setMessage('Failed to update permissions');
      console.error('Update failed:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!hasAccess) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">
          <h4>Access Denied</h4>
          <p>You do not have permission to update role access.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Update Role Permissions</h3>
        </div>
        <div className="card-body">
          {message && (
            <div className={`alert ${message.includes('success') || message.includes('updated') ? 'alert-success' : 'alert-info'} mb-4`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Role Search */}
            <div className="mb-4">
              <label className="form-label fw-bold">Select Role</label>
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type to search role..."
                  value={roleInput}
                  onChange={(e) => handleRoleSearch(e.target.value)}
                  onFocus={() => roleInput && setShowDropdown(true)}
                />
                {showDropdown && (
                  <div
                    className="border position-absolute bg-white w-100 mt-1 shadow-lg rounded"
                    style={{ zIndex: 1000, maxHeight: '300px', overflowY: 'auto' }}
                  >
                    {filteredRoles.length > 0 ? (
                      filteredRoles.map(role => (
                        <div
                          key={role.id}
                          className="p-3 border-bottom hover-bg-light cursor-pointer"
                          onClick={() => selectRole(role)}
                        >
                          <strong>{role.name}</strong>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-muted text-center">No roles found</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Permissions Grid */}
            {selectedRole && (
              <div className="row">
                {PERMISSIONS.map((perm) => (
                  <div key={perm.key} className="col-md-4 mb-3">
                    <div className="form-group row align-items-center">
                      <label className="col-8 col-form-label fw-medium">{perm.label}</label>
                      <div className="col-4">
                        <select
                          className="form-select form-select-sm"
                          value={permissions[perm.key] || '0'}
                          onChange={(e) => handlePermissionChange(perm.key, e.target.value)}
                          disabled={loading}
                        >
                          <option value="0">Denied</option>
                          <option value="1">Allowed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Submit Button */}
            <div className="text-center mt-4">
              <button
                type="submit"
                className="btn btn-success btn-lg px-5"
                disabled={!selectedRole || loading}
              >
                {loading ? 'Updating...' : 'Update Permissions'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  currentUser: state.user.user,
  roleData: state.role.roles || []
});

const mapDispatchToProps = dispatch => ({
  fetchRoleStartAsync: () => dispatch(fetchRoleStartAsync())
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateAccess);