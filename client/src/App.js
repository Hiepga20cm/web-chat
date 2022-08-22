import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Chat from './components/Chat/Chat';
import Login from './components/LoginForm/Login';
import Register from './components/Register/Register';

function App() {
  // const sendMessage = () => {
  // socket.emit('send_message', { message: 'hello anh hiep' })
  // }
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={< Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/chat' element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
