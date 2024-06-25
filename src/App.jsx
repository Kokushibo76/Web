import "./App.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { motion } from "framer-motion";
import CartItem from "./components/CartItem";
import Header from './components/Header';
import Catalog from './components/Catalog';
import Favorites from './components/Favorites';
import Cart from './components/Cart';
import ProductDetails from './components/ProductDetails';

export const AppContext = React.createContext({});

function App() {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const cartData = await axios.get('http://localhost:3001/cart');
      const favoritesData = JSON.parse(localStorage.getItem('favorites')) || [];
      setCart(cartData.data);
      setFavorites(favoritesData);
    }
    fetchData();
  }, []);

  const handleAddToCart = (aircraft) => {
    const updatedCart = [...cart, aircraft];
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleRemoveFromCart = (aircraft) => {
    const updatedCart = cart.filter((item) => item.id !== aircraft.id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleAddToFavorites = (aircraft) => {
    const updatedFavorites = [...favorites, aircraft];
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const handleRemoveFromFavorites = (aircraft) => {
    const updatedFavorites = favorites.filter((fav) => fav.id !== aircraft.id);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        setCart,
        favorites,
        setFavorites,
        handleAddToCart,
        handleRemoveFromCart,
        handleAddToFavorites,
        handleRemoveFromFavorites
      }}
    >
      <Router>
        <div className="app">
          <Header />

          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/catalog" component={Catalog} />
            <Route path="/favorites" component={Favorites} />
            <Route path="/cart" component={Cart} />
            <Route path="/product/:id" component={ProductDetails} />
          </Switch>

          <Footer />
        </div>
      </Router>
    </AppContext.Provider>
  );
}

const Home = () => {
  return (
    <div className="home">
      <section className="about">
        <h2>Добро пожаловать в наш магазин!</h2>
        <p>Мы предлагаем широкий ассортимент истребителей высокого качества.</p>
      </section>

      <section className="featured-products">
        <h2>Рекомендуемые истребители</h2>
        <div className="aircraft-list">
          {/* Отображение рекомендуемых истребителей */}
        </div>
      </section>
    </div>
  );
};

const Catalog = () => {
  const [aircrafts, setAircrafts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { handleAddToFavorites } = useContext(AppContext);

  useEffect(() => {
    async function fetchAircrafts() {
      const response = await axios.get('/api/aircrafts');
      setAircrafts(response.data);
    }
    fetchAircrafts();
  }, []);

  const filteredAircrafts = aircrafts.filter((aircraft) => {
    const nameMatch = aircraft.name.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = selectedCategory ? aircraft.category === selectedCategory : true;
    return nameMatch && categoryMatch;
  });

  return (
    <div className="catalog">
      <h2>Каталог истребителей</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Поиск"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Все категории</option>
          <option value="Многоцелевой">Многоцелевой</option>
          <option value="Истребитель-перехватчик">Истребитель-перехватчик</option>
          <option value="Военно-транспортный">Военно-транспортный</option>
        </select>
      </div>

      <div className="aircraft-list">
        {filteredAircrafts.map((aircraft, index) => (
          <AircraftCard
            key={index}
            aircraft={aircraft}
            onAddToFavorites={handleAddToFavorites}
            onViewDetails={() => history.push(`/product/${aircraft.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

const Favorites = () => {
  const { favorites, handleRemoveFromFavorites } = useContext(AppContext);

  return (
    <div className="favorites">
      <h2>Избранное</h2>
      {favorites.map((aircraft, index) => (
        <AircraftCard
          key={index}
          aircraft={aircraft}
          onRemoveFromFavorites={handleRemoveFromFavorites}
        />
      ))}
    </div>
  );
};

const Cart = () => {
  const { cart, handleRemoveFromCart } = useContext(AppContext);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const calculateTotal = () => {
      const total = cart.reduce((acc, item) => acc + parseFloat(item.price), 0);
      setTotal(total);
    };
    calculateTotal();
  }, [cart]);

  return (
    <div className="cart">
      <h2>Корзина</h2>
      {cart.map((aircraft, index) => (
        <AircraftCard
          key={index}
          aircraft={aircraft}
          onRemoveFromCart={handleRemoveFromCart}
        />
      ))}
      <div className="total">
        <p>Итого: {total.toFixed(2)} $</p>
      </div>
    </div>
  );
};

const ProductDetails = () => {
  const { id } = useParams();
  const [aircraft, setAircraft] = useState(null);
  const { handleAddToFavorites, handleAddToCart } = useContext(AppContext);

  useEffect(() => {
    async function fetchAircraft() {
      const response = await axios.get(`/api/aircrafts/${id}`);
      setAircraft(response.data);
    }
    fetchAircraft();
  }, [id]);

  if (!aircraft) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-details">
      <h2>{aircraft.name}</h2>
      <img src={aircraft.img} alt={aircraft.name} />
      <p>{aircraft.description}</p>
      <p>Price: {aircraft.price}</p>
      <button onClick={() => handleAddToFavorites(aircraft)}>Add to Favorites</button>
      <button onClick={() => handleAddToCart(aircraft)}>Add to Cart</button>
    </div>
  );
};

const AircraftCard = ({ aircraft, onAddToFavorites, onRemoveFromFavorites, onAddToCart, onRemoveFromCart, onViewDetails }) => {
  return (
    <div className="aircraft-card">
      <img src={aircraft.img} alt={aircraft.name} />
      <h3>{aircraft.name}</h3>
      <p>{aircraft.description}</p>
      <p>Price: {aircraft.price}</p>
      <button onClick={() => onAddToFavorites(aircraft)}>Add to Favorites</button>
      <button onClick={() => onAddToCart(aircraft)}>Add to Cart</button>
      <button onClick={onViewDetails}>View Details</button>
    </div>
  );
};

const Header = () => {
  const { cart, favorites } = useContext(AppContext);

  return (
    <header className="header">
      <nav>
        <ul>
          <li><Link to="/">Главная</Link></li>
          <li><Link to="/catalog">Каталог</Link></li>
          <li><Link to="/favorites">Избранное ({favorites.length})</Link></li>
          <li><Link to="/cart">Корзина ({cart.length})</Link></li>
        </ul>
      </nav>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; 2023 Магазин. Все права защищены.</p>
    </footer>
  );
};

export default App;
