import { Member } from "./member";
import { Product } from "./product";

/** REACT APP STATE */
export interface AppRootState {
  productsPage: any;
  homePage: HomePageState;
}

/** HOMEPAGE */
export interface HomePageState {
  popularDishes: Product[];
  newDishes: Product[];
  topUsers: Member[];
}

/** PRODUCTS PAGE */
export interface ProductsPageState {
  restaurant: Member | null;
chosenProduct: Product | null;
  products: Product[];
}
/** ORDERS PAGE */
