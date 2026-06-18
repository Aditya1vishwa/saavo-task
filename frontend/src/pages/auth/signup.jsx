import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import useUserStore from '../../store/useUserStore';
import { apiCall } from '../../apiConfig/apiCall';
import svg from '../../assets/svg';
import SelectInput from '../../components/common/SelectInput';
import AuthLeftPanel from '../../components/auth/AuthLeftPanel';

const ROLE_OPTIONS = [
    { value: 'user', label: 'Attendee — book and attend events' },
    { value: 'organizer', label: 'Organizer — create and manage events' },
];

const Signup = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);

    // OTP State
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [resendCooldown, setResendCooldown] = useState(0);
    const inputRefs = useRef([]);

    const { UStore } = useUserStore();
    const navigate = useNavigate();

    useEffect(() => {
        let timer;
        if (resendCooldown > 0) {
            timer = setInterval(() => {
                setResendCooldown(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [resendCooldown]);

    const startResendCooldown = () => setResendCooldown(60);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value !== '' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            toast.error('Please fill all fields');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()[\]{}\-_=+|\\:;"'<>,./~`])[A-Za-z\d@$!%*?&^#()[\]{}\-_=+|\\:;"'<>,./~`]{8,}$/;
        if (!passwordRegex.test(formData.password.trim())) {
            toast.error('Password must be at least 8 characters, include uppercase, lowercase, number, and special character');
            return;
        }

        setLoading(true);
        try {
            const response = await apiCall({
                url: '/auth/signup',
                method: 'POST',
                data: {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                },
            });

            if (response.success) {
                toast.success(response.message || 'Account created successfully. Please verify your email.');
                setStep(2);
                startResendCooldown();
            } else {
                toast.error(response.message || 'Signup failed');
            }
        } catch (error) {
            toast.error(error.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const otpValue = otp.join('');
        if (otpValue.length !== 6) {
            toast.error("Please enter the complete 6-digit OTP");
            return;
        }

        setOtpLoading(true);
        try {
            const response = await apiCall({
                url: '/auth/verify-email',
                method: 'POST',
                data: { email: formData.email, otp: otpValue },
            });

            if (response.success) {
                toast.success('Email verified successfully. Please login.');
                navigate('/login');
            } else {
                toast.error(response.message || 'Verification failed');
            }
        } catch (error) {
            toast.error(error.message || 'Verification failed');
        } finally {
            setOtpLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendCooldown > 0) return;

        try {
            const response = await apiCall({
                url: '/auth/resend-otp',
                method: 'POST',
                data: { email: formData.email },
            });

            if (response.success) {
                toast.success('OTP resent successfully');
                startResendCooldown();
            } else {
                toast.error(response.message || 'Failed to resend OTP');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to resend OTP');
        }
    };

    return (
        <div className="pr_auth_page">
            <div className="pr_app_name_mobile">EventNest</div>

            <div className="pr_auth_inner">
                <div className="pr_auth_left">
                    <AuthLeftPanel />
                </div>

                <div className="pr_auth_right">
                    <div className="pr_auth_form_container">
                        <h1 className="pr_auth_title">{step === 1 ? 'Create Account' : 'Verify Email'}</h1>
                        <p className="pr_auth_subtitle">
                            {step === 1
                                ? 'Create your account to start booking events'
                                : `We've sent a 6-digit verification code to ${formData.email}`
                            }
                        </p>

                        {step === 1 ? (
                            <form onSubmit={handleSubmit} className="pr_auth_form">
                                <div className="pr_form_group">
                                    <label htmlFor="name" className="pr_label">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="pr_input"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>

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
                                    <label className="pr_label">Join as</label>
                                    <SelectInput
                                        options={ROLE_OPTIONS}
                                        value={formData.role}
                                        onChange={(v) => setFormData((f) => ({ ...f, role: v }))}
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
                                            placeholder="Create a password"
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
                                    <label htmlFor="confirmPassword" className="pr_label">Confirm Password</label>
                                    <div className="pr_input_pass_wrapper">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="pr_input"
                                            placeholder="Confirm your password"
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
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                </button>

                                <div className="pr_divider">
                                    <span>or</span>
                                </div>
                                <button type="button" className="pr_btn_google">
                                    {svg.google({})}
                                    Sign up with Google
                                </button>
                                <p className="pr_auth_switch">
                                    Already have an account? <Link to="/login">Sign In</Link>
                                </p>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyOtp} className="pr_auth_form">
                                <div className="pr_form_group" style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '24px' }}>
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            ref={el => inputRefs.current[index] = el}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                            className="pr_input"
                                            style={{ width: '48px', height: '48px', textAlign: 'center', fontSize: '20px', fontWeight: 'bold' }}
                                        />
                                    ))}
                                </div>

                                <button type="submit" className="pr_btn_primary pr_full_width" disabled={otpLoading}>
                                    {otpLoading ? 'Verifying...' : 'Verify Email'}
                                </button>

                                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={resendCooldown > 0}
                                        style={{ background: 'none', border: 'none', color: resendCooldown > 0 ? '#94a3b8' : '#2563eb', cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer', fontWeight: '500', fontSize: '14px' }}
                                    >
                                        {resendCooldown > 0 ? `Resend Code in ${resendCooldown}s` : 'Resend Code'}
                                    </button>
                                </div>

                                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline' }}
                                    >
                                        Change Email Address
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
