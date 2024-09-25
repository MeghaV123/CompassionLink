import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function CategoriesGrid() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:4000/admin/viewCategories')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  // const handleCategoryClick = (categoryId) => {
  //   navigate(`/category-donations/${categoryId}`);
  // };

  return (
    <div className="container mt-3">
        <h3>Categories</h3>
        
        <div className="row">
        {categories.map(category => (
          <Link
          to='/categoryDonations'
          state = {{id:category._id}}
            // key={category._id}
            className="col-12 col-xs-4 col-sm-4 col-md-4 col-lg-2 mb-4"
            // onClick={() => handleCategoryClick(category._id)}
            style={{ cursor: 'pointer'}}
          >
            <div className='card' style={{width:"150px",height:"150px", alignItems:"centre", borderRadius:"10%"}}>
              <div className="card-body" style={{textAlign:"center"}}>
              <img
                      src={`http://localhost:4000${category.image}`}
                      alt={category.categoryname}
                      style={{ width: "50px", height: "50px",marginTop:"10px" }}
                    />
                <h5 className="card-title" style={{marginTop:"15px"}}>{category.categoryname}</h5>
              </div>
            </div>
          </Link>
        ))}
      
        </div>
      
    </div>
  );
}

export default CategoriesGrid;
