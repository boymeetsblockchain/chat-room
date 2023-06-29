import {useState,useEffect}from 'react'
import Header from '../components/Header'
import { useAuth } from '../utils/AuthContext'
import client,{ COLLECTION_ID_MESSAGE, DATABASE_ID, databases } from '../appwriteConfig'
import { ID,Query,Role,Permission} from 'appwrite'
import { Trash2 } from 'react-feather'

const Room = () => {
    const [messages,setMessages]= useState([])
    const [messageBody,setMessagebody]= useState("")
    const {user}= useAuth()
    const getMessages= async()=>{
        const response = await databases.listDocuments(DATABASE_ID,COLLECTION_ID_MESSAGE,[
          Query.orderDesc("$createdAt")
        ])
        setMessages(response.documents)
        
    }
   
    const handleSubmit =async(e)=>{
     e.preventDefault()
     let payload ={
      user_id:user.$id,
      username:user.name,
      body:messageBody
     }
  
     let permissions =[
      Permission.write(Role.user(user.$id))
     ]
     let response = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID_MESSAGE,
      ID.unique(),
      payload,
      permissions
     )
       console.log("Created", response)
      //  setMessages((prevState)=>[response,...messages])
     setMessagebody('')
    }

    const deleteMessage = async(message_ID)=>{
     databases.deleteDocument(DATABASE_ID,COLLECTION_ID_MESSAGE,message_ID)
    //  setMessages(prevState=> messages.filter(message=>message.$id !==message_ID))
    }
    useEffect(()=>{
     getMessages()
     const unsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGE}.documents`, response => {

      if(response.events.includes("databases.*.collections.*.documents.*.create")){
          console.log('A MESSAGE WAS CREATED')
          setMessages(prevState => [response.payload, ...prevState])
      }

      if(response.events.includes("databases.*.collections.*.documents.*.delete")){
          console.log('A MESSAGE WAS DELETED!!!')
          setMessages(prevState => prevState.filter(message => message.$id !== response.payload.$id))
      }
  });

  console.log('unsubscribe:', unsubscribe)

  return () => {
    unsubscribe();
  };
    },[])
  return (
   <>
     <main className="container">
      <Header/>
      <div className='room--container'>
        <form id='message--form'  onSubmit={handleSubmit}>
         <div>
          <textarea
          required
          maxLength={"1000"}
          placeholder='say something...'
          onChange={(e)=>{setMessagebody(e.target.value)}}
          value={messageBody}
          ></textarea>
          <div className='send-btn--wrapper'>
            <input className='btn btn--secondary' type="submit" value='Send' />
          </div>
         </div>
        </form>
      <div>
      {
        messages.map((message)=>(
          <div key={message.$id} className='message--wrapper'>
             <div className="message--header">
              <p>
                {message?.username ? <span>{message.username}</span> : <span>Anonymous User</span>}
                   <small className="message-timestamp"> {new Date(message.$createdAt).toLocaleString()}</small>
              </p>
          
              {message.$permissions.includes(`delete(\"user:${user.$id}\")`) && (
                            <Trash2 className="delete--btn" onClick={() => {deleteMessage(message.$id)}}/>
                            
                        )}
             </div>
             <div className='message--body'>
                <span>{message.body}</span>
                
             </div>
           
          </div>
        ))
    }
      </div>
      </div>
     </main>
   </>
  )
}

export default Room
