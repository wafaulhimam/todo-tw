import { useState, useEffect, useRef } from "react";
import {
    Accordion,
    AccordionHeader,
    AccordionBody,
    Button,
    Spinner,
} from "@material-tailwind/react";
import { PlusIcon, XMarkIcon, PencilIcon, TrashIcon, CheckIcon } from "@heroicons/react/24/solid";
import { v4 as uuid } from "uuid";
import { toast } from 'react-toastify';
import { useGetOffices, useCreateOffice, useDeleteOffice, useUpdateOffice } from '../../hook/useOffice';
import { useForm } from "react-hook-form";
import { OfficeAddPayload, IconProps, GetDataResponse, DataForm, keyable } from "../../interface/office";
import { isEmpty } from "../../utils/locDash";
import Shimmer from "./Shimmer";

function Icon({ id, open }: IconProps) {
    
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className={`${id === open ? "rotate-180" : ""} h-5 w-5 transition-transform`}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    );
}


export default function OfficePage () {
  const { data: dataOffices, isLoading } = useGetOffices();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [open, setOpen] = useState<number>(0);
  const [data, setData] = useState<GetDataResponse[] | any>({});
  const [isShowForm, setIsShowForm] = useState<boolean>(false);
  const { mutateAsync: addOffice, isLoading: isCreateLoading } = useCreateOffice({
    onSuccess: (data: any) => {
        if (data.code === 200) {
            toast(
                <div className="flex justify-center gap-4">
                    <CheckIcon strokeWidth={4} className="h-5 w-5 text-cyan-700" />
                    <p className="uppercase text-black">{data.message}</p>
                </div>)
        }
    }
  });
  const { mutateAsync: deleteOffice, isLoading: isDeleteLoading } = useDeleteOffice({
    onSuccess: (data: any) => {
        if (data.code === 200) {
            toast(
                <div className="flex justify-center gap-4">
                    <CheckIcon strokeWidth={4} className="h-5 w-5 text-cyan-700" />
                    <p className="uppercase text-black">{data.message}</p>
                </div>)
        }
    }
  });
  const refScroll = useRef(null);
  
  const [dataEdit, setDataEdit] = useState<Object>({});
  const [indexEdit, setIndexEdit] = useState<number | null>(null);
  const [idItem, setIdItem] = useState<string>("");
  const { mutateAsync: updateOffice, isLoading: isUpdateLoading } = useUpdateOffice(idItem, {
    onSuccess: (data: any) => {
        if (data.code === 200) {
            toast(
                <div className="flex justify-center gap-4">
                    <CheckIcon strokeWidth={4} className="h-5 w-5 text-cyan-700" />
                    <p className="uppercase text-black">{data.message}</p>
                </div>)
        }

    }
  });

  const handleOpen = (value: any) => setOpen(open === value ? 0 : value);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const onSubmit = async (dataForm: DataForm) => {

    const newLocation = {
        id: uuid(),
        address: dataForm.address,
        title: dataForm.title,
        detail: {
            fullname: dataForm.fullname,
            email: dataForm.email,
            job: dataForm.job,
            phone: dataForm.phone,
        }    
    }

    try {
        await addOffice(dataForm as OfficeAddPayload);
        setData((prevState: any) => {
            return {
                ...prevState,
                data: prevState.data.concat(newLocation),
            }
        })
        reset();
        setIsShowForm(false);
    } catch (error) {
    }
  }

  const onSubmitEdit = async (dataForm: DataForm) => {

    if (!!dataEdit) {
        let tempData = [...data.data] as any;
        tempData.splice(indexEdit, 1);
        setData((prevState: any) => {
            return {
                ...prevState,
                data: tempData,
            }
        })
    }

    const newLocation = {
        id: uuid(),
        address: dataForm.address,
        title: dataForm.title,
        detail: {
            fullname: dataForm.fullname,
            email: dataForm.email,
            job: dataForm.job,
            phone: dataForm.phone,
        }    
    }

    try {
        await updateOffice(dataForm as OfficeAddPayload);
        setData((prevState: any) => {
            return {
                ...prevState,
                data: prevState.data.concat(newLocation),
            }
        })
        reset();
        setIsShowForm(false);
    } catch (error) {
    }
  }

  const handleOpenForm = () => {
    setIsShowForm(true);
    reset({});
    setDataEdit({});
    setIndexEdit(null);
    setIdItem("")
  }

  const handleCloseForm = () => {
    setIsShowForm(false);
  }

  const handleDelete = async (id: number, index: number) => {
    let tempData = [...data.data]
    tempData.splice(index, 1);
    setData((prevState: any) => {
        return {
            ...prevState,
            data: tempData,
        }
    })
    await deleteOffice(id.toString());
  }

  const handleEdit = (list: keyable, index: number) => {
    setDataEdit(list);
    setIdItem(list.id);
    setIndexEdit(index);
    reset({
        id: list.id,
        title: list.title,
        address: list.address,
        email: list.detail.email,
        fullname: list.detail.fullname,
        job: list.detail.job,
        phone: list.detail.phone,
    })
    setIsShowForm(true);
    scrollToTop();
  }

  useEffect(() => {
    setData(dataOffices as GetDataResponse[] | any)
  }, [dataOffices]);

  return (
    <div className="bg-blue-gray-100 w-screen h-full">
        {isLoading ? (
            <Shimmer />
        ) : (
            <div className="flex justify-center items-center">
                <div className="w-[380px] flex flex-col justify-center items-center mt-[120px] gap-6">
                    <h2 className="font-sans text-6xl text-cyan-700">Offices</h2>
                    {isShowForm ? (
                        <div className="w-full bg-white p-6 rounded-md">
                            <div className="flex justify-between mb-10" onClick={handleCloseForm}>
                                <h5 className="text-black font-bold text-base" ref={refScroll}>New Location</h5>
                                <div><XMarkIcon strokeWidth={4} className="h-5 w-5 text-black cursor-pointer" /></div>
                            </div>
                            <form onSubmit={isEmpty(dataEdit) ? handleSubmit(onSubmit) : handleSubmit(onSubmitEdit)} className="flex flex-col gap-3">
                                <div className="flex flex-col gap-2">
                                    <h6 className="text-black">Title *</h6>
                                    <input
                                        className="rounded-md h-10 bg-white text-black border-[1px] border-black border-solid p-3"
                                        type="text"
                                        placeholder="Headquarters"
                                        {...register("title", {
                                            required: "title is a required field"
                                        })}
                                    />
                                    {errors.title && <p className="text-red-200 text-xs">{errors.title?.message?.toString()}</p>}
                                </div>
                                <div className="flex flex-col gap-2 mb-2">
                                    <h6 className="text-black">Enter the address *</h6>
                                    <input
                                        className="rounded-md h-10 bg-white text-black border-[1px] border-black border-solid p-3"
                                        placeholder="3763 W. Dallas St."
                                        type="text" {...register("address", {
                                            required: "address is a required field"
                                        })}
                                    />
                                    {errors.address && <p className="text-red-200 text-xs">{errors.address?.message?.toString()}</p>}
                                </div>
        
                                <h6 className="text-cyan-700 text-base uppercase font-sans">Contact Information</h6>
                                <div className="w-full h-0.5 bg-gray-200" />
                                <div className="flex flex-col gap-2">
                                    <h6 className="text-black">Full name *</h6>
                                    <input
                                        className="rounded-md h-10 bg-white text-black border-[1px] border-black border-solid p-3"
                                        type="text"
                                        placeholder="John Michael"
                                        {...register("fullname", {
                                            required: "fullname is a required field"
                                        })}
                                    />
                                    {errors.fullname && <p className="text-red-200 text-xs">{errors.fullname?.message?.toString()}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h6 className="text-black">Job position *</h6>
                                    <input
                                        className="rounded-md h-10 bg-white text-black border-[1px] border-black border-solid p-3"
                                        placeholder="Software Developer"
                                        type="text"
                                        {...register("job", {
                                            required: "job is a required field"
                                        })}
                                    />
                                    {errors.job && <p className="text-red-200 text-xs">{errors.job?.message?.toString()}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h6 className="text-black">Email *</h6>
                                    <input
                                        className="rounded-md h-10 bg-white text-black border-[1px] border-black border-solid p-3"
                                        placeholder="name@example.com"
                                        type="text" {...register("email", {
                                            required: "email is a required field",
                                            pattern: {
                                                value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                                                message: "email must be a valid email"
                                            }
                                        })}
                                    />
                                    {errors.email && <p className="text-red-200 text-xs">{errors.email?.message?.toString()}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h6 className="text-black">Phone *</h6>
                                    <input
                                        className="rounded-md h-10 bg-white text-black border-[1px] border-black border-solid p-3"
                                        type="text"
                                        placeholder="(xxx) xxx-xxxx"
                                        {...register("phone", {
                                            required: "phone is a required field"
                                        })}
                                    />
                                    {errors.phone && <p className="text-red-200 text-xs">{errors.phone?.message?.toString()}</p>}
                                </div>
                                
                                <Button
                                    type="submit"
                                    className="bg-cyan-700 w-[fit-content]"
                                    disabled={isCreateLoading || isUpdateLoading}
                                >
                                    {isCreateLoading || isUpdateLoading ? (<Spinner className="h-5 w-5 text-white" />) : ('Save')}
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-cyan-700 w-full rounded-md h-10 flex px-6 items-center justify-between cursor-pointer" onClick={handleOpenForm}>
                            <h6>
                                Add New Location
                            </h6>
                            <div>
                                <PlusIcon strokeWidth={4} className="h-5 w-5" />
                            </div>
                        </div>
                    )}
    
                    {data?.data?.map((list: keyable, index: number) => (
                        <div key={`data-${index}`} className="w-full border-white border-solid border-0 rounded-md bg-white">
                            <Accordion
                                open={open === index}
                                icon={<Icon id={index} open={open} />}
                            >
                                <AccordionHeader onClick={() => handleOpen(index)} className={open === index ? 'bg-gray-600 text-white hover:text-white rounded-t-md rounded-b-none' : 'bg-white'}>
                                    <div className="flex flex-col">
                                        <h4 className="text-2xl">
                                            {list.title}
                                        </h4>
                                        <p className="text-base">{list.address}</p>
                                    </div>
                                </AccordionHeader>
                                <AccordionBody>
                                    <div className="flex flex-col p-7 bg-white gap-2">
                                        <h6 className="text-xl font-bold">{list.detail.fullname}</h6>
                                        <p className="text-base">{list.detail.job}</p>
                                        <p className="text-base text-cyan-700">{list.detail.email}</p>
                                        <p className="text-base">{list.detail.phone}</p>
                                        <div className="w-full h-0.5 bg-gray-200" />
                                        <div className="flex justify-between">
                                            <div className="flex justify-between gap-2 cursor-pointer" onClick={() => handleEdit(list, index)}>
                                                <PencilIcon strokeWidth={4} className="h-5 w-5 text-black cursor-pointer" />
                                                <p className="text-base uppercase text-gray-700">Edit</p>
                                            </div>

                                            <div className="flex justify-between gap-2 cursor-pointer" onClick={() => handleDelete(list.id, index)}>
                                                {/* <TrashIcon strokeWidth={4} className="h-5 w-5 text-red-500 cursor-pointer" />
                                                <p className="text-base uppercase text-red-500">Hapus</p> */}
                                                {isDeleteLoading && Number(index) === Number(indexEdit) ? (
                                                    <Spinner className="h-5 w-5 text-cyan-700" />
                                                ) : (
                                                    <>
                                                        <TrashIcon strokeWidth={4} className="h-5 w-5 text-red-500 cursor-pointer" />
                                                        <p className="text-base uppercase text-red-500">Hapus</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </AccordionBody>
                            </Accordion>
                        </div>
                    ))}

                    <div className="flex flex-col mb-[120px]">
                        <p className="text-gray-500 text-base">This project is for test purpose only</p>
                        <p className="uppercase cursor-pointer text-cyan-700 text-lg">www.doganponystudios.com</p>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}
