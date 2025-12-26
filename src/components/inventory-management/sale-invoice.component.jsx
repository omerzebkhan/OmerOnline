import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import { fetchItemStartAsync } from '../../redux/item/item.action';
import { fetchUserStartAsync } from '../../redux/user/user.action';
import { checkAccess } from '../../helper/checkAuthorization';
import inventoryService from "../../services/inventory.service";
import itemService from "../../services/item.services";

const SaleInvoice = ({ fetchItemStartAsync, itemData, fetchUserStartAsync, users, currentUser }) => {
  const [invoiceRef, setInvoiceRef] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [editingQtyIndex, setEditingQtyIndex] = useState(-1);
  const [lastPrices, setLastPrices] = useState([]);
  const [lastCosts, setLastCosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [printInvoiceData, setPrintInvoiceData] = useState(null);

  // Search states
  const [itemSearch, setItemSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [agentSearch, setAgentSearch] = useState('');
  const [showItemDropdown, setShowItemDropdown] = useState(false);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showAgentDropdown, setShowAgentDropdown] = useState(false);

  const hasAccess = checkAccess("SALE INVOICE", currentUser?.rights);
  const th = { border: "1px solid #000", padding: "6px", textAlign: "left" };
const td = { border: "1px solid #000", padding: "6px" };

  useEffect(() => {
    fetchItemStartAsync();
    fetchUserStartAsync();
  }, [fetchItemStartAsync, fetchUserStartAsync]);

  // === Filtered Lists ===
  const filteredItems = useMemo(() => {
    if (!itemSearch.trim()) return [];
    return (itemData || []).filter(item =>
      item.name?.toLowerCase().includes(itemSearch.toLowerCase())
    );
  }, [itemData, itemSearch]);

  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return [];
    const userList = Array.isArray(users) ? users : (users?.user || []);
    return userList.filter(user =>
      user.name?.toLowerCase().includes(customerSearch.toLowerCase()) &&
      user.role?.toUpperCase() === "CUSTOMER"
    );
  }, [users, customerSearch]);

  const filteredAgents = useMemo(() => {
    if (!agentSearch.trim()) return [];
    const userList = Array.isArray(users) ? users : (users?.user || []);
    return userList.filter(user =>
      user.name?.toLowerCase().includes(agentSearch.toLowerCase()) &&
      user.role?.toUpperCase() === "SALEAGENT"
    );
  }, [users, agentSearch]);

  // === Totals ===
  const totals = useMemo(() => {
    return invoiceItems.reduce((acc, item) => ({
      quantity: acc.quantity + parseInt(item.quantity || 0),
      value: acc.value + (parseFloat(item.price || 0) * parseInt(item.quantity || 0)),
      cost: acc.cost + (parseFloat(item.cost || 0) * parseInt(item.quantity || 0)),
      profit: acc.profit + ((parseFloat(item.price || 0) - parseFloat(item.cost || 0)) * parseInt(item.quantity || 0))
    }), { quantity: 0, value: 0, cost: 0, profit: 0 });
  }, [invoiceItems]);

  // === Select Handlers ===
  const selectItem = (item) => {
    setSelectedItem(item);
    setItemSearch(item.name);
    setPrice(item.showroomprice || '');
    setShowItemDropdown(false);

    if (!selectedCustomer) {
      setMessage('Please select customer first');
      return;
    }

    inventoryService.getSaleByLatestDate(item.id, selectedCustomer.id)
      .then(res => setLastPrices(res.data || []))
      .catch(() => setLastPrices([]));

    inventoryService.getPurcahseByLatestDate(item.id)
      .then(res => setLastCosts(res.data || []))
      .catch(() => setLastCosts([]));
  };

  const selectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setCustomerSearch(customer.name);
    setShowCustomerDropdown(false);
  };

  const selectAgent = (agent) => {
    setSelectedAgent(agent);
    setAgentSearch(agent.name);
    setShowAgentDropdown(false);
  };

  // === Add Item to Invoice ===
  const addItemToInvoice = (e) => {
    e.preventDefault();
    if (!selectedItem || !quantity || !price) {
      setMessage('Please select item and enter quantity & price');
      return;
    }
    if (parseInt(quantity) > parseInt(selectedItem.showroom || 0)) {
      setMessage('Quantity exceeds available stock');
      return;
    }
    if (invoiceItems.some(i => i.itemId === selectedItem.id)) {
      setMessage('Item already added to invoice');
      return;
    }

    setInvoiceItems(prev => [...prev, {
      itemId: selectedItem.id,
      name: selectedItem.name,
      description: selectedItem.description || '',
      quantity: parseInt(quantity),
      price: parseFloat(price),
      cost: parseFloat(selectedItem.averageprice || 0),
    }]);

    setSelectedItem(null);
    setItemSearch('');
    setQuantity('');
    setPrice('');
    setLastPrices([]);
    setLastCosts([]);
    setMessage('');
  };

  const updateQuantity = (index, newQty) => {
    if (!newQty || parseInt(newQty) <= 0) return;
    setInvoiceItems(prev => prev.map((item, i) =>
      i === index ? { ...item, quantity: parseInt(newQty) } : item
    ));
    setEditingQtyIndex(-1);
  };

  const removeItem = (index) => {
    setInvoiceItems(prev => prev.filter((_, i) => i !== index));
  };

  // === Save Sale ===
  const saveSale = async () => {
    if (invoiceItems.length === 0) {
      setMessage('Add at least one item');
      return;
    }
    if (!selectedCustomer) {
      setMessage('Please select a customer');
      return;
    }

    setLoading(true);
    setMessage('Processing sale...');

    const saleData = {
      reffInvoice: invoiceRef,
      customerId: selectedCustomer.id,
      agentid: selectedAgent?.id || null,
      invoicevalue: totals.value,
      totalitems: totals.quantity,
      paid: 0,
      Returned: 0,
      Outstanding: totals.value
    };

    try {
      const saleRes = await inventoryService.createSale(saleData);

      for (let i = 0; i < invoiceItems.length; i++) {
        const item = invoiceItems[i];
        const detailData = {
          saleInvoiceId: saleRes.data.id,
          srno: i + 1,
          itemName: item.itemId,
          quantity: item.quantity,
          price: item.price,
          cost: item.cost
        };
        await inventoryService.createSaleDetail(detailData);

        const itemRes = await itemService.get(item.itemId);
        const updatedStock = {
          quantity: itemRes.data.quantity - item.quantity,
          showroom: itemRes.data.showroom - item.quantity
        };
        await itemService.update(item.itemId, updatedStock);
      }

      setMessage(`Sale created successfully! Invoice ID: ${saleRes.data.id}`);

      setPrintInvoiceData({
        invoiceId: saleRes.data.id,
        ref: invoiceRef || 'N/A',
        date: new Date().toLocaleDateString('en-GB'),
        time: new Date().toLocaleTimeString('en-GB'),
        customer: selectedCustomer,
        agent: selectedAgent,
        items: invoiceItems,
        totals: totals
      });

      // Reset form
      setInvoiceItems([]);
      setSelectedCustomer(null);
      setSelectedAgent(null);
      setCustomerSearch('');
      setAgentSearch('');
      setInvoiceRef('');
    } catch (err) {
      setMessage(`Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => window.print();

  if (!hasAccess) {
    return <div className="container mt-5"><div className="alert alert-danger">Access Denied</div></div>;
  }

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-success text-white">
          <h3 className="mb-0">Sale Invoice</h3>
        </div>
        <div className="card-body">
          {message && (
            <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-warning'} mb-3`}>
              {message}
            </div>
          )}

          <form onSubmit={addItemToInvoice}>
            {/* Customer & Agent */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label fw-bold">Customer</label>
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search customer..."
                    value={customerSearch}
                    onChange={(e) => { setCustomerSearch(e.target.value); setShowCustomerDropdown(true); }}
                    onFocus={() => setShowCustomerDropdown(true)}
                  />
                  {showCustomerDropdown && (
                    <div className="border position-absolute bg-white w-100 mt-1 shadow" style={{ maxHeight: '200px', overflowY: 'auto', zIndex: 1000 }}>
                      {filteredCustomers.length > 0 ? filteredCustomers.map(cust => (
                        <div key={cust.id} className="p-2 hover-bg-light cursor-pointer border-bottom" onClick={() => selectCustomer(cust)}>
                          <strong>{cust.name}</strong> - {cust.address} (Outstanding: {cust.sum || 0})
                        </div>
                      )) : (
                        <div className="p-2 text-muted">No customers found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">Sales Agent (Optional)</label>
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search agent..."
                    value={agentSearch}
                    onChange={(e) => { setAgentSearch(e.target.value); setShowAgentDropdown(true); }}
                    onFocus={() => setShowAgentDropdown(true)}
                  />
                  {showAgentDropdown && (
                    <div className="border position-absolute bg-white w-100 mt-1 shadow" style={{ maxHeight: '200px', overflowY: 'auto', zIndex: 1000 }}>
                      {filteredAgents.length > 0 ? filteredAgents.map(agent => (
                        <div key={agent.id} className="p-2 hover-bg-light cursor-pointer border-bottom" onClick={() => selectAgent(agent)}>
                          <strong>{agent.name}</strong> - {agent.address}
                        </div>
                      )) : (
                        <div className="p-2 text-muted">No agents found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Item Search & Add */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label fw-bold">Item</label>
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search item..."
                    value={itemSearch}
                    onChange={(e) => { setItemSearch(e.target.value); setShowItemDropdown(true); }}
                    onFocus={() => setShowItemDropdown(true)}
                  />
                  {showItemDropdown && (
                    <div className="border position-absolute bg-white w-100 mt-1 shadow" style={{ maxHeight: '300px', overflowY: 'auto', zIndex: 1000 }}>
                      {filteredItems.length > 0 ? filteredItems.map(item => (
                        <div key={item.id} className="p-2 hover-bg-light cursor-pointer border-bottom" onClick={() => selectItem(item)}>
                          <div><strong>{item.name}</strong></div>
                          <small>Stock: {item.showroom} | Cost: {item.averageprice} | Price: {item.showroomprice}</small>
                        </div>
                      )) : (
                        <div className="p-2 text-muted">No items found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-2">
                <label className="form-label">Quantity</label>
                <input type="number" className="form-control" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="1" />
              </div>
              <div className="col-md-2">
                <label className="form-label">Price</label>
                <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} step="0.001" />
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button type="submit" className="btn btn-primary w-100">Add Item</button>
              </div>
            </div>

            {/* Last Transactions */}
            {(lastPrices.length > 0 || lastCosts.length > 0) && (
              <div className="row mb-3">
                <div className="col-12">
                  <h5>Last Transactions</h5>
                  <div className="row">
                    {lastPrices.length > 0 && (
                      <div className="col-md-6">
                        <table className="table table-sm table-bordered">
                          <thead><tr><th>Last Sale Price</th><th>Date</th></tr></thead>
                          <tbody>
                            {lastPrices.map((p, i) => (
                              <tr key={i}><td>{p.price}</td><td>{new Date(p.createdAt).toLocaleDateString()}</td></tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {lastCosts.length > 0 && (
                      <div className="col-md-6">
                        <table className="table table-sm table-bordered">
                          <thead><tr><th>Last Purchase Cost</th><th>Date</th></tr></thead>
                          <tbody>
                            {lastCosts.map((c, i) => (
                              <tr key={i}><td>{c.price}</td><td>{new Date(c.createdAt).toLocaleDateString()}</td></tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Invoice Table */}
            <div className="table-responsive mb-3">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>Cost</th>
                    {currentUser.roles === "ROLE_ADMIN" && <th>Profit</th>}
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceItems.map((item, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{item.name}</td>
                      <td>
                        {editingQtyIndex === idx ? (
                          <input
                            type="number"
                            size="4"
                            defaultValue={item.quantity}
                            onBlur={(e) => updateQuantity(idx, e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && updateQuantity(idx, e.target.value)}
                            autoFocus
                          />
                        ) : (
                          <span className="cursor-pointer text-primary" onClick={() => setEditingQtyIndex(idx)}>
                            {item.quantity}
                          </span>
                        )}
                      </td>
                      <td>{item.price.toFixed(3)}</td>
                      <td>{(item.price * item.quantity).toFixed(3)}</td>
                      <td>{(item.cost * item.quantity).toFixed(3)}</td>
                      {currentUser.roles === "ROLE_ADMIN" && (
                        <td style={{ color: item.price < item.cost ? 'red' : 'green' }}>
                          {((item.price - item.cost) * item.quantity).toFixed(3)}
                        </td>
                      )}
                      <td>
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => removeItem(idx)}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="table-info fw-bold">
                    <td colSpan="2">Total</td>
                    <td>{totals.quantity}</td>
                    <td></td>
                    <td>{totals.value.toFixed(3)}</td>
                    <td>{totals.cost.toFixed(3)}</td>
                    {currentUser.roles === "ROLE_ADMIN" && <td>{totals.profit.toFixed(3)}</td>}
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="text-center">
              <button
                type="button"
                className="btn btn-success btn-lg px-5"
                onClick={saveSale}
                disabled={loading || invoiceItems.length === 0}
              >
                {loading ? 'Processing Sale...' : 'Submit Invoice'}
              </button>
            </div>

            {/* Print Button */}
            {printInvoiceData && (
              <div className="text-center mt-4">
                <button onClick={handlePrint} className="btn btn-info btn-lg px-5 me-3 no-print">
                  Print Invoice
                </button>
                <button onClick={() => setPrintInvoiceData(null)} className="btn btn-secondary btn-lg no-print">
                  New Invoice
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Printable Invoice (same as before) */}
      {printInvoiceData && (
        <div className="print-only">
          <style jsx>{`
            @media print {
              body * { visibility: hidden; }
              .print-only, .print-only * { visibility: visible; }
              .print-only { position: absolute; left: 0; top: 0; width: 100%; }
              .no-print { display: none !important; }
            }
            @page { margin: 1cm; }
          `}</style>
           <div className="print-only p-4">
  <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
    SALE INVOICE
  </h2>

  <div style={{ borderBottom: "1px solid #000", paddingBottom: "10px", marginBottom: "15px" }}>
    <p><strong>Invoice ID:</strong> {printInvoiceData.invoiceId}</p>
    <p><strong>Invoice Ref:</strong> {printInvoiceData.ref}</p>
    <p><strong>Date:</strong> {printInvoiceData.date}</p>
    <p><strong>Time:</strong> {printInvoiceData.time}</p>
  </div>

  <div style={{ marginBottom: "15px" }}>
    <h4>Customer Details</h4>
    <p><strong>Name:</strong> {printInvoiceData.customer.name}</p>
    <p><strong>Address:</strong> {printInvoiceData.customer.address}</p>
  </div>

  {printInvoiceData.agent && (
    <div style={{ marginBottom: "15px" }}>
      <h4>Sales Agent</h4>
      <p><strong>Name:</strong> {printInvoiceData.agent.name}</p>
    </div>
  )}

  <table style={{
    width: "100%",
    borderCollapse: "collapse",
    border: "1px solid #000",
    marginBottom: "20px"
  }}>
    <thead>
      <tr>
        <th style={th}>#</th>
        <th style={th}>Item</th>
        <th style={th}>Qty</th>
        <th style={th}>Price</th>
        <th style={th}>Total</th>
      </tr>
    </thead>
    <tbody>
      {printInvoiceData.items.map((itm, idx) => (
        <tr key={idx}>
          <td style={td}>{idx + 1}</td>
          <td style={td}>{itm.name}</td>
          <td style={td}>{itm.quantity}</td>
          <td style={td}>{itm.price.toFixed(3)}</td>
          <td style={td}>{(itm.price * itm.quantity).toFixed(3)}</td>
        </tr>
      ))}
    </tbody>
  </table>

  <h3 style={{ textAlign: "right", marginTop: "10px" }}>
    Total Amount: {printInvoiceData.totals.value.toFixed(3)}
  </h3>
</div>
 


          {/* ... (your beautiful printable invoice layout from before) */}
          {/* Keep the same printable section as in the previous message */}
          {/* For brevity, it's not repeated here, but you already have it */}
        </div>
      )}
    </div>
  );
};

// === FIXED mapStateToProps ===
const mapStateToProps = state => ({
  itemData: state.item.items || [],
  users: state.user.users || [],  // ← This is the correct path: state.user.users.user
  currentUser: state.user.user || {}
});

const mapDispatchToProps = dispatch => ({
  fetchItemStartAsync: () => dispatch(fetchItemStartAsync()),
  fetchUserStartAsync: () => dispatch(fetchUserStartAsync())
});

export default connect(mapStateToProps, mapDispatchToProps)(SaleInvoice);