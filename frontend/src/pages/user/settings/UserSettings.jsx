import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useUserStore from "../../../store/useUserStore";
import { apiCall } from "../../../apiConfig/apiCall";
import "../../../../styles/UserSettings.css";

const UserSettings = () => {
    const { user, UStore } = useUserStore();
    const [profileForm, setProfileForm] = useState({
        name: "",
        email: "",
        phone: "",
    });
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: "",
        newPassword: "",
    });
    const [saving, setSaving] = useState(false);
    const [changing, setChanging] = useState(false);

    useEffect(() => {
        setProfileForm({
            name: user?.name || "",
            email: user?.email || "",
            phone: user?.phone || "",
        });
    }, [user]);

    const handleProfileChange = (event) => {
        const { name, value } = event.target;
        setProfileForm((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (event) => {
        const { name, value } = event.target;
        setPasswordForm((prev) => ({ ...prev, [name]: value }));
    };

    const saveProfile = async () => {
        setSaving(true);
        const response = await apiCall({
            url: "/auth/me",
            method: "PATCH",
            data: profileForm,
        });
        if (response?.success) {
            await UStore("user", response.data.user);
            toast.success("Profile updated");
        } else {
            toast.error(response?.message || "Update failed");
        }
        setSaving(false);
    };

    const changePassword = async (e) => {
        e.preventDefault();
        if (!passwordForm.oldPassword || !passwordForm.newPassword) {
            toast.error("Please fill both password fields");
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()[\]{}\-_=+|\\:;"'<>,./~`])[A-Za-z\d@$!%*?&^#()[\]{}\-_=+|\\:;"'<>,./~`]{8,}$/;
        if (!passwordRegex.test(passwordForm.newPassword)) {
            toast.error("New password must be at least 8 characters, include uppercase, lowercase, number, and special character");
            return;
        }

        setChanging(true);
        const response = await apiCall({
            url: "/auth/change-password",
            method: "POST",
            data: passwordForm,
        });
        if (response?.success) {
            toast.success("Password updated");
            setPasswordForm({ oldPassword: "", newPassword: "" });
        } else {
            toast.error(response?.message || "Password update failed");
        }
        setChanging(false);
    };
    const [activeTab, setActiveTab] = useState("profile");
    return (
        <div className="pr_settings">
            <div className="pr_settings__header">
                <h2>User Settings</h2>
                <p>Manage your account details and security preferences.</p>
            </div>

            <div className="pr_settings__content">
                <div className="pr_tabs">
                    <button
                        className={`pr_tab ${activeTab === "profile" ? "active" : ""}`}
                        onClick={() => setActiveTab("profile")}
                        type="button"
                    >
                        Profile
                    </button>
                    <button
                        className={`pr_tab ${activeTab === "password" ? "active" : ""}`}
                        onClick={() => setActiveTab("password")}
                        type="button"
                    >
                        Password
                    </button>
                </div>
                {
                    activeTab === "profile" ? (
                        <section className="pr_settings__card">
                            <div className="pr_settings__form">
                                <div className="pr_settings__form_group">
                                    <label>Name</label>
                                    <input
                                        className="pr_settings__input"
                                        name="name"
                                        value={profileForm.name}
                                        onChange={handleProfileChange}
                                        placeholder="Your name"
                                    />
                                </div>
                                <div className="pr_settings__form_group">
                                    <label>Email</label>
                                    <input
                                        className="pr_settings__input"
                                        name="email"
                                        value={profileForm.email}
                                        onChange={handleProfileChange}
                                        placeholder="Your email"
                                    />
                                </div>
                                <div className="pr_settings__form_group">
                                    <label>Phone</label>
                                    <input
                                        className="pr_settings__input"
                                        name="phone"
                                        value={profileForm.phone}
                                        onChange={handleProfileChange}
                                        placeholder="+1 555 000 1234"
                                    />
                                </div>
                            </div>
                            <div className="pr_settings__actions">
                                <button className="pr_settings__cta" type="button" onClick={saveProfile}>
                                    {saving ? "Saving..." : "Save Profile"}
                                </button>
                            </div>
                        </section>
                    ) : (
                        <form className="pr_settings__card" >
                            <div className="pr_settings__form">
                                <div className="pr_settings__form_group">
                                    <label>Current Password</label>
                                    <input className="pr_settings__input" type="password"
                                        name="oldPassword"
                                        value={passwordForm.oldPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Current password"
                                    />
                                </div>
                                <div className="pr_settings__form_group">
                                    <label>New Password</label>
                                    <input
                                        className="pr_settings__input"
                                        type="password"
                                        name="newPassword"
                                        value={passwordForm.newPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="New password"
                                    />
                                </div>
                            </div>
                            <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted, #6b7280)", marginTop: "-0.5rem" }}>
                                *Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.
                            </p>
                            <div className="pr_settings__actions">
                                <button className="pr_settings__cta" type="submit" onClick={changePassword}>
                                    {changing ? "Updating..." : "Update Password"}
                                </button>
                            </div>
                        </form>
                    )
                }
            </div>
        </div>
    );
};

export default UserSettings;
