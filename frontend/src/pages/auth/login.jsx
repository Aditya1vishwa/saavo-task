import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import useUserStore from '../../store/useUserStore';
import { apiCall } from '../../apiConfig/apiCall';
import svg from '../../assets/svg';
import AuthLeftPanel from '../../components/auth/AuthLeftPanel';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { UStore } = useUserStore();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            toast.error('Please fill all fields');
            return;
        }

        setLoading(true);
        try {
            const response = await apiCall({
                url: '/auth/login',
                method: 'POST',
                data: formData,
            });

            if (response.success) {
                await UStore('user', response.data.user);
                await UStore('isAuthenticated', true);
                toast.success('Login successful');
                if (response.data.user?.role === "admin") {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/user/dashboard');
                }
            } else {
                toast.error(response.message || 'Login failed');
            }
        } catch (error) {
            toast.error(error.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pr_auth_page">
            {/* Mobile App Name */}
            <div className="pr_app_name_mobile">EventNest</div>

            <div className="pr_auth_inner">
                {/* Left Side - Desktop/Tablet */}
                <div className="pr_auth_left">
                    <AuthLeftPanel />
                </div>

                {/* Right Side */}
                <div className="pr_auth_right">
                    <div className="pr_auth_form_container">
                        <h1 className="pr_auth_title">Welcome Back</h1>
                        <p className="pr_auth_subtitle">Sign in to your account to continue</p>

                        <form onSubmit={handleSubmit} className="pr_auth_form">
                            <div className="pr_form_group">
                                <label htmlFor="email" className="pr_label">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="pr_input"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <div className="pr_form_group">
                                <label htmlFor="password" className="pr_label">Password</label>
                                <div className="pr_input_pass_wrapper">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="pr_input"
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="pr_eye_btn"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <svg.eyeOff fill="#64748b" /> : <svg.eye fill="#64748b" />}
                                    </button>
                                </div>
                            </div>

                            <div className="pr_form_actions">
                                <Link to="/forget" className="pr_forgot_link">Forgot Password?</Link>
                            </div>

                            <button type="submit" className="pr_btn_primary pr_full_width" disabled={loading}>
                                {loading ? 'Signing In...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="pr_divider">
                            <span>or</span>
                        </div>

                        <button className="pr_btn_google">
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>

                        <p className="pr_auth_switch">
                            Don't have an account? <Link to="/signup">Sign Up</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
