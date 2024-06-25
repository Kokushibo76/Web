import React from "react";

const Item = (props) => {
  return (
    
      <div className="card">
        <div>{props.key}</div>
        <img src={props.img} className="card-img-top" alt="..." />

        <div className="card-body">
          <h3 className="card-title">{props.name}</h3>
          <p className="card-text">{props.description}</p>
          <a className="btn btn-primary">Добавить в корзину</a>
          <a className="btn btn-primary">Добавить в избранное</a>
          <h2>{props.price}</h2>
        </div>
      </div>
   
  );
};


export default Item;