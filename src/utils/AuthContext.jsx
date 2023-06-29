import { createContext,useState,useEffect, useContext } from "react";
import { account } from "../appwriteConfig";
import { useNavigate } from "react-router-dom";
import { ID } from "appwrite";
const AuthContext = createContext()

export const AuthProvider =({children})=>{
    const [loading,setLoading]= useState(true)
    const [user,setUser]=useState(null) 
    const navigate = useNavigate()

   
    useEffect(()=>{
       getUserOnLoad()
    },[])

    const handleUserLogin = async (e,credentials)=>{
       e.preventDefault()
       try {
        const response = await account.createEmailSession(credentials.email,credentials.password)
        console.log("logged",response)
        const accountDetails = await account.get()
        setUser(accountDetails)
        navigate('/')

       } catch (error) {
         console.error(error)
       }
    }

    const handleLogout = async () => {
        const response = await account.deleteSession('current');
        console.log("loggedOut", response)
        setUser(null)
    }

 const handleUserRegister =async(e,credentials)=>{
    e.preventDefault()
    if(credentials.password1 !== credentials.password2){
        alert('Passwords did not match!')
        return 
    }
    try {
        let response = await account.create(ID.unique(), credentials.email, credentials.password1, credentials.name);
        console.log('User registered!', response)
        await account.createEmailSession(credentials.email, credentials.password1)
        let accountDetails = await account.get();
        setUser(accountDetails)
        navigate('/')
    } catch (error) {
        console.error(error)
    }

 }
    const getUserOnLoad= async ()=>{
        try {
            const accountDetails = await account.get()
            console.log("accountDeatials", accountDetails)
            setUser(accountDetails)
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }
    const contextData={
        user,
        handleUserLogin,
        handleLogout,
        handleUserRegister
    }

    return<AuthContext.Provider value={contextData}>
       {
        loading ? <p>Loading...</p> :children
       }
    </AuthContext.Provider>

}


export const useAuth = ()=>{
    return useContext(AuthContext)
} 

export default AuthContext