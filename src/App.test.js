import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import axios from 'axios';

import Home from './components/Home';
import Catalog from './components/Catalog';
import Favorites from './components/Favorites';
import Cart from './components/Cart';
import ProductDetails from './components/ProductDetails';

import Header from './components/Header';
import Footer from './components/Footer';

const App = () => {
  const [aircrafts, setAircrafts] = useState([]);

  useEffect(() => {
    const fetchAircrafts = async () => {
      try {
        const response = await axios.get('/api/cart');
        setAircrafts(response.data);
      } catch (error) {
        console.error('Error fetching aircraft data:', error);
      }
    };
    fetchAircrafts();
  }, []);

  return (
    <Router>
      <div className="app">
        <Header />

        <Switch>
          <Route exact path="/" component={() => <Home aircrafts={aircrafts.slice(0, 10)} />} />
          <Route path="/catalog" component={() => <Catalog aircrafts={aircrafts} />} />
          <Route path="/favorites" component={Favorites} />
          <Route path="/cart" component={Cart} />
          <Route path="/product/:id" component={ProductDetails} />
        </Switch>

        <Footer />
      </div>
    </Router>
  );
};

const Header = () => {
  return (
    <header className="header">
      <nav>
        <ul>
          <li><Link to="/">Главная</Link></li>
          <li><Link to="/catalog">Каталог</Link></li>
          <li><Link to="/favorites">Избранное</Link></li>
          <li><Link to="/cart">Корзина</Link></li>
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

const Home = ({ aircrafts }) => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    console.log('Отправлено сообщение:', data);
    reset();
  };

  return (
    <div className="home">
      <section className="about">
        <h2>Добро пожаловать в наш магазин!</h2>
        <p>Мы предлагаем широкий ассортимент истребителей высокого качества.</p>
      </section>

      <section className="contact">
        <h2>Связаться с нами</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="text" placeholder="Имя" {...register('name')} />
          <input type="email" placeholder="Email" {...register('email')} />
          <textarea placeholder="Сообщение" {...register('message')}></textarea>
          <button type="submit">Отправить</button>
        </form>
      </section>

      <section className="featured-products">
        <h2>Рекомендуемые истребители</h2>
        <div className="aircraft-list">
          {aircrafts.map((aircraft, index) => (
            <AircraftCard key={index} aircraft={aircraft} />
          ))}
        </div>
      </section>
    </div>
  );
};

const Catalog = ({ aircrafts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

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
          <AircraftCard key={index} aircraft={aircraft} />
        ))}
      </div>
    </div>
  );
};

const Favorites = () => {
  return (
    <div className="favorites">
      <h2>Избранное</h2>
      {/* Отображение избранных истребителей */}
    </div>
  );
};

const Cart = () => {
  return (
    <div className="cart">
      <h2>Корзина</h2>
      {/* Отображение товаров в корзине и подсчет стоимости */}
    </div>
  );
};

const ProductDetails = () => {
  return (
    <div className="product-details">
      <h2>Название истребителя</h2>
      {/* Отображение подробной информации об истребителе */}
    </div>
  );
};

const AircraftCard = ({ aircraft }) => {
  return (
    <div className="aircraft-card">
      <img src={aircraft.img} alt={aircraft.name} />
      <h3>{aircraft.name}</h3>
      <p>{aircraft.description}</p>
      <p>Цена: {aircraft.price}</p>
      <button>Добавить в избранное</button>
      <button>Добавить в корзину</button>
    </div>
  );
};

export default App;