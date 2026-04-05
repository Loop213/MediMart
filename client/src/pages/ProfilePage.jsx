import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { addAddress, changePassword, deleteAddress, updateProfile } from "@/features/auth/authSlice";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [address, setAddress] = useState({
    label: "Home",
    fullName: user?.name || "",
    phone: user?.phone || "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    isDefault: true,
  });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="space-y-4">
        <h1 className="text-2xl font-black">Profile</h1>
        <div className="space-y-3">
          {["name", "email", "phone"].map((key) => (
            <Input
              key={key}
              value={profile[key]}
              placeholder={key}
              onChange={(event) => setProfile((current) => ({ ...current, [key]: event.target.value }))}
            />
          ))}
          <Button onClick={() => dispatch(updateProfile(profile))}>Save profile</Button>
        </div>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-2xl font-black">Change password</h2>
        <Input
          type="password"
          placeholder="Current password"
          value={password.currentPassword}
          onChange={(event) => setPassword((current) => ({ ...current, currentPassword: event.target.value }))}
        />
        <Input
          type="password"
          placeholder="New password"
          value={password.newPassword}
          onChange={(event) => setPassword((current) => ({ ...current, newPassword: event.target.value }))}
        />
        <Button onClick={() => dispatch(changePassword(password))}>Update password</Button>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-2xl font-black">Add address</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {["label", "fullName", "phone", "line1", "line2", "city", "state", "postalCode"].map((key) => (
            <Input
              key={key}
              className={key === "line1" || key === "line2" ? "md:col-span-2" : ""}
              placeholder={key}
              value={address[key]}
              onChange={(event) => setAddress((current) => ({ ...current, [key]: event.target.value }))}
            />
          ))}
        </div>
        <Button onClick={() => dispatch(addAddress(address))}>Add address</Button>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-2xl font-black">Saved addresses</h2>
        <div className="space-y-3">
          {user?.addresses?.length ? (
            user.addresses.map((item) => (
              <div key={item._id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                <p className="font-bold">
                  {item.label} {item.isDefault ? "· Default" : ""}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {item.fullName}, {item.line1}, {item.city}, {item.state} {item.postalCode}
                </p>
                <Button variant="ghost" className="mt-2 text-rose-600" onClick={() => dispatch(deleteAddress(item._id))}>
                  Remove
                </Button>
              </div>
            ))
          ) : (
            <p className="text-slate-500 dark:text-slate-400">No addresses saved yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
