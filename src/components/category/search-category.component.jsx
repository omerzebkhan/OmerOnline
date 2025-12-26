import React, { useState, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import {
    fetchCategoryStartAsync,
    setCurrentCategory,
} from "../../redux/cateogry/category.actions";

import AddCategory from "./category.component";

const SearchCategory = ({
    categoryData,
    isFetching,
    errorMessage,
    currentCategory,
    fetchCategoryStartAsync,
    setCurrentCategory,
}) => {
    const [filters, setFilters] = useState({ Name: "", Description: "" });
    const [debouncedFilters, setDebouncedFilters] = useState(filters);
    const [filteredCategories, setFilteredCategories] = useState([]);

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // clear selection on unmount
    useEffect(() => {
        return () => {
            setCurrentCategory(null);
        };
    }, []);

    // load data
    useEffect(() => {
        fetchCategoryStartAsync();
    }, [fetchCategoryStartAsync]);

    // debounce inputs
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedFilters(filters);
        }, 300);
        return () => clearTimeout(handler);
    }, [filters]);

    // Filtering
    useEffect(() => {
        if (!categoryData) return;

        let result = [...categoryData];

        if (debouncedFilters.Name) {
            result = result.filter((c) =>
                c.name.toLowerCase().includes(debouncedFilters.Name.toLowerCase())
            );
        }
        if (debouncedFilters.Description) {
            result = result.filter((c) =>
                c.description
                    ?.toLowerCase()
                    .includes(debouncedFilters.Description.toLowerCase())
            );
        }

        setFilteredCategories(result);
        setCurrentPage(1);
    }, [debouncedFilters, categoryData]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    // pagination
    const paginatedCategories = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredCategories.slice(start, start + itemsPerPage);
    }, [currentPage, filteredCategories]);

    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

    return (
        <div>
            <h3>Search Categories</h3>

            {/* Filters */}
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
            {errorMessage && <div className="text-danger">{errorMessage}</div>}

            {/* Table */}
            <table className="table table-bordered mt-2">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Image</th>
                        <th>Select</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedCategories.map((cat) => (
                        <tr key={cat.id}>
                            <td>{cat.name}</td>
                            <td>{cat.description}</td>
                            <td>
                    <img
                        src={
                            import.meta.env.VITE_S3 === "True"
                                ? cat.imageUrl
                                : `${import.meta.env.VITE_MIDDLEWARE}/categoriesImages/${cat.imageUrl}`
                        }
                        width="50"
                        height="50"
                        alt=""
                    />
                </td>

                            <td>
                                <button
                                    className="btn btn-sm btn-success"
                                    onClick={() => setCurrentCategory(cat)}
                                >
                                    Select
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            {filteredCategories.length > 0 && (
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

            {/* Selected Category Section */}
            <div className="mt-4">
                {currentCategory ? (
                    <div>
                        <AddCategory selectedCategory={currentCategory} />
                        <button
                            className="btn btn-warning mt-2"
                            onClick={() => setCurrentCategory(null)}
                        >
                            Clear Selection
                        </button>
                    </div>
                ) : (
                    <p>No category selected. Click a row to edit.</p>
                )}
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    categoryData: state.category.category,
    isFetching: state.category.isFetching,
    errorMessage: state.category.errorMessage,
    currentCategory: state.category.currentCategory,
});

const mapDispatchToProps = (dispatch) => ({
    fetchCategoryStartAsync: () => dispatch(fetchCategoryStartAsync()),
    setCurrentCategory: (cat) => dispatch(setCurrentCategory(cat)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchCategory);
