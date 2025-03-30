import React from 'react';
import './TownScreen.css';

// Тестовые данные
const townData = {
  name: "Москва",
  imageUrl: "https://img.freepik.com/free-photo/moskva-river-with-long-exposure-near-kremlin-evening-moscow-russia_181624-34923.jpg",
  description: "Столица России, крупнейший город страны с населением около 12 млн человек. Основана в 1147 году. В Москве находятся Кремль, Красная площадь, Большой театр и другие известные достопримечательности."
};

const TownScreen = () => {
  return (
    <div className="town-screen">
      <div className="town-card">
        <h1 className="town-title">{townData.name}</h1>
        
        <div className="town-content">
          <img 
            src={townData.imageUrl} 
            alt={townData.name}
            className="town-image"
          />
          <div className="town-description">
            <p>{townData.description}</p>
          </div>
        </div>
        <button className="next-button">
          Следующий город
        </button>
      </div>
    </div>
  );
};

export default TownScreen;