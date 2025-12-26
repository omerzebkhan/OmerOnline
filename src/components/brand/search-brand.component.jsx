import React, { useState, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import {
    fetchBrandStartAsync,
    setCurrentBrand,
} from "../../redux/brands/brands.actions";
import AddBrand from "./brand.component"

const SearchBrand = ({
    brandData,
    isFetching,
    errorMessage,
    currentBrand,
    fetchBrandStartAsync,
    setCurrentBrand,
}) => {
    const [filters, setFilters] = useState({ Name: "", Description: "" });
    const [debouncedFilters, setDebouncedFilters] = useState(filters);
    const [filteredBrands, setFilteredBrands] = useState([]);

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    //Clean up function
    useEffect(() => {
    return () => {
        setCurrentBrand(null);
    };
}, []);


    useEffect(() => {
        fetchBrandStartAsync();
    }, [fetchBrandStartAsync]);

    // debounce filters
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedFilters(filters);
        }, 300);
        return () => clearTimeout(handler);
    }, [filters]);

    // Filtering
    useEffect(() => {
        if (!brandData) return;

        let result = [...brandData];
        if (debouncedFilters.Name) {
            result = result.filter((b) =>
                b.name.toLowerCase().includes(debouncedFilters.Name.toLowerCase())
            );
        }
        if (debouncedFilters.Description) {
            result = result.filter((b) =>
                b.description.toLowerCase().includes(debouncedFilters.Description.toLowerCase())
            );
        }

        setFilteredBrands(result);
        setCurrentPage(1); // reset to first page
    }, [debouncedFilters, brandData]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    // paginate
    const paginatedBrands = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredBrands.slice(start, start + itemsPerPage);
    }, [currentPage, filteredBrands]);

    const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);

    return (
        <div>
            <h3>Search Brands</h3>

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
                    {paginatedBrands.map((brand) => (
                        <tr key={brand.id}>
                            <td>{brand.name}</td>
                            <td>{brand.description}</td>
                            <td>
                                <img src={brand.imageUrl} alt="brand" width="50" />
                            </td>
                            <td>
                                <button
                                    className="btn btn-sm btn-success"
                                    onClick={() => setCurrentBrand(brand)}
                                >
                                    Select
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            {filteredBrands.length > 0 && (
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

            {/* ---------- Selected Brand Section ---------- */}
            <div className="mt-4">
                {currentBrand ? (
                    <div>
                    <AddBrand selectedBrand={currentBrand} />
                    <button className="btn btn-warning" onClick={() => setCurrentBrand(null)}>
    Clear Selection
</button>
                    </div>
                ) : (
                    <p>No brand selected. Click a row to edit.</p>
                )}
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    brandData: state.brand.brands,
    isFetching: state.brand.isFetching,
    errorMessage: state.brand.errorMessage,
    currentBrand: state.brand.currentBrand,
});

const mapDispatchToProps = (dispatch) => ({
    fetchBrandStartAsync: () => dispatch(fetchBrandStartAsync()),
    setCurrentBrand: (brand) => dispatch(setCurrentBrand(brand)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBrand);
