import axios from "axios";
import React, { DOMElement, ReactElement, useEffect, useState } from "react";
import {
  basketItem,
  cart_item,
  item_generic,
  productSearchItem,
  shoppingList,
} from "../utilities/interfaces";
import {
  Card,
  InputGroup,
  Row,
  Form,
  CardGroup,
  Container,
  Button,
  Col,
} from "react-bootstrap";
import StoreModal from "../components/StoreModal";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import ProductSearch from "../components/ProductSearch";
import conversionMachine from "../utilities/conversionMachine";
import { Unit } from "convert-units";

export interface handleManageBasketProps {
  action: string;
  amount: number;
  unit: Unit;
}

const Store = () => {
  const {
    upsertItem,
    userData,
    manageCart,
    basketData,
    manageBasket,
    refreshContext,
  } = useAuth();

  const [isChecked, setIsChecked] = useState<number[]>([]);
  const shoppingList = userData?.cart;
  // const binCart = {
  //   freezer: shoppingList?.filter((item) => item.bin == "freezer") || [],
  //   fridge: shoppingList?.filter((item) => item.bin == "fridge") || [],
  //   pantry: shoppingList?.filter((item) => item.bin == "pantry") || [],
  //   closet: shoppingList?.filter((item) => item.bin == "closet") || [],
  // };
  const binCart: cart_item[][] = [
    shoppingList?.filter((item) => item.bin == "freezer") || [],
    shoppingList?.filter((item) => item.bin == "fridge") || [],
    shoppingList?.filter((item) => item.bin == "pantry") || [],
    shoppingList?.filter((item) => item.bin == "closet") || [],
  ];
  const bins = ["freezer", "fridge", "pantry", "closet"];
  const homeList = userData?.items;
  const [selectedItem, setSelectedItem] = useState<cart_item>();
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [atHome, setAtHome] = useState<{ amount: number; unit: Unit | null }>({
    amount: 0,
    unit: null,
  });

  //Modal functions
  const handleClose = () => {
    setShow(false);
  };

  const handleShow = (cart_item: cart_item) => {
    setSelectedItem(cart_item);
    let ahi = homeList?.find(
      (home_item: item_generic) => home_item.product == cart_item.product
    );
    setAtHome({ amount: ahi?.quantity || 0, unit: ahi?.unit || null });
    setShow(true);
  };

  // Cart functions
  const handleManageBasket = async ({
    action,
    amount,
    unit,
  }: handleManageBasketProps) => {
    if (!selectedItem) return;
    if (isChecked.includes(selectedItem.product)) {
      const result = await manageBasket({
        product: selectedItem.product,
        amount: amount,
        action: action,
        unit: unit,
      });
    }
    manageCart({
      product: selectedItem.product,
      amount: amount,
      action: action,
      unit: unit,
    });

    handleClose();
  };

  const handleCheck = (item: cart_item, checked: boolean) => {
    let action = checked ? "add" : "remove";
    manageBasket({
      product: item.product,
      amount: item.quantity,
      action: action,
      unit: item.unit,
    });
  };
  const handleAdd = (result: productSearchItem) => {
    // Check if already in cart
    const exists = shoppingList?.some(
      (item: cart_item) => result.product == item.product
    );
    if (exists) {
      toast.error(
        "Item already in cart! Adjust quantity by tapping cart-item."
      );
      return;
    }

    manageCart({
      product: result.product,
      amount: 1,
      action: "add",
      unit: "fl-oz",
    });
  };

  const handlePurchase = async () => {
    let total = 0;
    const localBasket = localStorage.getItem("basket");
    const basket = localBasket ? JSON.parse(localBasket) : [];

    const response = await Promise.all(
      basket.items.map(async (item: basketItem) => {
        total += 1;
        let homeItem = userData?.items.find(
          (hi) => hi.product === item.product
        );
        let newUnit;
        let newAmount;
        if (homeItem === undefined || item.unit === homeItem.unit) {
          newAmount = item.amount;
          newUnit = item.unit;
        } else {
          newAmount = conversionMachine({
            amount: item.amount,
            source: item.unit,
            target: homeItem.unit,
          });
          newUnit = homeItem.unit;
        }

        let res = await upsertItem({
          product: item.product,
          amount: newAmount,
          unit: newUnit,
        });
        return res?.message;
      })
    );
    refreshContext("purchase");
    toast.success(`Successfully added ${total} item${total > 1 ? "s" : ""}.`);
  };

  // Preserve checks on refresh
  useEffect(() => {
    let arr: number[] = [];
    basketData?.items.map((item) => {
      arr.push(item.product);
    });
    setIsChecked(arr);
  }, [basketData]);

  return (
    <div>
      {show && (
        <StoreModal
          show={show}
          handleClose={handleClose}
          selectedItem={selectedItem}
          handleManageBasket={handleManageBasket}
          atHome={atHome}
        />
      )}

      <div
        className="d-flex align-items-end justify-content-between mt-5"
        style={{ gap: "4px", maxWidth: "40rem" }}
      >
        <h1 className="text-white">Shopping List</h1>
        {edit ? (
          <div
            className="rounded px-2 my-2 mx-1 text-white bright-submit"
            onClick={() => setEdit(false)}
          >
            Done
          </div>
        ) : (
          <div
            className="rounded px-2 my-2 mx-1 text-white bright-orange"
            onClick={() => setEdit(true)}
          >
            Edit
          </div>
        )}
      </div>
      <div
        style={{ gap: "4px", maxWidth: "40rem" }}
        className="d-flex flex-wrap justify-content-between"
      >
        <div
          id="stockBox"
          style={{
            minHeight: "7rem",
            overflowY: "scroll",
            border: "2px solid #3960E8",
            maxWidth: "40rem",
            background: "#141414",
            gap: "12px",
          }}
          className="shadow-lg mt-3 mx-1 position-relative p-2 w-100 rounded d-flex flex-column align-items-start "
        >
          {shoppingList
            ? bins.map((bin, i) => {
                return (
                  <div key={bin} className="px-1 w-100">
                    {/* Bin title */}
                    {binCart !== undefined && binCart[i].length > 0 && (
                      <div
                        style={{
                          borderBottom: "2px solid #A1D3FF",
                          marginBottom: "5px",
                        }}
                      >
                        {bin.charAt(0).toUpperCase() + bin.slice(1)}
                      </div>
                    )}
                    {/* Bin items */}
                    <div className="g-0 masonry-with-columns">
                      {binCart[i].map((item: cart_item, i: number) => {
                        return (
                          <div
                            className="py-1 d-flex align-items-center masonry-div"
                            style={{
                              gap: "3px",
                              marginBottom: "5px",
                            }}
                            key={`${bin}${i}`}
                          >
                            <label htmlFor={`${bin}${i}`}>
                              <Card
                                style={{
                                  background: "black",
                                  gap: "5px",
                                  padding: "3px 2px 3px 8px",
                                }}
                                className="w-100 item-bright shadow-lg h-33 d-flex flex-row justify-content-between align-items-center flex-nowrap "
                                onClick={
                                  edit ? () => handleShow(item) : () => null
                                }
                              >
                                {!edit ? (
                                  <input
                                    type="checkbox"
                                    id={`${bin}${i}`}
                                    checked={isChecked.includes(item.product)}
                                    onChange={(e) =>
                                      handleCheck(item, e.target.checked)
                                    }
                                    style={{ accentColor: "#df5296" }}
                                  />
                                ) : (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    className="bi bi-sliders2 fill-sliders"
                                    viewBox="0 0 16 16"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10.5 1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4H1.5a.5.5 0 0 1 0-1H10V1.5a.5.5 0 0 1 .5-.5ZM12 3.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5Zm-6.5 2A.5.5 0 0 1 6 6v1.5h8.5a.5.5 0 0 1 0 1H6V10a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5ZM1 8a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 1 8Zm9.5 2a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V13H1.5a.5.5 0 0 1 0-1H10v-1.5a.5.5 0 0 1 .5-.5Zm1.5 2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5Z"
                                    />
                                  </svg>
                                )}
                                <div
                                  className={`text-nowrap ${
                                    edit ? "" : "cart-check"
                                  }`}
                                >
                                  {item.name}
                                </div>
                                <div className="bkg-maroon d-flex text-center rounded px-1 gap-1">
                                  <span>{item.quantity}</span>
                                  <span className="text-nowrap">
                                    {item.unit}
                                  </span>
                                </div>
                              </Card>
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            : null}
        </div>
        <div
          style={{
            maxWidth: "40rem",
            width: "40rem",
            gap: "5px",
          }}
          className="mx-1 d-flex justify-content-between flex-nowrap"
        >
          {/* Product search */}
          <ProductSearch handleAdd={handleAdd} />
          <Button
            variant="outline-dark"
            style={{
              width: "auto",
              border: "2px solid #705151",
              color: "white",
              flexShrink: "1",
            }}
            onClick={() =>
              isChecked.length > 0
                ? handlePurchase()
                : toast.error("No items checked off!")
            }
          >
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Store;
