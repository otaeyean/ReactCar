import React, { useState, useEffect } from 'react';
import { Layout, Menu, Tabs, Pagination } from 'antd';
import CarCard from './components/CarCard';
import CarInfo from './components/CarInfo';
import SignUp from './components/SignUp';
import Login from './components/Login';

const { TabPane } = Tabs;
const { Header, Content, Footer } = Layout;

const App = () => {
  const [carData, setCarData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentView, setCurrentView] = useState('home');
  const [selectedCar, setSelectedCar] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const carsPerPage = 9;

  useEffect(() => {
    fetch('/data/carDataList.json')
      .then((response) => response.json())
      .then((data) => {
        setCarData(data);
        const uniqueCategories = [...new Set(data.map(car => car.category))];
        setCategories(uniqueCategories);
        setActiveTab(uniqueCategories[0]);
      });
  }, []);

  const handleTabChange = (key) => {
    setActiveTab(key);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleMenuClick = (key) => {
    setCurrentView(key); 
  };

  const handleCarSelect = (car) => { 
    setSelectedCar(car);
    setCurrentView('carInfo');
  };

  const handleSignUpSuccess = () => {
    setCurrentView('login');
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentView('home');
  };

  const handleLoginClick = () => {
    setCurrentView('login');
  };

  if (!carData) {
    return <div>Loading...</div>;
  }

  const filteredCars = carData.filter(car => car.category === activeTab);
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ position: 'fixed', zIndex: 1, width: '100%', backgroundColor: "#393e5a" }}>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['home']}
        onClick={(e) => handleMenuClick(e.key)} 
        style={{ backgroundColor: "#00264B" }}
      >
      <Menu.Item key="home">Home</Menu.Item>
      <Menu.Item key="signup">Sign Up</Menu.Item>  {/*메뉴바 도현오빠랑 충돌 여기 수정*/}
    </Menu>
      </Header>

      <Content style={{ padding: '0 50px', marginTop: 64 }}>
        {currentView === 'home' && (
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            tabBarStyle={{ display: 'flex', justifyContent: 'flex-start' }}
          >
            {categories.map(category => (
              <TabPane tab={category} key={category}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                  {currentCars.map((car) => (
                    <CarCard key={car.model} car={car} onSelect={handleCarSelect} />
                  ))}
                </div>
                <Pagination
                  current={currentPage}
                  pageSize={carsPerPage}
                  total={filteredCars.length}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  style={{ textAlign: 'center', marginTop: '20px' }}
                />
              </TabPane>
            ))}
          </Tabs>
        )}{/*메뉴바 도현오빠랑 충돌 여기 수정*/}
        {currentView === 'carInfo' && <CarInfo car={selectedCar} onBack={() => setCurrentView('home')} />}
        {currentView === 'login' && <Login onLoginSuccess={handleLoginSuccess} />}
        {currentView === 'signup' && <SignUp onSignUpSuccess={handleSignUpSuccess} onLoginClick={handleLoginClick} />}  
      </Content>
    </Layout>
  );
};

export default App;
