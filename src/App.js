import { useState,useEffect } from 'react';
import './App.css';


const PRODUCTS = [
  { id: 1, name: "Laptop", price: 500 },
  { id: 2, name: "Smartphone", price: 300 },
  { id: 3, name: "Headphones", price: 100 },
  { id: 4, name: "Smartwatch", price: 150 },
];

const FREE_GIFT = { id: 99, name: "Wireless Mouse", price: 0 };
const THRESHOLD = 1000;


function App() {

  const[cart,setCart] = useState([]);
  const[productQuantities,setProductQuantities] = useState({});
  const [showGiftMessage,setShowGiftMessage] = useState(false);


  useEffect(() => {
    const initialQuantities = {};
    PRODUCTS.forEach(product => {
      initialQuantities[product.id] = 1
    });
    setProductQuantities(initialQuantities);
  }, []);

  useEffect(() => {
    const subtotal = calculateSubtotal();
    const hasFreeGift = cart.some(item => item.id === FREE_GIFT.id);

    if(subtotal >= THRESHOLD && !hasFreeGift){
      setCart([...cart, {...FREE_GIFT,quantity: 1}]);
      setShowGiftMessage(true);
      setTimeout(() => setShowGiftMessage(false), 3000);

    }else if(subtotal < THRESHOLD && hasFreeGift){
      setCart(cart.filter(item => item.id !== FREE_GIFT.id))
    }
  }, [cart]);

  const calculateSubtotal = () => {
    return cart.reduce((total,item) => {
      if(item.id !== FREE_GIFT.id){
        return total + (item.price * item.quantity)
      }
      return total;
    }, 0);
  }

  const handleQuantityChange = (productId, newQuantity) => {
    if(newQuantity < 1) return;
    setProductQuantities({...productQuantities,[productId]: newQuantity});
  }

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    const quantity = productQuantities[product.id] || 1;

    if(existingItem){
      setCart(cart.map(item => item.id === product.id
        ? {...item,quantity: item.quantity + quantity}
        : item
      ))
    }else{
      setCart([...cart, {...product, quantity}])
    }

    setProductQuantities({
      ...productQuantities, [product.id]: 1
    })
  };

  const updateCartItem = (productId,newQuantity) => {
    if(newQuantity < 1){
      removeFromCart(productId);
      return;
    }

    setCart(cart.map(item => item.id === productId
      ? {...item, quantity: newQuantity}
      : item 
    ));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const subtotal = calculateSubtotal();
  const progress = Math.min((subtotal / THRESHOLD) * 100, 100);
  const amountNeeded = Math.max(THRESHOLD - subtotal, 0);
  

  return (
    <div className="App">
      <h1>Shopping Cart</h1>
      <div className='products'>
        <h2>Products</h2>
        <ul className='products-list-container'>
        {PRODUCTS.map(product => (
          <div key={product.id} className='product-card'>
            <h3>{product.name}</h3>
            <p>&#8377;{product.price}</p>
            <div className='quantity-selector'>
              <button className='quantity-selector-btn' onClick={() => handleQuantityChange(product.id, productQuantities[product.id] -1)} disabled={productQuantities[product.id] <= 1}>-</button>
              <span>{productQuantities[product.id]}</span>
              <button className='quantity-selector-btn' onClick={() => handleQuantityChange(product.id,productQuantities[product.id] + 1)}>+</button>
            </div>
            <button className='add-to-cart' onClick={() => addToCart(product)}>Add to Cart</button>
          </div>

        ))}
        </ul>
      </div>

      <div className='cart'>
        <h2>Cart Summary</h2>

        <div className='cart-summary'>
          
            <p>Subtotal:</p>
            <p>&#8377;{subtotal}</p>
          
        </div>
        <hr className='line'/>
        {showGiftMessage && (
          <div className='gift-message'>Congratulations! You've earned a free {FREE_GIFT.name}!</div>
        )}
        <div className='progress-container'>
          <div className='progress-bar' style={{width: `${progress}%`}}></div>
          <div className='progress-text'>
            {amountNeeded > 0 ? (`Add $${amountNeeded} more to get a Free ${FREE_GIFT.name}`) 
            : (`You've unlocked the free ${FREE_GIFT.name}!`)}
          </div>
        </div>
        <div className='cart-items'>
          {cart.length === 0 ? (
            <div className='empty-cart'>
            <p>Your cart is empty</p>
            <p>Add some products to see them here!</p>
            </div>
          ) : (
            <ul>
              {cart.map(item => (
                <li key={item.id} className='cart-item'>
                  <span>{item.name} X {item.quantity} = &#8377;{item.price*item.quantity}</span>
                  {item.id !== FREE_GIFT.id && (
                    <div className='cart-item-actions'>
                       <button onClick={() => updateCartItem(item.id,item.qunatity-1)}>-</button>
                       <span>{item.quantity}</span> 
                       <button onClick={() => updateCartItem(item.id,item.qunatity+1)}>+</button>
                       <button className='remove-btn' onClick={() => removeFromCart(item.id)}>Remove</button>
                    </div>
                  )}
                </li>
              ))}  
            </ul>
          )}
        </div>
      </div>   
    </div>
  );
}

export default App;
