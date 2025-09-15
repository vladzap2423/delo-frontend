export interface CreateTaskDto {
    title: string;
    creatorId: string;
    commissionId: number;
    file?: File;
}

export interface Task {
    id: number;
    title: string;
    filePath: string | null;
    status: 'in_progress' | 'completed';
    creator: {
        id: number;
        username: string;
        fio: string;
    };
    commission: {
        id: number;
        name: string;
    };
    signs: {
        id: number;
        isSigned: boolean;
        user: {
            id: number;
            fio: string;
            post: string;
        };
    }[];
    createdAt: string;
    updatedAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function createTask(data: CreateTaskDto): Promise<Task> {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('creatorId', String(data.creatorId));
    formData.append('commissionId', String(data.commissionId));


    if (data.file) {
        formData.append('file', data.file);
    }

    const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        руф
        body: formData,
    });

    if (!res.ok) {
        throw new Error(`Failed to create task: ${res.statusText}`);
    }

    return res.json();
}
