import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes, faUser } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../contexts/userContext';
import { useContext } from 'react';

function MainHeader() {
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);


  const handleSearch = () => {
    if (searchText) {
      navigate(`/search?criteria=${searchText}`);
    }
  };

  return (
    <div className="d-flex align-items-start justify-content-between p-3">
      {/* Website name */}
      <div className="d-flex align-items-start">
        <Link to="/Home" className='text-decoration-none'>
          <img 
            src="https://firebasestorage.googleapis.com/v0/b/nowrap-4d1fa.appspot.com/o/nowrap_logo.jpg?alt=media&token=cea6afc3-f57b-4933-b15c-bb0a4cf0da39" 
            alt="Nowrap Logo" 
            className="mb-0" 
            style={{ height: 'auto', width: 'auto', maxWidth: '120px' }} // You can adjust the height and width as needed
          />
        </Link>
      </div>

      {/* Search */}
      {(location.pathname !== '/Home' && location.pathname !== '/Home/Favorites') && ( // 3. Conditionally render based on pathname
        <div className="d-flex align-items-center" style={{flexGrow: "1", maxWidth: "380px"}}>
          <input 
            className="form-control d-none d-sm-block" 
            type="text" 
            placeholder="Search..." 
            id="example-search-input"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          {searchText && (
            <button 
              className="btn btn-outline-secondary ml-2 d-none d-sm-block" 
              type="button" 
              onClick={() => setSearchText('')}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
          <button 
            className="btn btn-outline-primary ml-2 d-none d-sm-block" 
            type="button"
            onClick={handleSearch}
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      )}
      {/* Account */}

        {user.loggedIn && (
          <div style={{margin: '0', padding: '0'}}>
            <Link to="/account" className="d-flex flex-column align-items-center justify-content-center" style={{ textDecoration: 'none', color: 'inherit'}}>
            {user.userPhoto && <img className="mb-2" src={user.userPhoto} alt="User Avatar" style={{ maxHeight: '100px', maxWidth: '100px', height: 'auto', width: 'auto'}} />}
            <p style={{textDecoration: 'none', fontWeight: 'normal', fontSize: '14px', fontStyle: 'italic', margin: '0'}}>{user.username}</p>
            </Link>
          </div>
				)}
				{/* If signed in, show LoggedInFeed, else disable tab */}
				{!user.loggedIn && (
          <div>
            <Link to="/account" className="btn btn-primary ml-2" style={{marginRight: '10px'}}>
              Login
            </Link>
            <Link to="/AccountRegistration" className="btn btn-primary ml-2">
              Register
            </Link>
          </div>
				)}   

    </div>
  );
}

export default MainHeader;




