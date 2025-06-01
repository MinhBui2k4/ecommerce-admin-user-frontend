import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/AlertDialog";
import AddressForm from "./AddressForm";
import { DELETE_ADDRESS } from "../../api/apiService";
import { toast } from "react-toastify";

export default function AddressActions({ address, onEdit, onDelete, hideDelete = false }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    try {
      await DELETE_ADDRESS(address.id);
      onDelete(address.id);
      toast.success("Xóa địa chỉ thành công");
      setShowDeleteDialog(false);
    } catch (error) {
      toast.error("Không thể xóa địa chỉ");
    }
  };

  return (
    <div className="flex items-center space-x-1">
      <AddressForm
        onAddAddress={() => {}}
        onUpdateAddress={onEdit}
        addressToEdit={address}
        trigger={
          <button
            className="h-8 w-8 flex items-center justify-center bg-blue-500 text-white rounded-md hover:bg-blue-600"
            title="Chỉnh sửa địa chỉ"
          >
            <span className="text-xl">✏️</span>
          </button>
        }
      />
      {!hideDelete && (
        <button
          className={`h-8 w-8 flex items-center justify-center rounded-md text-red-500 hover:bg-red-50 hover:text-red-600 ${
            address.isDefault ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => setShowDeleteDialog(true)}
          disabled={address.isDefault}
          title={address.isDefault ? "Không thể xóa địa chỉ mặc định" : "Xóa địa chỉ"}
        >
          <span className="text-xl">🗑️</span>
        </button>
      )}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Địa chỉ này sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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