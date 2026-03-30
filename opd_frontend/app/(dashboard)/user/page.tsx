"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Modal } from "@/components/ui/Modal";
import { GetAllUsers, CreateUser, UpdateUser, DeleteUser, GetAllRoles } from "@/app/service/user.service";

export default function UserPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [formData, setFormData] = useState({ Username: "", Password: "", RoleID: "", Mobile: "" });

  const fetchData = async () => {
    setLoading(true);
    const [userData, roleData] = await Promise.all([GetAllUsers(), GetAllRoles()]);
    if (!userData?.error) setUsers(Array.isArray(userData) ? userData : []);
    if (!roleData?.error) setRoles(Array.isArray(roleData) ? roleData : []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenModal = (user?: any) => {
    if (user) {
      setEditing(user);
      setFormData({ 
        Username: user.Username, 
        Password: "", // Don't pre-fill password for security
        RoleID: String(user.RoleID), 
        Mobile: user.Mobile || "" 
      });
    } else {
      setEditing(null);
      setFormData({ Username: "", Password: "", RoleID: "", Mobile: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { 
      ...formData, 
      RoleID: parseInt(formData.RoleID)
    };
    
    // If editing and password is empty, don't send it to backend to avoid overwriting with empty
    if (editing && !payload.Password) {
      delete (payload as any).Password;
    }

    if (editing) { 
      await UpdateUser(editing.UserID, payload); 
    } else { 
      await CreateUser(payload); 
    }
    
    setIsModalOpen(false);
    fetchData();
  };

  const handleDelete = async (id: number) => { 
    if (confirm("Are you sure you want to delete this user?")) { 
      await DeleteUser(id); 
      fetchData(); 
    } 
  };

  const getRoleName = (roleId: number) => {
    const role = roles.find(r => r.RoleID === roleId);
    return role ? role.RoleName : "Unknown";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">User Master</h1>
          <p className="text-slate-500">Manage system users and access roles</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus className="h-4 w-4" /> Add User
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10">Loading...</TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-slate-500">No users found.</TableCell>
                </TableRow>
              ) : (
                users.map((u) => (
                  <TableRow key={u.UserID}>
                    <TableCell className="font-bold">{u.Username}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getRoleName(u.RoleID)}
                      </span>
                    </TableCell>
                    <TableCell>{u.Mobile || "-"}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenModal(u)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(u.UserID)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editing ? "Edit User" : "Add User"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Username" 
            value={formData.Username} 
            onChange={(e) => setFormData({ ...formData, Username: e.target.value })} 
            required 
          />
          <Input 
            label={editing ? "Password (leave blank to keep current)" : "Password"} 
            type="password" 
            value={formData.Password} 
            onChange={(e) => setFormData({ ...formData, Password: e.target.value })} 
            required={!editing} 
          />
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Role</label>
            <select 
              className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
              value={formData.RoleID} 
              onChange={(e) => setFormData({ ...formData, RoleID: e.target.value })} 
              required
            >
              <option value="">Select Role</option>
              {roles.map((r: any) => (
                <option key={r.RoleID} value={r.RoleID}>{r.RoleName}</option>
              ))}
            </select>
          </div>
          <Input 
            label="Mobile" 
            value={formData.Mobile} 
            onChange={(e) => setFormData({ ...formData, Mobile: e.target.value })} 
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editing ? "Update User" : "Create User"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
