import React, { useEffect, useState, useMemo } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import { Card, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

import { fetchItemByInputAsync } from "../../redux/item/item.action";
import { fetchCartDetailByCust } from "../../redux/cart/cart.actions";
import { logout } from "../../redux/user/user.action";

import cartService from "../../services/cart.services";
import Header from "./header.component";

const ItemList = ({ fetchItemByInputAsync, itemData = [], currentCategory }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const currentUser = useSelector((state) => state.user?.user?.user || null);

  const refreshCat =
    localStorage.getItem("localCategory") || currentCategory;

  const [message, setMessage] = useState("");
  const [itemInput, setItemInput] = useState("");

  // ---------- FIX: Protect itemData always ----------
  const safeItems = Array.isArray(itemData) ? itemData : [];

  // Scroll into view when user returns after login
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const itemId = params.get("item");

    if (itemId) {
      setTimeout(() => {
        const element = document.getElementById(`item-${itemId}`);
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 300);
    }
  }, [safeItems, location.search]);

  // Fetch items when category changes
  useEffect(() => {
    if (fetchItemByInputAsync && refreshCat) {
      fetchItemByInputAsync(refreshCat);
    }
  }, [refreshCat]);

  // Unique brand list (memoized)
  const brandList = useMemo(() => {
    const unique = new Set();
    safeItems.forEach((i) => {
      if (i?.brands?.name) unique.add(i.brands.name);
    });
    return [...unique];
  }, [safeItems]);

  // Filter items by search input
  const filteredItems = useMemo(() => {
    if (!itemInput.trim()) return safeItems;
    return safeItems.filter((item) =>
      item.name.toLowerCase().includes(itemInput.toLowerCase())
    );
  }, [itemInput, safeItems]);

  const handleChange = (e) => setItemInput(e.target.value);

  const viewDetail = (item) =>
    navigate(`/ItemDetail`, { state: { id: item } });

  const addToCart = async (item) => {
    if (!currentUser) {
      localStorage.setItem(
        "postLoginRedirect",
        `/ItemList?item=${item.id}`
      );
      navigate("/login");
      return;
    }

    try {
      const baseData = {
        userid: currentUser.id,
        status: "INPROGRESS",
        itemid: item.id,
        quantity: 1,
        cartstatus: "Add",
        price: item.onlineprice,
        cost: item.averageprice,
      };

      const cartResp = await cartService.getCartDetailByCust(
        currentUser.id
      );
      const cartItems = cartResp.data || [];

      if (cartItems.length === 0) {
        const resp = await cartService.create(baseData);
        setMessage(`New Cart Created. Cart ID = ${resp.data.id}`);
        return;
      }

      const cartId = cartItems[0].id;
      const existingItem = cartItems.find(
        (c) => c.itemid === item.id
      );

      if (!existingItem) {
        await cartService.createCartDetail({
          ...baseData,
          cartid: cartId,
        });
        setMessage("Cart updated with new item.");
        return;
      }

      await cartService.updateCartDetail(existingItem.cartid, {
        quantity: existingItem.quantity + 1,
      });

      setMessage("Item quantity updated in cart.");
    } catch (error) {
      if (error.response?.status === 401) {
        dispatch(logout());
        navigate("/login");
      }
      console.error("Cart Error:", error);
    }
  };

  return (
    <div>
      <Header />

      {message && <div className="alert alert-warning">{message}</div>}

      <div className="row mt-3">
        {/* LEFT COLUMN */}
        <div className="col-sm-2">
          <label>Search Item</label>
          <input
            type="text"
            id="Name"
            value={itemInput}
            className="form-control"
            onChange={handleChange}
            placeholder="Name"
          />

          <label className="mt-3">Brand List</label>
          <select className="form-control">
            {brandList.map((b, i) => (
              <option key={i}>{b}</option>
            ))}
          </select>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-sm-10">
          <div className="grid">
            {filteredItems.length > 0 ? (
              filteredItems.map(
                (item, index) =>
                  item.online > 0 && (
                    <div key={index} id={`item-${item.id}`}>
                      <Card style={{ width: "18rem" }} className="box">
                        <Card.Img
                          variant="top"
                          width="100"
                          height="100"
                          className="card-img-top"
                          src={
                            import.meta.env.VITE_S3 === "True"
                              ? item.imageUrl
                              : `${import.meta.env.VITE_MIDDLEWARE}/itemsImages/${item.imageUrl}`
                          }
                          alt="no data"
                        />
                        <Card.Body>
                          <Card.Title className="text-success">
                            {item.description}
                          </Card.Title>

                          <Card.Text className="text-decoration-line-through">
                            {item.showroomprice}
                          </Card.Text>

                          <Card.Text className="text-primary">
                            {item.onlineprice} Rs — Qty {item.online}
                          </Card.Text>

                          <Button
                            variant="primary"
                            onClick={() => addToCart(item)}
                          >
                            Add to Cart
                          </Button>

                          <Button
                            className="btn btn-warning ml-2"
                            onClick={() => viewDetail(item)}
                          >
                            Details
                          </Button>
                        </Card.Body>
                      </Card>
                    </div>
                  )
              )
            ) : (
              <p>No items found...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  itemData: state.item.items || [],
  currentCategory: state.category.currentCategory,
});

export default connect(mapStateToProps, {
  fetchItemByInputAsync,
  fetchCartDetailByCust,
})(ItemList);
