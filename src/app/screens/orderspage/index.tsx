import React, { SyntheticEvent, useEffect, useState } from "react";
import { Box, Container, Grid, Stack, TextField } from "@mui/material";
import { Dispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import PausedOrders from "./PausedOrders";

import FinishedOrders from "./FinishedOrders";
import LocationOnIcon from "@mui/icons-material/LocationOn"
import { Order, OrderInquery } from "../../../lib/types/order";
import { setFinishedOrders, setPausedOrders, setProcessOrders } from "./slice";
import { OrderStatus } from "../../../lib/enums/order-enum";
import OrderService from "../../services/OrderService";
import { useGlobals } from "../../hooks/useGlobals";
import "../../../css/order.css";
import { useHistory } from "react-router-dom";
import { serverApi } from "../../../lib/config";
import { MemberType } from "../../../lib/enums/member-enum";
import ProcessOrders from "./ProcessedOrders";


const actionDispatch = (dispatch: Dispatch) => ({
  setPausedOrders: (data: Order[]) => dispatch(setPausedOrders(data)),
  setProcessOrders: (data: Order[]) => dispatch(setProcessOrders(data)),
  setFinishedOrders: (data: Order[]) => dispatch(setFinishedOrders(data)),
});



export default function OrdersPage() {
  const [value, setValue] = useState("1");
  const {setPausedOrders, setProcessOrders, setFinishedOrders} = actionDispatch(useDispatch());
  const {orderBuilder, authMember} = useGlobals();
  const history = useHistory();
  const [orderInquiry, setOrderInquiry] = useState<OrderInquery>({
    page: 1,
    limit: 5,
    orderStatus: OrderStatus.PAUSE,
  });

  useEffect(() => {
    const order = new OrderService();

    order.getMyOrders({...orderInquiry, orderStatus: OrderStatus.PAUSE})
    .then((data) => setPausedOrders(data))
    .catch((err) => console.log(err));

    order.getMyOrders({...orderInquiry, orderStatus: OrderStatus.PROCESS})
    .then((data) => setProcessOrders(data))
    .catch((err) => console.log(err));

    order.getMyOrders({...orderInquiry, orderStatus: OrderStatus.FINISH})
    .then((data) => setFinishedOrders(data))
    .catch((err) => console.log(err));

  }, [orderInquiry, orderBuilder]);

  const handleChange = (e: SyntheticEvent, newValue: string)  => {
    setValue(newValue);
  };
    if (!authMember) history.push("/");
    return (
      <div className={"order-page"}>
        <Container className={"order-container"}>
          <Stack className={"order-left"}>
            <TabContext value={value}>
              <Box className={"order-nav-frame"}>
                <Box sx={{ borderBottom: 1, borderColor: "divider"}}>
                  <Tabs 
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                  className={"table_list"}
                  >
                    <Tab label="PAUSED ORDERS" value={"1"} />
                    <Tab label="PROCESS ORDERS" value={"2"} />
                    <Tab label="FINISHED ORDERS" value={"3"} />
                  </Tabs>
                </Box>
              </Box>
              <Stack className={"order-main-content"}>
                <PausedOrders setValue={setValue}/>
                <ProcessOrders setValue={setValue}/>
                <FinishedOrders />
              </Stack>
            </TabContext>
          </Stack>

          <Stack className={"order-right"}>
            <Box className={"order-info-box"}>
              <Box className={"member-box"}>
                <div className={"order-user-img"}>
                  <img 
                  src={
                    authMember?.memberImage 
                    ? `${serverApi}/${authMember?.memberImage}`
                    : "/icons/default-user.svg"
                  }
                  className={"order-user-avatar"}
                  alt={""}
                   />
                   <div className={"order-user-icon-box"}>
                  <img 
                  src={ 
                    authMember?.memberType === MemberType.RESTAURANT 
                    ? "/icons/restaurant.svg" 
                    : "/icons/user-badge.svg"
                  }
                  className={"order-user-prof-img"}
                  alt={""}
                   />
                </div>
                </div>
                <span className={"order-user-name"}>{authMember?.memberNick}</span>
                <span className={"order-user-prof"}>{authMember?.memberType}</span>
              </Box>
              <Box className={"liner"}></Box>
              <Box className={"order-user-address"}>
                <div style={{display: "flex"}}>
                  <LocationOnIcon />
                </div>
                <Box className={"spec-address-txt"}>{
                authMember?.memberAddress 
                ? authMember.memberAddress 
                : "No address"
                }
                </Box>
              </Box>
            </Box>
            <Stack className="order-card-right">
              <form style={{height: "auto"}}>
              <Box className={"card-input"}>
          <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              placeholder="Card number : 5243 4090 2002 7495"
              fullWidth
              InputProps={{
                sx: {
                  backgroundColor: "#ffffff",
                  borderRadius: "10px",
                },
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              placeholder="07 / 24"
              fullWidth
              InputProps={{
                sx: {
                  backgroundColor: "#ffffff",
                  borderRadius: "10px",
                },
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              placeholder="CVV : 010"
              fullWidth
              InputProps={{
                sx: {
                  backgroundColor: "#ffffff",
                  borderRadius: "10px",
                },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              placeholder="Alex Dufresne"
              fullWidth
              InputProps={{
                sx: {
                  backgroundColor: "#ffffff",
                  borderRadius: "15px",
                },
              }}
            />
          </Grid>

          <div className={"cards-box"}>
              <img src={"/icons/western-card.svg"} />
              <img src={"/icons/master-card.svg"} />
              <img src={"/icons/paypal-card.svg"} />
              <img src={"/icons/visa-card.svg"} />
          </div>
        </Grid>
      </Box>
              </form>
            </Stack>
          </Stack>
        </Container>
      </div>
    );
  }