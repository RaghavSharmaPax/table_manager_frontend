import Paymentus_logo from "../../img/Paymentus_logo.png";
import { useAppSelector } from "../../redux/hooks";
import Avatar from "../core/Avatar";
import "./styles.css";

const Navbar = () => {
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  return (
    <div className="navbar">
      <img className="logo" src={Paymentus_logo} alt="Paymentus" />
      {isAuthenticated && <Avatar />}
    </div>
  );
};

export default Navbar;