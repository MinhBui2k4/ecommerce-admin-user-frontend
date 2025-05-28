import { useState, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Textarea } from "../../components/ui/Textarea";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../components/ui/AlertDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/Select";
import { CREATE_ADDRESS, UPDATE_ADDRESS, SET_DEFAULT_ADDRESS } from "../../api/apiService";
import { toast } from "react-toastify";

export default function AddressForm({ onAddAddress, onUpdateAddress, addressToEdit = null, trigger }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    ward: "",
    district: "",
    province: "",
    isDefault: false,
    type: "home",
  });

  useEffect(() => {
    if (addressToEdit) {
      setFormData({
        name: addressToEdit.name,
        phone: addressToEdit.phone,
        address: addressToEdit.address,
        ward: addressToEdit.ward,
        district: addressToEdit.district,
        province: addressToEdit.province,
        isDefault: addressToEdit.isDefault,
        type: addressToEdit.type,
      });
    }
  }, [addressToEdit, open]);

  useEffect(() => {
    if (!open && !addressToEdit) {
      setFormData({
        name: "",
        phone: "",
        address: "",
        ward: "",
        district: "",
        province: "",
        isDefault: false,
        type: "home",
      });
    }
  }, [open, addressToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address || !formData.ward || !formData.district || !formData.province) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    try {
      let address;
      if (addressToEdit) {
        address = await UPDATE_ADDRESS(addressToEdit.id, formData);
        onUpdateAddress?.({ ...formData, id: addressToEdit.id });
        toast.success("Cập nhật địa chỉ thành công");
      } else {
        address = await CREATE_ADDRESS(formData);
        onAddAddress?.({ ...formData, id: address.id });
        toast.success("Thêm địa chỉ thành công");
      }
      if (formData.isDefault) {
        await SET_DEFAULT_ADDRESS(address.id);
      }
      setOpen(false);
    } catch (error) {
      toast.error("Không thể lưu địa chỉ");
    }
  };

  const defaultTrigger = addressToEdit ? (
    <Button variant="ghost" size="icon" className="h-8 w-8">
      <span className="text-xl">✏️</span>
    </Button>
  ) : (
    <Button variant="outline" size="sm">
      <span className="mr-2 text-xl">➕</span>
      Thêm địa chỉ mới
    </Button>
  );

  return (
        <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger || defaultTrigger}</AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
          <AlertDialogTitle>{addressToEdit ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}</AlertDialogTitle>
          <AlertDialogDescription>
            {addressToEdit ? "Cập nhật thông tin địa chỉ giao hàng." : "Nhập thông tin địa chỉ giao hàng mới."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Họ và tên</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="province">Tỉnh/Thành phố</Label>
                <Select value={formData.province} onValueChange={(value) => handleSelectChange("province", value)}>
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
                <Select value={formData.district} onValueChange={(value) => handleSelectChange("district", value)}>
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
                <Select value={formData.ward} onValueChange={(value) => handleSelectChange("ward", value)}>
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
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
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
                    checked={formData.type === "home"}
                    onChange={() => handleSelectChange("type", "home")}
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
                    checked={formData.type === "office"}
                    onChange={() => handleSelectChange("type", "office")}
                    className="h-4 w-4 text-red-600"
                  />
                  <Label htmlFor="type-office" className="font-normal">Văn phòng</Label>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isDefault"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-red-600"
              />
              <Label htmlFor="isDefault" className="font-normal">Đặt làm địa chỉ mặc định</Label>
            </div>
          </div>
          <AlertDialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Hủy</Button>
            <Button type="submit">{addressToEdit ? "Cập nhật" : "Lưu địa chỉ"}</Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}