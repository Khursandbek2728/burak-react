import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Button, Container, Stack } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Badge from "@mui/material/Badge";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { CssVarsProvider } from "@mui/joy/styles";
import Card from "@mui/joy/Card";

import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setProducts } from "./slice";
import { createSelector } from "reselect";
import { retrieveProducts } from "./selector";
import { Product, ProductInquiry } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product-enum";
import { serverApi } from "../../../lib/config";
import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";

/** REDUX SLICE & SELECTOR */
const actionDispatch = (dispatch: Dispatch) => ({
  setProducts: (data: Product[]) => dispatch(setProducts(data)),
});

const productsRetriever = createSelector(retrieveProducts, (products) => ({
  products,
}));

interface ProductsProps {
  onAdd: (item: CartItem) => void
}


export default function Products(props: ProductsProps) {
  const {onAdd} = props
  const { setProducts } = actionDispatch(useDispatch());
  const { products } = useSelector(productsRetriever);
  const [productSearch, setProductSearch] = useState<ProductInquiry>({
    page: 1,
    limit: 6,
    order: "createdAt",
    productCollection: ProductCollection.DISH,
    search: "",
});

const [searchText, setSearchText] = useState<string>("")
const history = useHistory();

useEffect(() => {
      const product = new ProductService();
      product
          .getProducts(productSearch)
          .then((data) => setProducts(data))
          .catch((err) => console.log(err));
  }, [productSearch]);

useEffect(() => {
    if (searchText === "") {
        productSearch.search = "";
        setProductSearch({ ...productSearch });
    }
}, [searchText]);


  /** HANDLERS **/

const searchCollectionHandler = (collection: ProductCollection) => {      // Bu kod productcollectionga qarab filterlaydi
      productSearch.page = 1;
      productSearch.productCollection = collection;
      setProductSearch({ ...productSearch });
  };

const searchOrderHandler = (order :string) => {     /// bu kod order boyicha filterlaydi masalan createdAt, productPrice
      productSearch.page = 1;
      productSearch.order = order;
      setProductSearch({ ...productSearch });
  }

const searchProductHandler = () => {
    productSearch.search = searchText;
    setProductSearch({...productSearch})
  }

const paginationHandler = (e: ChangeEvent<any>, value: number) => {
    productSearch.page = value;
    setProductSearch({ ...productSearch });
};

const chooseDishHandler = (id: string) => {
    history.push(`/products/${id}`);
};


    return (
      <div className={"products"}>
        <Container>
          <Stack flexDirection={"column"} alignItems={"center"}>
          <Stack className={"avatar-big-box"}>
            <Stack className="main-title">
              <Box className={"title"}>Burak Restaurant</Box>
              <Stack className="single-search-form">
                <input
                className="search-box"
                type={"search"}
                placeholder="Type here..."
                value={searchText}
                onChange={(e)=> setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") searchProductHandler();
                }}

                />
                <Button
                color={"primary"} 
                variant={"contained"}
                className={"search-btn"}
                onClick={searchProductHandler}
                >
                  SEARCH
                  <SearchIcon />
                </Button>
              </Stack>
            </Stack>
          </Stack>
            <Stack className={"dishes-filter-section"}>
              <Stack className={"dishes-filter-box"}>
                <Button
                  variant={"contained"}
                  color={productSearch.order === "createdAt" ? "primary" : "secondary"}
                  className={"order"}
                  onClick={() => searchOrderHandler("createdAt")}
                >
                  New
                </Button>
                <Button
                  variant={"contained"}
                  color={productSearch.order === "productPrice" ? "primary" : "secondary"}
                  className={"order"}
                  onClick={() => searchOrderHandler("productPrice")}
                >
                  Price
                </Button>
                <Button
                  variant={"contained"}
                  color={productSearch.order === "productViews" ? "primary" : "secondary"}
                  className={"order"}
                  onClick={() => searchOrderHandler("productViews")}
                >
                  Views
                </Button>
              </Stack>
            </Stack>
  
            <Stack className={"list-category-section"}>
              <Stack className={"product-category"}>
                <div className={"category-main"}>
                  <Button variant={"contained"} color={ productSearch.productCollection === ProductCollection.OTHER ? "primary" : "secondary"} 
                   onClick={() => searchCollectionHandler(ProductCollection.OTHER)}>
                    Other
                  </Button>
                  <Button variant={"contained"} color={ productSearch.productCollection === ProductCollection.DESSERT ? "primary" : "secondary"} 
                   onClick={() => searchCollectionHandler(ProductCollection.DESSERT)}>
                    Dessert
                  </Button>
                  <Button variant={"contained"} color={ productSearch.productCollection === ProductCollection.DRINK ? "primary" : "secondary"} 
                   onClick={() => searchCollectionHandler(ProductCollection.DRINK)}>
                    Drink
                  </Button>
                  <Button variant={"contained"} color={ productSearch.productCollection === ProductCollection.SALAD ? "primary" : "secondary"} 
                  onClick={() => searchCollectionHandler(ProductCollection.SALAD)}>
                    Salad
                  </Button>
                  <Button variant={"contained"} color={ productSearch.productCollection === ProductCollection.DISH ? "primary" : "secondary"} 
                  onClick={() => searchCollectionHandler(ProductCollection.DISH)}>
                    Dish
                  </Button>
                </div>
              </Stack>
  
              <Stack className={"product-wrapper"}>
                {products.length !== 0 ? (
                  products.map((product:Product) => {
                    const imagePath = `${serverApi}/${product.productImages[0]}`
                    const sizeVolume = product.productCollection === ProductCollection.DRINK ? product.productVolume + " liter" : product.productSize + " size"
                    return (
                      <Stack key={product._id} className={"product-card"} 
                      onClick={() => chooseDishHandler(product._id)}>
                        <Stack
                          className={"product-img"}
                          sx={{ backgroundImage: `url(${imagePath})` }}
                        >
                          <div className={"product-sale"}>{sizeVolume}</div>
                          <Button className={"shop-btn"} 
                          onClick={(e) => {
                            console.log("Button Pressed!");
                          onAdd({
                            _id: product._id,
                            quantity: 1,
                            name: product.productName,
                            price: product.productPrice,
                            image: product.productImages[0],
                          })
                            e.stopPropagation();
                          }}>
                            <img
                              src="/icons/shopping-cart.svg"
                              style={{ display: "flex" }}
                            />
                          </Button>
                          <Button className={"view-btn"} sx={{ right: "36px" }}>
                            <Badge badgeContent={product.productViews} color="secondary">
                              <RemoveRedEyeIcon
                                sx={{
                                  color: product.productViews === 0 ? "grey" : "white",
                                }}
                              />
                            </Badge>
                          </Button>
                        </Stack>
                        <Box className={"product-desc"}>
                          <span className={"product-title"}>
                            {product.productName}
                          </span>
                          <div className={"product-desc"}>
                            <MonetizationOnIcon />
                            {product.productPrice}
                          </div>
                        </Box>
                      </Stack>
                    );
                  })
                ) : (
                  <Box className="no-data">Products are not available!</Box>
                )}
              </Stack>
            </Stack>
  
            <Stack className={"pagination-section"}>
            <Pagination
              count={
                  products.length !== 0
                  ? productSearch.page + 1
                  : productSearch.page
              }
              page={productSearch.page}
              renderItem={(item) => (
                  <PaginationItem
                      components={{
                          previous: ArrowBackIcon,
                          next: ArrowForwardIcon,
                      }}
                      {...item}
                      color="secondary"
                  />
              )}
              onChange={paginationHandler}
          />

            </Stack>
          </Stack>
        </Container>
  
        <div className={"brands-logo"}>
          <Container className={"family-brands"}>
            <Box className={"category-title"}>Our Family Brands</Box>
            <Stack className={"brand-list"}>
              <Box className={"review-box"}>
                <img src={"/img/gurme.webp"} />
              </Box>
              <Box className={"review-box"}>
                <img src={"/img/sweets.webp"} />
              </Box>
              <Box className={"review-box"}>
                <img src={"/img/seafood.webp"} />
              </Box>
              <Box className={"review-box"}>
                <img src={"/img/doner.webp"} />
              </Box>
            </Stack>
          </Container>
        </div>
  
        <div className={"address"}>
          <Container>
            <Stack className={"address-area"}>
              <Box className={"title"}>Our address</Box>
              <iframe
                style={{ marginTop: "60px" }}
                src="https://www.google.com/maps/d/embed?mid=1XK-f2FfchtNWmKA9DGrUzHvnTD8&f=q&source=s_q&hl=pt-BR&geocode&q=Anam-dong%20Seongbuk-Gu%2C%20Seoul%2C%20136-701%20Korea&ie=UTF8&oe=UTF8&msa=0&sll=37.585838%2C127.021353&sspn=0.020749%2C0.028168&ll=37.59253999999999%2C127.02774499999997&spn=0.00777%2C0.013797&z=16&output=embed"
                width="1320"
                height="500"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </Stack>
          </Container>
        </div>
      </div>
    );
  }