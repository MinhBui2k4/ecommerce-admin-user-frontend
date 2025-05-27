import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/Button";

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="mb-4 text-2xl font-bold">Đã xảy ra lỗi</h2>
          <p className="mb-6 text-gray-600">
            {this.state.error?.message || "Có lỗi xảy ra. Vui lòng thử lại sau."}
          </p>
          <Link to="/">
            <Button>Quay lại trang chủ</Button>
          </Link>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;