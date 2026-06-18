import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router';
import toast from 'react-hot-toast';
import { apiCall } from '../../apiConfig/apiCall';
import svg from '../../assets/svg';
import AuthLeftPanel from '../../components/auth/AuthLeftPanel';

const Reset = () => {
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.newPassword || !formData.confirmPassword) {
            toast.error('Please fill all fields');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()\[\]{}\-_=+|\\:;"'<>,./~`])[A-Za-z\d@$!%*?&^#()\[\]{}\-_=+|\\:;"'<>,./~`]{8,}$/;
        if (!passwordRegex.test(formData.newPassword)) {
            toast.error('Password must be at least 8 characters, include uppercase, lowercase, number, and special character');
            return;
        }

        if (!token) {
            toast.error('Invalid reset link');
            return;
        }

        setLoading(true);
        try {
            const response = await apiCall({
                url: '/auth/reset-password',
                method: 'POST',
                data: {
                    token,
                    newPassword: formData.newPassword,
                },
            });

            if (response.success) {
                toast.success('Password reset successfully. Please login.');
                navigate('/login');
            } else {
                toast.error(response.message || 'Failed to reset password');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to reset password');
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
                    <h1 className="pr_auth_title">Reset Password</h1>
                    <p className="pr_auth_subtitle">Enter your new password</p>

                    <form onSubmit={handleSubmit} className="pr_auth_form">
                        <div className="pr_form_group">
                            <label htmlFor="newPassword" className="pr_label">New Password</label>
                            <div className="pr_input_pass_wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="newPassword"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className="pr_input"
                                    placeholder="Enter new password"
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

                        <div className="pr_form_group">
                            <label htmlFor="confirmPassword" className="pr_label">Confirm New Password</label>
                            <div className="pr_input_pass_wrapper">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="pr_input"
                                    placeholder="Confirm new password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="pr_eye_btn"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <svg.eyeOff fill="#64748b" /> : <svg.eye fill="#64748b" />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="pr_btn_primary pr_full_width" disabled={loading}>
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>

                    <p className="pr_auth_switch">
                        Remember your password? <Link to="/login">Sign In</Link>
                    </p>
                    </div>
                </div>
            </div>
            </div>
    );
};

export default Reset;
