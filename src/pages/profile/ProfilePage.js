import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/Tabs";
import Card, { CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Label } from "../../components/ui/Label";
import { Avatar } from "../../components/ui/Avatar";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../../components/ui/AlertDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/Select";
import { GET_PROFILE, UPDATE_PROFILE, CHANGE_PASSWORD, GET_USER_ADDRESSES, CREATE_ADDRESS, UPDATE_ADDRESS, DELETE_ADDRESS, SET_DEFAULT_ADDRESS } from "../../api/apiService";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    avatarUrl: "",
  });
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [addressForm, setAddressForm] = useState({
    id: 0,
    userId: 0,
    name: "",
    phone: "",
    address: "",
    ward: "",
    district: "",
    province: "",
    type: "home",
    default: false,
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Lấy thông tin profile và địa chỉ
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Vui lòng đăng nhập để xem thông tin cá nhân");
      navigate("/login");
      return;
    }

    setLoading(true);
    Promise.all([
      GET_PROFILE(),
      GET_USER_ADDRESSES({ page: 0, size: 100 }) // Lấy tất cả địa chỉ
    ])
      .then(([profileData, addressData]) => {
        setUserInfo({
          fullName: profileData.fullName || "",
          email: profileData.email || "",
          phone: profileData.phone || "",
          avatarUrl: profileData.avatarUrl || "",
        });
        setAvatarPreview(profileData.avatarUrl ? `http://localhost:8080/api/users/image/${profileData.avatarUrl}` : "");
        setAddresses(addressData.content || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch profile or addresses:", error);
        toast.error("Không thể tải thông tin cá nhân hoặc địa chỉ");
        setLoading(false);
      });
  }, [navigate]);

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setAvatarPreview(e.target.result);
            setAvatarFile(file);
          }
        };
        reader.onerror = () => {
          toast.error("Không thể đọc file ảnh");
        };
        reader.readAsDataURL(file);
      } catch (error) {
        toast.error("Lỗi khi xử lý ảnh");
      }
    }
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    if (!userInfo.fullName || !userInfo.email) {
      toast.error("Họ và tên và email là bắt buộc");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("fullName", userInfo.fullName);
      formData.append("email", userInfo.email);
      formData.append("phone", userInfo.phone);
      if (avatarFile) {
        formData.append("avatarFile", avatarFile);
      }
      const updatedUser = await UPDATE_PROFILE(formData);
      setUserInfo({
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        avatarUrl: updatedUser.avatarUrl,
      });
      setAvatarPreview(updatedUser.avatarUrl ? `http://localhost:8080/api/users/image/${updatedUser.avatarUrl}` : "");
      setAvatarFile(null);
      toast.success("Cập nhật thông tin thành công");
    } catch (error) {
      console.error("Update profile error:", error.response?.data);
      toast.error(error.response?.data?.message || "Không thể cập nhật thông tin");
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Mật khẩu mới không khớp với xác nhận");
      return;
    }
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      toast.error("Vui lòng nhập đầy đủ mật khẩu");
      return;
    }
    try {
      await CHANGE_PASSWORD({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Đổi mật khẩu thành công");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Change password error:", error.response?.data);
      toast.error(error.response?.data?.message || "Lỗi khi đổi mật khẩu");
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressSelectChange = (name, value) => {
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: checked }));
  };

  const validateAddressForm = () => {
    if (!addressForm.name.trim()) return "Họ và tên không được để trống";
    if (!addressForm.phone.match(/^\d{10,11}$/)) return "Số điện thoại không hợp lệ (10-11 số)";
    if (!addressForm.address.trim()) return "Địa chỉ cụ thể không được để trống";
    if (!addressForm.ward) return "Vui lòng chọn phường/xã";
    if (!addressForm.district) return "Vui lòng chọn quận/huyện";
    if (!addressForm.province) return "Vui lòng chọn tỉnh/thành phố";
    return null;
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    const error = validateAddressForm();
    if (error) {
      toast.error(error);
      return;
    }

    const addressData = {
      id: isEditingAddress ? addressForm.id : 0,
      userId: 0, // Backend sẽ lấy từ token
      name: addressForm.name,
      phone: addressForm.phone,
      address: addressForm.address,
      ward: addressForm.ward,
      district: addressForm.district,
      province: addressForm.province,
      type: addressForm.type,
      default: addressForm.default,
    };

    try {
      let savedAddress;
      if (isEditingAddress) {
        savedAddress = await UPDATE_ADDRESS(addressForm.id, addressData);
        setAddresses((prev) =>
          prev.map((addr) => (addr.id === addressForm.id ? { ...addr, ...savedAddress } : addr))
        );
        toast.success("Cập nhật địa chỉ thành công");
      } else {
        savedAddress = await CREATE_ADDRESS(addressData);
        setAddresses((prev) => [...prev, savedAddress]);
        toast.success("Thêm địa chỉ thành công");
      }
      if (addressForm.default) {
        await SET_DEFAULT_ADDRESS(savedAddress.id);
        setAddresses((prev) =>
          prev.map((addr) => ({
            ...addr,
            isDefault: addr.id === savedAddress.id,
          }))
        );
      }
      setAddressDialogOpen(false);
      setAddressForm({
        id: 0,
        userId: 0,
        name: "",
        phone: "",
        address: "",
        ward: "",
        district: "",
        province: "",
        type: "home",
        default: false,
      });
      setIsEditingAddress(false);
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error(error.response?.data?.message || "Không thể lưu địa chỉ");
    }
  };

  const handleEditAddress = (address) => {
    setAddressForm({
      id: address.id,
      userId: 0,
      name: address.name || "",
      phone: address.phone || "",
      address: address.address || "",
      ward: address.ward || "",
      district: address.district || "",
      province: address.province || "",
      type: address.type || "home",
      default: address.isDefault || false,
    });
    setIsEditingAddress(true);
    setAddressDialogOpen(true);
  };

  const handleDeleteAddress = async () => {
    try {
      await DELETE_ADDRESS(addressToDelete);
      setAddresses((prev) => prev.filter((addr) => addr.id !== addressToDelete));
      toast.success("Xóa địa chỉ thành công");
      setDeleteDialogOpen(false);
      setAddressToDelete(null);
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error(error.response?.data?.message || "Không thể xóa địa chỉ");
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      await SET_DEFAULT_ADDRESS(addressId);
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          isDefault: addr.id === addressId,
        }))
      );
      toast.success("Đặt địa chỉ mặc định thành công");
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error(error.response?.data?.message || "Không thể đặt địa chỉ mặc định");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex h-96 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">Tài khoản của tôi</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col items-center">
                <Avatar
                  src={avatarPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.fullName)}&background=random`}
                  alt={userInfo.fullName}
                  fallback={userInfo.fullName.charAt(0)}
                  className="h-20 w-20 md:h-24 md:w-24"
                />
                <h2 className="mt-4 text-lg font-semibold md:text-xl">{userInfo.fullName}</h2>
                <p className="text-sm text-gray-500">{userInfo.email}</p>
              </div>

              <div className="mt-6 space-y-2">
                <Link
                  to="/profile"
                  className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                >
                  <span className="mr-2 text-xl">👤</span>
                  Thông tin tài khoản
                </Link>
                <Link
                  to="/orders"
                  className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-red-100"
                >
                  <span className="mr-2 text-xl">📦</span>
                  Đơn hàng của tôi
                </Link>
                <Link
                  to="/wishlist"
                  className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-red-100"
                >
                  <span className="mr-2 text-xl">♥</span>
                  Sản phẩm yêu thích
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-red-100 w-full text-left"
                >
                  <span className="mr-2 text-xl">🚪</span>
                  Đăng xuất
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          <Tabs defaultValue="personal-info">
            <TabsList className="mb-6 grid w-full grid-cols-3">
              <TabsTrigger value="personal-info">Thông tin cá nhân</TabsTrigger>
              <TabsTrigger value="change-password">Đổi mật khẩu</TabsTrigger>
              <TabsTrigger value="addresses">Địa chỉ</TabsTrigger>
            </TabsList>

            <TabsContent value="personal-info">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cá nhân</CardTitle>
                  <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleInfoSubmit}>
                    <div className="mb-6 flex flex-col items-center">
                      <div className="relative">
                        <Avatar
                          src={avatarPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.fullName)}&background=random`}
                          alt={userInfo.fullName}
                          fallback={userInfo.fullName.charAt(0)}
                          className="h-20 w-20 md:h-24 md:w-24"
                        />
                        <label
                          htmlFor="avatar-upload"
                          className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-500 text-white"
                        >
                          <span className="text-xl">📷</span>
                          <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                          />
                        </label>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">Nhấp vào biểu tượng để thay đổi ảnh đại diện</p>
                    </div>

                    <div className="grid gap-6">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Họ và tên</Label>
                          <Input
                            id="fullName"
                            name="fullName"
                            value={userInfo.fullName}
                            onChange={handleInfoChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={userInfo.email}
                            onChange={handleInfoChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={userInfo.phone}
                          onChange={handleInfoChange}
                        />
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit" onClick={handleInfoSubmit}>Cập nhật thông tin</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="change-password">
              <Card>
                <CardHeader>
                  <CardTitle>Đổi mật khẩu</CardTitle>
                  <CardDescription>Cập nhật mật khẩu để bảo mật tài khoản</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordSubmit}>
                    <div className="grid gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="oldPassword">Mật khẩu hiện tại</Label>
                        <div className="relative">
                          <Input
                            id="oldPassword"
                            name="oldPassword"
                            type={showOldPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={passwordData.oldPassword}
                            onChange={handlePasswordChange}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                          >
                            {showOldPassword ? "🙈" : "👁️"}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Mật khẩu mới</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? "🙈" : "👁️"}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? "🙈" : "👁️"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handlePasswordSubmit}>Đổi mật khẩu</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="addresses">
              <Card>
                <CardHeader>
                  <CardTitle>Quản lý địa chỉ</CardTitle>
                  <CardDescription>Thêm, chỉnh sửa hoặc xóa địa chỉ giao hàng của bạn</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAddressForm({
                          id: 0,
                          userId: 0,
                          name: "",
                          phone: "",
                          address: "",
                          ward: "",
                          district: "",
                          province: "",
                          type: "home",
                          default: false,
                        });
                        setIsEditingAddress(false);
                        setAddressDialogOpen(true);
                      }}
                    >
                      <span className="mr-2 text-xl">➕</span> Thêm địa chỉ mới
                    </Button>
                  </div>
                  {addresses.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Bạn chưa có địa chỉ nào. Hãy thêm địa chỉ mới.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className="flex items-center justify-between border rounded-lg p-4"
                        >
                          <div>
                            <div className="flex items-center">
                              <p className="font-medium">{address.name}</p>
                              {address.isDefault && (
                                <span className="ml-2 text-sm text-green-600">[Mặc định]</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{address.phone}</p>
                            <p className="text-sm text-gray-500">
                              {`${address.address}, ${address.ward}, ${address.district}, ${address.province}`}
                            </p>
                            <p className="text-sm text-gray-500">{address.type === "home" ? "Nhà riêng" : "Văn phòng"}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {!address.isDefault && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSetDefaultAddress(address.id)}
                                title="Đặt làm mặc định"
                              >
                                Đặt mặc định
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditAddress(address)}
                              title="Chỉnh sửa địa chỉ"
                            >
                              Sửa
                            </Button>
                            {!address.isDefault && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 hover:text-red-600"
                                onClick={() => {
                                  setAddressToDelete(address.id);
                                  setDeleteDialogOpen(true);
                                }}
                                title="Xóa địa chỉ"
                              >
                                Xóa
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Address Dialog */}
      <AlertDialog open={addressDialogOpen} onOpenChange={setAddressDialogOpen}>
        <AlertDialogContent className="sm:max-w-[500px]">
          <AlertDialogHeader>
            <AlertDialogTitle>{isEditingAddress ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}</AlertDialogTitle>
            <AlertDialogDescription>
              {isEditingAddress ? "Cập nhật thông tin địa chỉ giao hàng." : "Nhập thông tin địa chỉ giao hàng mới."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form onSubmit={handleAddressSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Họ và tên</Label>
                  <Input
                    id="name"
                    name="name"
                    value={addressForm.name}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={addressForm.phone}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="province">Tỉnh/Thành phố</Label>
                  <Select
                    value={addressForm.province}
                    onValueChange={(value) => handleAddressSelectChange("province", value)}
                  >
                    <SelectTrigger id="province">
                      <SelectValue placeholder="Chọn tỉnh/thành" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                      <SelectItem value="hn">Hà Nội</SelectItem>
                      <SelectItem value="dn">Đà Nẵng</SelectItem>
                      <SelectItem value="ct">Cần Thơ</SelectItem>
                      <SelectItem value="hp">Hải Phòng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">Quận/Huyện</Label>
                  <Select
                    value={addressForm.district}
                    onValueChange={(value) => handleAddressSelectChange("district", value)}
                  >
                    <SelectTrigger id="district">
                      <SelectValue placeholder="Chọn quận/huyện" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="q1">Quận 1</SelectItem>
                      <SelectItem value="q2">Quận 2</SelectItem>
                      <SelectItem value="q3">Quận 3</SelectItem>
                      <SelectItem value="q4">Quận 4</SelectItem>
                      <SelectItem value="q5">Quận 5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ward">Phường/Xã</Label>
                  <Select
                    value={addressForm.ward}
                    onValueChange={(value) => handleAddressSelectChange("ward", value)}
                  >
                    <SelectTrigger id="ward">
                      <SelectValue placeholder="Chọn phường/xã" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="p1">Phường 1</SelectItem>
                      <SelectItem value="p2">Phường 2</SelectItem>
                      <SelectItem value="p3">Phường 3</SelectItem>
                      <SelectItem value="p4">Phường 4</SelectItem>
                      <SelectItem value="p5">Phường 5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ cụ thể</Label>
                <Input
                  id="address"
                  name="address"
                  value={addressForm.address}
                  onChange={handleAddressChange}
                  placeholder="Số nhà, tên đường, tòa nhà, ..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Loại địa chỉ</Label>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="type-home"
                      name="type"
                      value="home"
                      checked={addressForm.type === "home"}
                      onChange={() => handleAddressSelectChange("type", "home")}
                      className="h-4 w-4 text-red-600"
                    />
                    <Label htmlFor="type-home" className="font-normal">Nhà riêng</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="type-office"
                      name="type"
                      value="office"
                      checked={addressForm.type === "office"}
                      onChange={() => handleAddressSelectChange("type", "office")}
                      className="h-4 w-4 text-red-600"
                    />
                    <Label htmlFor="type-office" className="font-normal">Văn phòng</Label>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="default"
                  name="default"
                  checked={addressForm.default}
                  onChange={handleAddressCheckboxChange}
                  className="h-4 w-4 text-red-600"
                />
                <Label htmlFor="default" className="font-normal">Đặt làm địa chỉ mặc định</Label>
              </div>
            </div>
            <AlertDialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddressDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit">{isEditingAddress ? "Cập nhật" : "Lưu địa chỉ"}</Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={(open) => {
        setDeleteDialogOpen(open);
        if (!open) setAddressToDelete(null);
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Địa chỉ này sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setDeleteDialogOpen(false);
              setAddressToDelete(null);
            }}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAddress}
              className="bg-red-500 hover:bg-red-600"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

