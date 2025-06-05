  import { useState } from "react";
  import { Button } from "../../components/ui/Button";
  import { Input } from "../../components/ui/Input";
  import { Textarea } from "../../components/ui/Textarea";
  import  Card,{ CardContent } from "../../components/ui/Card";
  import { POST_CONTACT } from "../../api/apiService";
  import { toast } from "react-toastify";

  export default function ContactPage() {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await POST_CONTACT({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.subject + ": " + formData.message, // Kết hợp subject và message
        });
        toast.success("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } catch (error) {
        toast.error("Không thể gửi tin nhắn. Vui lòng thử lại.");
      }
    };

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold md:text-3xl">Liên hệ với chúng tôi</h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-lg font-semibold md:text-xl">Thông tin liên hệ</h2>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <span className="mr-3 text-xl text-blue-600">📍</span>
                    <div>
                      <h3 className="font-medium">Địa chỉ</h3>
                      <p className="text-gray-600">
                        Số 20 Tăng Nhơn Phú, Phường Phước Long B, TP Thủ Đức, TP. Hồ Chí Minh
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="mr-3 text-xl text-blue-600">📞</span>
                    <div>
                      <h3 className="font-medium">Điện thoại</h3>
                      <p className="text-gray-600">(028) 1234 5678</p>
                      <p className="text-gray-600">Hotline: 1900 1234</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="mr-3 text-xl text-blue-600">✉️</span>
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-gray-600">info@techstore.com</p>
                      <p className="text-gray-600">support@techstore.com</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="mr-3 text-xl text-blue-600">⏰</span>
                    <div>
                      <h3 className="font-medium">Giờ làm việc</h3>
                      <p className="text-gray-600">Thứ 2 - Thứ 6: 8:00 - 20:00</p>
                      <p className="text-gray-600">Thứ 7 - Chủ nhật: 8:00 - 18:00</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form and Map */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-lg font-semibold md:text-xl">Gửi tin nhắn cho chúng tôi</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Họ và tên
                      </label>
                      <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Số điện thoại
                      </label>
                      <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Tiêu đề
                      </label>
                      <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Nội dung
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Gửi tin nhắn
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Google Map */}
            <div className="mt-6 h-[400px] overflow-hidden rounded-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.6099415304!2d106.77019937465353!3d10.841132089316364!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752701a34a5d5f%3A0x30056b2fdf668565!2zVMSDbmcgTmjGoW4gUGjDuiwgUGjGsOG7m2MgTG9uZyBCLCBRdeG6rW4gOSwgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1711936800000!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps - TechStore Location"
                onError={(e) => {
                  e.target.parentElement.innerHTML =
                    '<div className="flex h-full items-center justify-center bg-gray-100"><p>Không thể tải bản đồ. Vui lòng thử lại sau.</p></div>';
                }}
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    );
  }