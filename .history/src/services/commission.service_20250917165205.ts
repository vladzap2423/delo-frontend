import { authorizedFetch } from "./api";

export interface Commission {
  id: number;
  name: string;
  users?: {
    id: number;
    fio: string;
    post: string;
    username: string;
  }[];
}

export async function getAllCommissions() {
  return authorizedFetch<Commission[]>("/commissions", { method: "GET" });
}

export async function createCommission(name: string, userIds: number[]) {
  return authorizedFetch<Commission>("/commissions", {
    method: "POST",
    body: JSON.stringify({ name, userIds }),
  });
}

export async function addUsersToCommission(commissionId: number, userIds: number[]) {
  return authorizedFetch(`/commissions/${commissionId}/add-users`, {
    method: "POST",
    body: JSON.stringify({ userIds }),
  });
}

export async function removeUserFromCommission(commissionId: number, userId: number) {
  return authorizedFetch(`/commissions/${commissionId}/remove-user`, {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
}
