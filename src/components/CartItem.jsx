import Item from './Item';

function CartItem(props) {

  return (
    <div className="cart">
    
      {props.cartik.map(obj => {
        return (
          <Item
            name={obj.name}
            description={obj.description}
            price={obj.price}
            img={obj.img}
          />
        );
      })}
    </div>
  );
}

export default CartItem;