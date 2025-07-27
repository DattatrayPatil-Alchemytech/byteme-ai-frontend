import React from 'react';
import Modal from './Modal';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface DeleteProductModalProps {
  show: boolean;
  onClose: () => void;
  handleDeleteConfirm: () => void;
}

export default function DeleteProductModal({ 
  show, 
  onClose, 
  handleDeleteConfirm 
}: DeleteProductModalProps) {
  return (
    <Modal show={show} handleClose={onClose} title="Product Delete">
      <div className="space-y-6">
        {/* Confirmation Message */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <Trash2 className="w-8 h-8 text-destructive" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Are you sure you want to delete this product?
            </h3>
            <p className="text-muted-foreground">
              This action cannot be undone. The product will be permanently removed from your catalog.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteConfirm}
            className="px-6 flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4 text-white" />
            <span className="text-white">Yes, Delete</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
} 