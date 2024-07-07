import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import { Navbar } from './components/Layouts/Navbar'
import { Error404 } from './pages/Error404';
import { Notes } from './pages/Notes';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { SideBar } from './components/Layouts/SideBar';
import { EditLabels } from './components/EditLabels';
import ProtectedRoute from './utils/ProtectedRoute';
import { useAuth } from './utils/Provider';

function App () {
    const { isLoggedIn } = useAuth();
    return (
        <div className='flex flex-col'>
            <BrowserRouter>
                <Navbar />
                <div className='flex w-full'>
                    {isLoggedIn && <SideBar />}
                    <Routes>
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route element={<ProtectedRoute />}>
                            <Route path="/" element={<Notes />} />
                            <Route path="/editLabels" element={<EditLabels />} />
                        </Route>
                        <Route path="*" element={<Error404 />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </div>
    )
}


export default App
