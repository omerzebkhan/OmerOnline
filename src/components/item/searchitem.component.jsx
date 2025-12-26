import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { fetchItemStartAsync, setCurrentItem } from '../../redux/item/item.action';
import AddItem from './additem.component';

const SearchItem = ({
    fetchItemStartAsync,
    setCurrentItem,
    itemData,
    isFetching,
    errorMessage,
    currentItem
}) => {
    // ---------- Local State ----------
    const [filters, setFilters] = useState({ Name: '', Description: '' });
    const [debouncedFilters, setDebouncedFilters] = useState(filters);
    const [filteredItems, setFilteredItems] = useState([]);

    const [sortField, setSortField] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // ---------- FETCH ALL ITEMS ONLY ONCE ----------
    useEffect(() => {
        fetchItemStartAsync();
    }, [fetchItemStartAsync]);

    // ---------- DEBOUNCE INPUT (300ms) ----------
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedFilters(filters);
        }, 300);

        return () => clearTimeout(handler);
    }, [filters]);

    // ---------- FRONTEND FILTERING ----------
    useEffect(() => {
        if (!itemData) return;

        let result = [...itemData];

        if (debouncedFilters.Name) {
            result = result.filter((x) =>
                x.name.toLowerCase().includes(debouncedFilters.Name.toLowerCase())
            );
        }

        if (debouncedFilters.Description) {
            result = result.filter((x) =>
                x.description.toLowerCase().includes(debouncedFilters.Description.toLowerCase())
            );
        }

        setFilteredItems(result);
        setCurrentPage(1); // reset page on filter change
    }, [debouncedFilters, itemData]);

    // ---------- SORTING ----------
    const sortedItems = useMemo(() => {
        let data = [...filteredItems];

        return data.sort((a, b) => {
            const aVal = a[sortField]?.toString()?.toLowerCase() || '';
            const bVal = b[sortField]?.toString()?.toLowerCase() || '';

            if (sortOrder === 'asc') return aVal > bVal ? 1 : -1;
            return aVal < bVal ? 1 : -1;
        });
    }, [filteredItems, sortField, sortOrder]);

    // ---------- PAGINATION ----------
    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return sortedItems.slice(start, start + itemsPerPage);
    }, [sortedItems, currentPage]);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const toggleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div>
            <div className="searchFormHeader"><h1>Search Items</h1></div>

            {/* ---------- Search Filters ---------- */}
            <div className="searchForm">
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        name="Name"
                        placeholder="Search by Name"
                        value={filters.Name}
                        onChange={handleChange}
                    />

                    <label className="mt-2">Description</label>
                    <input
                        type="text"
                        name="Description"
                        placeholder="Search by Description"
                        value={filters.Description}
                        onChange={handleChange}
                    />
                </div>
            </div>

            {isFetching && <div className="alert alert-warning">Loading...</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            {/* ---------- Table ---------- */}
            {filteredItems.length > 0 ? (
                <div>
                    <table className="table table-bordered mt-3">
                        <thead>
                            <tr>
                                <th onClick={() => toggleSort('name')}>Name</th>
                                <th onClick={() => toggleSort('description')}>Description</th>
                                <th>Average Cost</th>
                                <th>Qty</th>
                                <th>Online</th>
                                <th>Showroom</th>
                                <th>Warehouse</th>
                                <th>Online Price</th>
                                <th>Showroom Price</th>
                                <th>Online Discount</th>
                                <th>Image</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedItems.map((item, index) => (
                                <tr
                                    key={index}
                                    onClick={() => setCurrentItem(item)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <td>{item.name}</td>
                                    <td>{item.description}</td>
                                    <td>{item.averageprice}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.online}</td>
                                    <td>{item.showroom}</td>
                                    <td>{item.warehouse}</td>
                                    <td>{item.onlineprice}</td>
                                    <td>{item.showroomprice}</td>
                                    <td>{item.onlinediscount}</td>
                                    <td>
                                        <img
                                            src={
                                                import.meta.env.VITE_S3 === 'True'
                                                    ? item.imageUrl
                                                    : `${import.meta.env.VITE_MIDDLEWARE}/itemsImages/${item.imageUrl}`
                                            }
                                            alt="no data"
                                            width="80"
                                            height="80"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* ---------- Pagination Controls ---------- */}
                    <div className="pagination-controls mt-3">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            Prev
                        </button>

                        <span className="mx-2">
                            Page {currentPage} of {totalPages}
                        </span>

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            ) : (
                <p>No items found</p>
            )}

            {/* ---------- Selected Item ---------- */}
            <div className="mt-4">
                {currentItem ? (
                    <AddItem selectedItem={currentItem} />
                ) : (
                    <p>No item selected. Click a row to edit.</p>
                )}
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    itemData: state.item.items,
    isFetching: state.item.isFetching,
    errorMessage: state.item.errorMessage,
    currentItem: state.item.currentItem
});

const mapDispatchToProps = (dispatch) => ({
    fetchItemStartAsync: () => dispatch(fetchItemStartAsync()),
    setCurrentItem: (item) => dispatch(setCurrentItem(item))
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchItem);
