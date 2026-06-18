import { useState } from 'react';
import { Link } from 'react-router';
import toast from 'react-hot-toast';
import { apiCall } from '../../apiConfig/apiCall';
import AuthLeftPanel from '../../components/auth/AuthLeftPanel';

const Forget = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error('Please enter your email');
            return;
        }

        setLoading(true);
        try {
            const response = await apiCall({
                url: '/auth/forgot-password',
                method: 'POST',
                data: { email },
            });

            if (response.success) {
                toast.success('Password reset link sent to your email');
            } else {
                toast.error(response.message || 'Failed to send reset link');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to send reset link');
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
                        <h1 className="pr_auth_title">Forgot Password</h1>
                        <p className="pr_auth_subtitle">Enter your email to receive a password reset link</p>

                        <form onSubmit={handleSubmit} className="pr_auth_form">
                            <div className="pr_form_group">
                                <label htmlFor="email" className="pr_label">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pr_input"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <button type="submit" className="pr_btn_primary pr_full_width" disabled={loading}>
                                {loading ? 'Sending...' : 'Send Reset Link'}
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

export default Forget;
