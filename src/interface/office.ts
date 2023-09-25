export interface OfficesResponse {
    code: number;
    message: string;
    data: {
        id: string;
        title: string;
        address: string;
        detail: {
            fullname: string;
            job: string;
            email: string;
            phone: string;
        };
    }[];
};

export interface OfficeAddPayload {
    title: string;
    fullname: string;
    email: string;
    job: string;
    phone: string;
    address: string;
}

export interface keyable {
    [key: string]: any;
}

export interface IconProps {
    id: number;
    open: number;
}

export interface DataForm {
    title?: string;
    fullname?: string;
    email?: string;
    job?: string;
    phone?: string;
    address?: string;
}

export interface GetDataResponse {
    code: boolean;
    message: string;
    data: OfficesResponse[]
}

