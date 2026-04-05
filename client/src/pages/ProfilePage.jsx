import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  addAddress,
  changePassword,
  deleteAddress,
  fetchAddresses,
  updateAddress,
  updateProfile,
} from "@/features/auth/authSlice";

const blankAddress = {
  fullName: "",
  phone: "",
  pincode: "",
  city: "",
  state: "",
  fullAddress: "",
  isDefault: true,
};

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [password, setPassword] = useState({ currentPassword: "", newPassword: "" });
  const [address, setAddress] = useState(blankAddress);
  const [editingAddressId, setEditingAddressId] = useState(null);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  useEffect(() => {
    setProfile({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
  }, [user]);

  const handleAddressSubmit = async () => {
    if (editingAddressId) {
      await dispatch(updateAddress({ id: editingAddressId, values: address })).unwrap();
      toast.success("Address updated");
    } else {
      await dispatch(addAddress(address)).unwrap();
      toast.success("Address added");
    }
    setAddress(blankAddress);
    setEditingAddressId(null);
  };

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
        <h2 className="text-2xl font-black">{editingAddressId ? "Edit address" : "Add address"}</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {["fullName", "phone", "pincode", "city", "state"].map((key) => (
            <Input
              key={key}
              placeholder={key}
              value={address[key]}
              onChange={(event) => setAddress((current) => ({ ...current, [key]: event.target.value }))}
            />
          ))}
          <Input
            className="md:col-span-2"
            placeholder="Full Address"
            value={address.fullAddress}
            onChange={(event) => setAddress((current) => ({ ...current, fullAddress: event.target.value }))}
          />
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={address.isDefault}
            onChange={(event) => setAddress((current) => ({ ...current, isDefault: event.target.checked }))}
          />
          Set as default
        </label>
        <div className="flex gap-3">
          <Button onClick={handleAddressSubmit}>{editingAddressId ? "Update address" : "Add address"}</Button>
          {editingAddressId ? (
            <Button
              variant="secondary"
              onClick={() => {
                setEditingAddressId(null);
                setAddress(blankAddress);
              }}
            >
              Cancel
            </Button>
          ) : null}
        </div>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-2xl font-black">Saved addresses</h2>
        <div className="space-y-3">
          {user?.addresses?.length ? (
            user.addresses.map((item) => (
              <div key={item._id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                <p className="font-bold">
                  {item.fullName} {item.isDefault ? "· Default" : ""}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {item.fullAddress}, {item.city}, {item.state} - {item.pincode}
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.phone}</p>
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setEditingAddressId(item._id);
                      setAddress({
                        fullName: item.fullName,
                        phone: item.phone,
                        pincode: item.pincode,
                        city: item.city,
                        state: item.state,
                        fullAddress: item.fullAddress,
                        isDefault: item.isDefault,
                      });
                    }}
                  >
                    Edit
                  </Button>
                  <Button variant="ghost" className="text-rose-600" onClick={() => dispatch(deleteAddress(item._id))}>
                    Delete
                  </Button>
                </div>
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
