import React, { useCallback, useMemo } from "react";
import { connect } from "react-redux";
import { setCurrentBrand } from "../../redux/brands/brands.actions";

import ManageBrand from "./manage-brand.component";

const ListBrand = ({ brands = [], masterComp, currentBrand, setCurrentBrand }) => {

  // --- Memoize S3 flag so it does not recalc on every render ---
  const isS3 = useMemo(() => import.meta.env.VITE_S3 === "True", []);

  // --- Memoize base image URL ---
  const baseImagePath = useMemo(
    () => import.meta.env.VITE_MIDDLEWARE + "/brandsImages/",
    []
  );

  // --- Avoid re-renders by wrapping in useCallback ---
  const handleSelectBrand = useCallback(
    (brand) => {
      setCurrentBrand(brand);
    },
    [setCurrentBrand]
  );

  // --- Render table rows once ---
  const rows = useMemo(
    () =>
      brands.map((item, index) => {
        const imgSrc = isS3 ? item.imageUrl : `${baseImagePath}${item.imageUrl}`;

        return (
          <tr key={index} onClick={() => handleSelectBrand(item)}>
            <td>{item.name}</td>
            <td>{item.description}</td>
            <td>
              <img src={imgSrc} alt="brand" width="100" height="100" />
            </td>

            {masterComp === "AddItem" && <td>Select</td>}
          </tr>
        );
      }),
    [brands, isS3, baseImagePath, handleSelectBrand, masterComp]
  );

  return (
    <div>
      <h3>Brands View</h3>

      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Image</th>
            {masterComp === "AddItem" && <th>Action</th>}
          </tr>
        </thead>

        <tbody>{rows}</tbody>
      </table>

      <div className="col-md-6">
        {currentBrand && !masterComp ? (
          <ManageBrand currentBrand={currentBrand} />
        ) : (
          <div>
            <br />
            <p>Please click on a Brand...</p>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  currentBrand: state.brand.currentBrand,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentBrand: (brand) => dispatch(setCurrentBrand(brand)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ListBrand);

