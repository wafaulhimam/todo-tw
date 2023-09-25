import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchOffices, addOffice, deleteOffice, updateOffice } from "../api/mocks";
import { OfficeAddPayload } from "../interface/office";

const key = 'offices';

export const useGetOffices = () => {
    return useQuery([key], fetchOffices);
}

export const useCreateOffice = (extraParams: any) =>
    useMutation((body : OfficeAddPayload) => addOffice(body), {
    ...extraParams,
});

export const useDeleteOffice = (extraParams: any) =>
    useMutation((id: string) => deleteOffice(id), {
    ...extraParams,
});

export const useUpdateOffice = (id: string, extraParams: any) =>
    useMutation((body: OfficeAddPayload) => updateOffice(id, body), {
    ...extraParams,
});
