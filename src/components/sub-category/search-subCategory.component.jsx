import React, { useState, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import { fetchAllSubCategoryStartAsync } from '../../redux/sub-category/subCategory.actions';
import { fetchCategoryStartAsync } from '../../redux/cateogry/category.actions';
import AddSubCategory from './add-subCategory.component';

const SearchSubCategory = ({
    SubCategoryData,
    categoryData,
    isFetching,
    currentSubCategory,
    fetchAllSubCategoryStartAsync,
    fetchCategoryStartAsync,
    setCurrentSubCategory,
}) => {

    const [filters, setFilters] = useState({ Name: "", Description: "" });
    const [debouncedFilters, setDebouncedFilters] = useState(filters);
    const [filteredSubCategories, setFilteredSubCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Fetch data on mount
    useEffect(() => {
        fetchAllSubCategoryStartAsync();
        fetchCategoryStartAsync();
    }, [fetchAllSubCategoryStartAsync, fetchCategoryStartAsync]);

    // Debounce filters
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedFilters(filters), 300);
        return () => clearTimeout(handler);
    }, [filters]);

    // Filtering
    useEffect(() => {
        if (!SubCategoryData) return;
        let result = [...SubCategoryData];

        if (debouncedFilters.Name) {
            result = result.filter(sub => sub.name.toLowerCase().includes(debouncedFilters.Name.toLowerCase()));
        }
        if (debouncedFilters.Description) {
            result = result.filter(sub => sub.description.toLowerCase().includes(debouncedFilters.Description.toLowerCase()));
        }

        setFilteredSubCategories(result);
        setCurrentPage(1);
    }, [debouncedFilters, SubCategoryData]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // Pagination
    const paginatedSubCategories = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredSubCategories.slice(start, start + itemsPerPage);
    }, [currentPage, filteredSubCategories]);

    const totalPages = Math.ceil(filteredSubCategories.length / itemsPerPage);

    return (
        <div className="container">
            <h3>Search SubCategories</h3>

            <div className="form-group">
                <label>Name</label>
                <input
                    type="text"
                    name="Name"
                    value={filters.Name}
                    onChange={handleFilterChange}
                    placeholder="Search by name"
                />

                <label className="mt-2">Description</label>
                <input
                    type="text"
                    name="Description"
                    value={filters.Description}
                    onChange={handleFilterChange}
                    placeholder="Search by description"
                />
            </div>

            {isFetching && <div>Loading...</div>}

            {/* Table */}
            <table className="table table-bordered mt-2">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Image</th>
                        <th>Select</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedSubCategories.map(sub => (
                        <tr key={sub.id}>
                            <td>{sub.name}</td>
                            <td>{sub.description}</td>
                            <td>{categoryData.find(cat => cat.id === sub.category)?.name || ''}</td>
                            <td>
                                {sub.imageUrl && <img src={sub.imageUrl} alt="subcat" width="50" />}
                            </td>
                            <td>
                                <button
                                    className="btn btn-sm btn-success"
                                    onClick={() => setCurrentSubCategory(sub)}
                                >
                                    Select
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            {filteredSubCategories.length > 0 && (
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

            {/* ---------- Selected SubCategory Section ---------- */}
            <div className="mt-4">
                {currentSubCategory ? (
                    <div>
                        <AddSubCategory selectedSubCategory={currentSubCategory} />
                        <button className="btn btn-warning mt-2" onClick={() => setCurrentSubCategory(null)}>
                            Clear Selection
                        </button>
                    </div>
                ) : (
                    <p>No subcategory selected. Click a row to edit.</p>
                )}
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    SubCategoryData: state.subCategory.subCategory,
    categoryData: state.category.category,
    isFetching: state.subCategory.isFetching,
    currentSubCategory: state.subCategory.currentSubCategory,
});

const mapDispatchToProps = dispatch => ({
    fetchAllSubCategoryStartAsync: () => dispatch(fetchAllSubCategoryStartAsync()),
    fetchCategoryStartAsync: () => dispatch(fetchCategoryStartAsync()),
    setCurrentSubCategory: (subCat) => dispatch({ type: 'SET_CURRENT_SUBCATEGORY', payload: subCat }),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchSubCategory);
