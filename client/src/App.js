import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Chat from './components/Chat/Chat';
import Landing from './components/layout/Landing';
import Login from './components/LoginForm/Login';
import Register from './components/Register/Register';

function App() {
  const token = localStorage.getItem('token');
  const permission = localStorage.getItem('permission');

  let check = false;
  if (permission === 'admin') {
    check = true;
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path = '/' element = {<Landing/>}/>
        <Route path='/login' element={< Login />} />
        <Route path='/register' element={!token ? <Register /> : <Login />} />
        <Route path='/chat' element={token ? <Chat /> : <Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
