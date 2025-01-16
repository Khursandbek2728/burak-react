import React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import  ProductsPage  from './screens/productsPage';
import  OrdersPage  from './screens/ordersPage';
import  UserPage  from './screens/userPage';
import  HomePage  from './screens/homePage';
import  HelpPage  from './screens/helpPage';
import  OtherNavbar  from './components/headers/OtherNavbar';
import  HomeNavbar  from './components/headers/HomeNavbar';
import Footer  from './components/footers';
import '../css/app.css';
import '../css/navbar.css'
import '../css/footer.css'


function App() {
    const location = useLocation();

    return (
      <>

      {location.pathname === "/" ? <HomeNavbar/> : <OtherNavbar/>}
      <Switch>
        <Route path="/products">
          <ProductsPage />
        </Route>
        <Route path="/orders">
          <OrdersPage />
        </Route>
        <Route path="/member-page">
          <UserPage/>
        </Route>
        <Route path="/help">
          <HelpPage/>
        </Route>
        <Route path="/">
          <HomePage />
        </Route>
      </Switch>
      <Footer/>
    </>
    
    );
    

}

export default App;
