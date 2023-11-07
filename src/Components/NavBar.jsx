import React from 'react';
import './Nav.css';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ onSearchChange, disabled }) => {
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.removeItem('username');
        navigate('/login');
    };

    const userRole = localStorage.getItem('role');

    return (
        <section className="shop15fixedheaders">
            <header className="shop15fixedheader">
                <div className="search">
                    <input
                        type="text"
                        placeholder="Search"
                        onChange={onSearchChange}
                        disabled={disabled}
                    />
                </div>



                {userRole === 'Admin' && (
                    <>
                    <Link to="/AdminDashboard">
                        <div className="shop15admindashboard">Admin Dashboard</div>
                    </Link>
                    <Link to="/Courses">
                        <div className="shop15admindashboard">Course</div>
                    </Link>
                    <Link to="/Topic">
                        <div className="shop15admindashboard">Topic</div>
                    </Link>
                    <Link to="/Venue">
                        <div className="shop15admindashboard">Venue</div>
                    </Link>
                    </>
                )}

                {userRole === 'Student' && (
                    <>
                        <Link to="/StudentDashboard">
                            <div className="shop15studentdashboard">Student Dashboard</div>
                        </Link>
                        <Link to="/EnrollmentProcess">
                            <div className="shop15homelist">Enrollment Process</div>
                        </Link>
                        <Link to="/LectureEnrollmentProcess">
                            <div className="shop15homelist">Lecture Enrollment Process</div>
                        </Link>
                    </>
                
                )}


                {userRole === 'Professor' && (
                    <>
                    <Link to="/ProfessorDashboard">
                        <div className="shop15professordashboard">Professor Dashboard</div>
                    </Link>
                    <Link to="/VenueBookingProcess">
                    <div className="shop15professordashboard">Professor Dashboard</div>
                </Link>
                </>

                )}

                <button className="buttonheader" onClick={handleSignOut}>
                    Sign Out
                </button>
            </header>
        </section>
    );
};

export default Header;
