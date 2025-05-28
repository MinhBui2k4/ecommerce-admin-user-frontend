import { useState } from "react";
import { Button } from "../../components/ui/Button";    
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/AlertDialog";
import AddressForm from "./AddressForm";
import { DELETE_ADDRESS } from "../../api/apiService";
import { toast } from "react-toastify";

export default function AddressActions({ address, onEdit, onDelete }) {
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
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <span className="text-xl">✏️</span>
          </Button>
        }
      />

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
        onClick={() => setShowDeleteDialog(true)}
        disabled={address.isDefault}
        title={address.isDefault ? "Không thể xóa địa chỉ mặc định" : "Xóa địa chỉ"}
      >
        <span className="text-xl">🗑️</span>
      </Button>

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
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}