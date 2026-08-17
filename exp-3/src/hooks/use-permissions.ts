import { useAppSelector } from "@/app/hooks";
import { canCreate, canDelete, canEdit, canPublish, canView } from "@/lib/permissions";

export function usePermissions() {
  const role = useAppSelector((s) => s.auth.user?.role);

  return {
    role,
    canView: role ? canView(role) : false,
    canCreate: role ? canCreate(role) : false,
    canEdit: role ? canEdit(role) : false,
    canDelete: role ? canDelete(role) : false,
    canPublish: role ? canPublish(role) : false,
  };
}
