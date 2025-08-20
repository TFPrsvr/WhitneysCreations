import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './contexts/CartContext.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { GuestProvider } from './contexts/GuestContext.jsx';
import { ProjectProvider } from './contexts/ProjectContext.jsx';
import { AdminProvider } from './contexts/AdminContext.jsx';
import { DesignProvider } from './contexts/DesignContext.jsx';
import Creations from './components/DesignCreator/Creations.jsx'
import ImageGallery from './components/ImageGallery/ImageGrid.jsx'
import Login from './components/Login/Login.jsx'
import Reg from './components/Registration/Reg.jsx'
import Nav from './components/Nav/Nav.jsx'
import CleanNav from './components/Nav/CleanNav.jsx'
import './index.css'
import App from './App.jsx'
import About from './components/About/About.jsx'
import Contact from './components/Contact/Contact.jsx'
import Order from './components/Order/Order.jsx'
import Suggestions from './components/Suggestions/Suggestions.jsx'
import Cart from './components/Cart/Cart.jsx'
import UploadTest from './components/Upload/UploadTest.jsx'
import ProductCatalog from './components/Products/ProductCatalog.jsx'
import ProjectDashboard from './components/Projects/ProjectDashboard.jsx'
import Pricing from './components/Pricing/Pricing.jsx'
import AdminDashboard from './components/Admin/AdminDashboard.jsx'
import FontManager from './components/FontCustomizer/FontManager.jsx'
import DesignStudio from './components/DesignPreview/DesignStudio.jsx'
import PaymentSetup from './components/Payment/PaymentSetup.jsx'
import ProfileSettings from './components/Profile/ProfileSettings.jsx'
import OrderHistory from './components/Orders/OrderHistory.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <GuestProvider>
          <ProjectProvider>
            <AdminProvider>
              <DesignProvider>
                <CartProvider>
              <CleanNav />
              <Routes>
                <Route path='/' element={< App/>} />
                    {/* <App /> */}

    <Route path='/create' element={<Creations />} />
    <Route path='/img' element={<ImageGallery />} />
    <Route path='/about' element={<About />} />
    <Route path='/contact' element={<Contact />} />
    
    <Route path='/order' element={<Order />} />
    <Route path='/suggest' element={<Suggestions />} />
    <Route path='/upload-test' element={<UploadTest />} />
    <Route path='/products' element={<ProductCatalog />} />
    <Route path='/projects' element={<ProjectDashboard />} />
    <Route path='/pricing' element={<Pricing />} />
    <Route path='/admin' element={<AdminDashboard />} />
    <Route path='/fonts' element={<FontManager />} />
    <Route path='/studio' element={<DesignStudio />} />
    <Route path='/payment' element={<PaymentSetup />} />
    <Route path='/profile' element={<ProfileSettings />} />
    <Route path='/orders' element={<OrderHistory />} />
    
    <Route path='/cart' element={<Cart />} />


    <Route path='/login' element={<Login />} />
    <Route path='/reg' element={<Reg />} />
    <Route path='/nav' element={<Nav />} />
    {/* <Route path='/getUsers' element={<GetUsers />} /> */}

          </Routes>
                </CartProvider>
              </DesignProvider>
            </AdminProvider>
          </ProjectProvider>
        </GuestProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
