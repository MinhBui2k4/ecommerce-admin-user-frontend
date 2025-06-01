import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/Tabs";
import Card,{  CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Label } from "../../components/ui/Label";
import { Textarea } from "../../components/ui/Textarea";
import { Avatar } from "../../components/ui/Avatar";
import { GET_PROFILE, UPDATE_PROFILE, CHANGE_PASSWORD } from "../../api/apiService";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    birthday: "",
    gender: "male",
    address: "",
    avatarUrl: "",
  });
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GET_PROFILE()
      .then((data) => {
        setUserInfo({
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          birthday: data.birthday || "",
          gender: data.gender || "male",
          address: data.address || "",
          avatarUrl: data.avatarUrl || "",
        });
        setAvatarPreview(data.avatarUrl ? `http://localhost:8080/api/users/image/${data.avatarUrl}` : "");
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch profile:", error);
        toast.error("Không thể tải thông tin cá nhân");
        setLoading(false);
      });
  }, []);

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
      formData.append("birthday", userInfo.birthday);
      formData.append("gender", userInfo.gender);
      formData.append("address", userInfo.address);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }
      await UPDATE_PROFILE(formData);
      toast.success("Cập nhật thông tin thành công");
    } catch (error) {
      toast.error("Không thể cập nhật thông tin");
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Mật khẩu mới không khớp");
      return;
    }
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error("Vui lòng nhập đầy đủ mật khẩu");
      return;
    }
    try {
      await CHANGE_PASSWORD({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Đổi mật khẩu thành công");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error("Không thể đổi mật khẩu");
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
            <TabsList className="mb-6 grid w-full grid-cols-2">
              <TabsTrigger value="personal-info" >Thông tin cá nhân</TabsTrigger>
              <TabsTrigger value="change-password">Đổi mật khẩu</TabsTrigger>
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

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Số điện thoại</Label>
                          <Input id="phone" name="phone" value={userInfo.phone} onChange={handleInfoChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="birthday">Ngày sinh</Label>
                          <Input
                            id="birthday"
                            name="birthday"
                            type="date"
                            value={userInfo.birthday}
                            onChange={handleInfoChange}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gender">Giới tính</Label>
                        <div className="flex space-x-4">
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="gender"
                              value="male"
                              checked={userInfo.gender === "male"}
                              onChange={handleInfoChange}
                              className="h-4 w-4 text-red-600"
                            />
                            <span>Nam</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="gender"
                              value="female"
                              checked={userInfo.gender === "female"}
                              onChange={handleInfoChange}
                              className="h-4 w-4 text-red-600"
                            />
                            <span>Nữ</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="gender"
                              value="other"
                              checked={userInfo.gender === "other"}
                              onChange={handleInfoChange}
                              className="h-4 w-4 text-red-600"
                            />
                            <span>Khác</span>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Địa chỉ</Label>
                        <Textarea
                          id="address"
                          name="address"
                          value={userInfo.address}
                          onChange={handleInfoChange}
                          rows={3}
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
                        <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Mật khẩu mới</Label>
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handlePasswordSubmit}>Đổi mật khẩu</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}