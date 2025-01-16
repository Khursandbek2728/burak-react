import { Box, Button, Container, Stack } from "@mui/material";
import { NavLink } from "react-router-dom";
import Basket from "./Basket";

export default function OtherNavbar() {
    const authMember = null;

    return (
      <div className="other-navbar">
        <Container className="navbar-container">
          <Stack className="menu">
            <Box>
              <NavLink to="/">
                <img className="brand-logo" src="/icons/burak.svg"/>
              </NavLink>
            </Box>
  
            <Stack className="links">
              <Box className="hover-line">
                <NavLink to="/" activeClassName={"underline"}>
                  Home
                </NavLink>
              </Box>
  
              <Box className="hover-line">
                <NavLink to="/products">
                  Products
                </NavLink>
              </Box>
              {authMember ? (
                <Box className="hover-line">
                  <NavLink to="/orders" activeClassName={"underline"}>
                    Orders
                  </NavLink>
                </Box>
              ) : null}
  
              {authMember ? (
                <Box className="hover-line">
                  <NavLink to="/member-page" activeClassName={"underline"}>
                    My Page
                  </NavLink>
                </Box>
              ) : null}
  
              <Box className="hover-line">
                <NavLink to="/help" activeClassName={"underline"}>
                  Help
                </NavLink>
              </Box>
            </Stack>
            <Basket/>

  
            {!authMember ? (
              <Box>
                <Button className="login-button" variant="contained">
                  Login
                </Button>
              </Box>
            ) : (
              <img className="user-avatar" src={"/icons/default-user.svg"} aria-haspopup={"true"}/>
            )}
          </Stack>
 
        </Container>
      </div>
    );
}