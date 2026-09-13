// src/components/ui/Card.js
import React from 'react';

export const Card = ({ 
  image, 
  title, 
  subtitle, 
  price, 
  onAdd, 
  onClick, 
  variant = 'default' // default (Avenix), minimal (Aurora), bordered (Flara) 
}) => {
  
  const styles = {
    default: {
      container: "group text-center flex flex-col h-full",
      imgContainer: "aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 relative",
      img: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
      content: "mt-4",
      title: "text-lg font-medium text-gray-900",
      price: "text-gray-600 mt-1",
      btnContainer: "mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2 px-2",
      btn: "flex-1 bg-black text-white py-2 text-sm rounded-full hover:opacity-80"
    },
    minimal: {
      container: "group cursor-pointer flex flex-col gap-3",
      imgContainer: "aspect-[3/4] bg-gray-100 relative overflow-hidden",
      img: "w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110",
      content: "text-center",
      title: "font-serif text-lg text-gray-900 group-hover:text-yellow-600 transition-colors",
      price: "text-sm text-gray-500 tracking-wide",
      btnContainer: "absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300",
      btn: "w-full bg-white/90 backdrop-blur text-black py-3 text-xs uppercase tracking-widest font-bold hover:bg-black hover:text-white"
    }
  };

  const style = styles[variant] || styles.default;

  return (
    <div className={style.container} onClick={onClick}>
      <div className={style.imgContainer}>
        <img src={image} alt={title} className={style.img} onError={e => e.target.src = "https://placehold.co/600x800"} />
        {/* Buttons (injected differently based on variant) */}
        {variant === 'minimal' && (
          <div className={style.btnContainer}>
             <button onClick={(e) => { e.stopPropagation(); onAdd(); }} className={style.btn}>Add to Cart</button>
          </div>
        )}
      </div>
      
      <div className={style.content}>
        <h3 className={style.title}>{title}</h3>
        {subtitle && <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">{subtitle}</p>}
        <p className={style.price}>${price}</p>
        
        {variant === 'default' && (
           <div className={style.btnContainer}>
              <button className="flex-1 bg-gray-200 text-gray-900 py-2 rounded-full text-sm font-medium hover:bg-gray-300">View</button>
              <button onClick={(e) => { e.stopPropagation(); onAdd(); }} className={style.btn}>Add</button>
           </div>
        )}
      </div>
    </div>
  );
};