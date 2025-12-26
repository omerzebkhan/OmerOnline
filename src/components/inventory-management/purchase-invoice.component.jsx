import React, { useState, useEffect, useLayoutEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { connect } from 'react-redux';

import { fetchItemStartAsync } from '../../redux/item/item.action';
import { fetchUserStartAsync } from '../../redux/user/user.action';

import { checkAdmin, checkAccess } from '../../helper/checkAuthorization';
import inventoryService from "../../services/inventory.service";
import itemService from "../../services/item.services";

import InvoiceTable from "../common/Tables/invoiceTable";

const PurchaseInvoice = ({
  fetchItemStartAsync, itemData,
  fetchUserStartAsync, userData,
  currentUser1
}) => {

  // States
  const [invoice, setInvoice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [access, setAccess] = useState(false);

  const [invoiceItem, setInvoiceItem] = useState([]);
  const [totalInvoiceValue, setTotalInvoiceValue] = useState(0);
  const [totalInvoiceQuantity, setTotalInvoiceQuantity] = useState(0);

  const [itemInput, setItemInput] = useState("");
  const [supplierInput, setSupplierInput] = useState("");

  const [filteredItems, setFilteredItems] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // Access check
  useLayoutEffect(() => {
    checkAdmin();
    setAccess(checkAccess("PURCHASE INVOICE", currentUser1?.rights || []));
  }, [currentUser1]);

  // Load data
  useEffect(() => { fetchItemStartAsync(); }, []);
  useEffect(() => { fetchUserStartAsync(); }, []);

  // Handle item search
  const handleItemSearch = (e) => {
    const value = e.target.value;
    setItemInput(value);

    if (!value) return setFilteredItems([]);

    const filtered = itemData.filter((i) =>
      i.name?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  // Handle supplier search
  const handleSupplierSearch = (e) => {
  const value = e.target.value.trim();
  setSupplierInput(value);

  // If input is empty → reset results
  if (!value) {
    setFilteredSuppliers([]);
    return;
  }

  const search = value.toLowerCase();

  // Ensure userData exists and is an array
  const list = Array.isArray(userData) ? userData : [];
  

  const filtered = list.filter((u) => {
    console.log("User Role:", u.role); // Debugging line
    const roleMatch = (u.role || "").toUpperCase() === "SUPPLIER";

    const nameMatch = (u.name || "").toLowerCase().includes(search);
    const codeMatch = (u.code || "").toLowerCase().includes(search);
    const phoneMatch = (u.phone || "").toLowerCase().includes(search);

    return roleMatch && (nameMatch || codeMatch || phoneMatch);
  });

  setFilteredSuppliers(filtered);
};


  // Add item to invoice
  const addItem = (e) => {
    e.preventDefault();

    if (!selectedItem) return setMessage("Please select an item");

    const total = (parseFloat(price) || 0) * (parseInt(quantity) || 0);

    const row = [selectedItem.name, quantity, price, selectedItem.id];

    setInvoiceItem((prev) => [...prev, row]);
    setTotalInvoiceValue((v) => v + total);
    setTotalInvoiceQuantity((q) => q + parseInt(quantity));

    setQuantity("");
    setPrice("");
  };

  // Remove item
  const removeItem = (row, index) => {
    const temp = [...invoiceItem];
    temp.splice(index, 1);
    setInvoiceItem(temp);

    const qty = parseInt(row[1]);
    const price = parseFloat(row[2]);

    setTotalInvoiceValue((v) => v - qty * price);
    setTotalInvoiceQuantity((q) => q - qty);
  };

  // Save purchase
  const submitInvoice = () => {
    if (!selectedSupplier) return setMessage("Please select supplier");
    if (invoiceItem.length === 0) return setMessage("Invoice is empty");

    setLoading(true);

    const header = {
      reffInvoice: invoice,
      supplierId: selectedSupplier.id,
      invoicevalue: totalInvoiceValue,
      totalitems: totalInvoiceQuantity,
      paid: 0,
      Returned: 0,
      Outstanding: totalInvoiceValue
    };

    inventoryService
      .createPurchase(header)
      .then((res) => {
        const purchaseId = res.data.id;

        invoiceItem.forEach((row) => {
          const detail = {
            PurchaseInvoiceId: purchaseId,
            itemName: row[3],
            quantity: row[1],
            price: row[2],
          };

          inventoryService.createPurchaseDetail(detail);

          // Update Stock
          itemService.get(row[3]).then((resp) => {
            const it = resp.data;
            const qty = parseInt(row[1]);

            const newAvg =
              it.quantity === 0
                ? row[2]
                : ((it.averageprice * it.quantity) + (row[2] * qty)) /
                  (it.quantity + qty);

            const update = {
              quantity: it.quantity + qty,
              showroom: it.showroom + qty,
              averageprice: newAvg,
            };

            itemService.update(row[3], update);
          });
        });

        setMessage(`Purchase Invoice #${purchaseId} saved successfully`);
        setLoading(false);

        setInvoice("");
        setInvoiceItem([]);
        setTotalInvoiceValue(0);
        setTotalInvoiceQuantity(0);
      })
      .catch((e) => {
        setMessage("Error saving purchase");
        setLoading(false);
      });
  };

  return (
    <div className="container mt-3">
      {!access ? (
        <h3>Access Denied</h3>
      ) : (
        <>
          <h2 className="mb-4">Purchase Invoice</h2>

          {message && <div className="alert alert-warning">{message}</div>}
          {loading && <div className="alert alert-info">Saving...</div>}

          {/* TOP ROW — Invoice + Supplier */}
          <div className="row mb-3">
            <div className="col-md-4">
              <label>Vendor Invoice #</label>
              <input
                value={invoice}
                onChange={(e) => setInvoice(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="col-md-4">
              <label>Supplier</label>
              <input
                value={supplierInput}
                onChange={handleSupplierSearch}
                className="form-control"
              />

              {filteredSuppliers.length > 0 && (
                <ul className="list-group position-absolute w-50">
                  {filteredSuppliers.map((s) => (
                    <li
                      key={s.id}
                      className="list-group-item"
                      onClick={() => {
                        setSupplierInput(s.name);
                        setSelectedSupplier(s);
                        setFilteredSuppliers([]);
                      }}
                    >
                      {s.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* ITEM ROW */}
          <div className="row mb-3">
            <div className="col-md-4">
              <label>Item</label>
              <input
                value={itemInput}
                onChange={handleItemSearch}
                className="form-control"
              />

              {filteredItems.length > 0 && (
                <ul className="list-group position-absolute w-50">
                  {filteredItems.map((i) => (
                    <li
                      key={i.id}
                      className="list-group-item"
                      onClick={() => {
                        setItemInput(i.name);
                        setSelectedItem(i);
                        setFilteredItems([]);
                      }}
                    >
                      {i.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="col-md-2">
              <label>Quantity</label>
              <input
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="col-md-2">
              <label>Price</label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="col-md-2 d-flex align-items-end">
              <button className="btn btn-primary w-100" onClick={addItem}>
                Add Item
              </button>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="row mb-3">
            <div className="col-md-3">
              <strong>Total Qty:</strong> {totalInvoiceQuantity}
            </div>
            <div className="col-md-3">
              <strong>Total Amount:</strong> {totalInvoiceValue.toFixed(3)}
            </div>
          </div>

          {/* TABLE */}
          <InvoiceTable invoiceItems={invoiceItem} onRemove={removeItem} />

          <div className="text-end mt-3">
            <button className="btn btn-success" onClick={submitInvoice}>
              Submit Invoice
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  currentUser1: state.user.user,
  itemData: state.item.items,
  userData: state.user.users || [],
  
});

export default connect(mapStateToProps, {
  fetchItemStartAsync,
  fetchUserStartAsync,
})(PurchaseInvoice);
