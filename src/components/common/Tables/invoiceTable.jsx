import React from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';

const InvoiceTable = ({ invoiceItems, onRemove }) => {
  return (
    <table className="table table-bordered table-striped table-hover">
      <thead className="table-dark">
        <tr>
          <th>Sr. No.</th>
          <th>Item Code</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total Price</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {invoiceItems.length > 0 ? (
          invoiceItems.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item[0]}</td>
              <td>{item[1]}</td>
              <td>{item[2]}</td>
              <td>{(parseFloat(item[2]) * parseInt(item[1], 10) || 0).toFixed(3)}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => onRemove(item, index)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="text-center">
              No items added
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

InvoiceTable.propTypes = {
  invoiceItems: PropTypes.array.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default InvoiceTable;
