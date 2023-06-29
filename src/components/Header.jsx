import React from 'react'
import { LogOut } from 'react-feather'
import { useAuth } from '../utils/AuthContext'
const Header = () => {
    const {user,handleLogout}= useAuth()
  return (
    <div id="header--wrapper">
        {
            user?(
                <>
              <h1>Welcome {user.name}</h1>
              <LogOut className='header--link' onClick={handleLogout}/>
            </>
            ) 
            :(
                <button>Login</button>
            )
        }
    </div>
  )
}

export default Header