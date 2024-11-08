import { useEffect } from "react";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import useAddressStore from "@/stores/address/addressStore";
import { useMutation } from "@tanstack/react-query";
import direccionService from "@/services/direccionService";
import { useNavigate } from "react-router-dom";

export default function AddressForm({ distritos, direccion = {} }) {
  const {
    handleSubmit,
    register,
    formState: { isValid },
    reset,
  } = useForm({
    defaultValues: {
      ...direccion,
      rememberAddress: false,
    },
  });

  const {
    mutate: createOrUpdateDireccion,
    isPending: isPendingCreateOrUpdateDireccion,
  } = useMutation({
    mutationFn: direccionService.createOrUpdateDireccion,
    onError: (error) => {
      console.log(error);
    },
    onSuccess: () => {
      navigate("/checkout");
    },
  });

  const navigate = useNavigate();

  const { mutate: deleteDireccion, isPending: isPendingDeleteDireccion } =
    useMutation({
      mutationFn: direccionService.deleteDireccion,
      onError: (error) => {
        console.log(error);
      },
      onSuccess: () => {
        navigate("/checkout");
      },
    });

  const setAddress = useAddressStore((state) => state.setAddress);
  const address = useAddressStore((state) => state.address);
  const clearAddress = useAddressStore((state) => state.clearAddress);

  useEffect(() => {
    if (address.nombre) {
      reset(address);
    }
  }, []);

  const onSubmit = async (data) => {
    const distrito = distritos.find(
      (distrito) => distrito.id == data.distritoId
    ).nombre;
    const { rememberAddress, ...restAddress } = data;

    setAddress({ ...data, distrito });

    if (rememberAddress) {
      createOrUpdateDireccion({ data: restAddress });
    } else {
      deleteDireccion();
      clearAddress();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2"
    >
      <div className="flex flex-col mb-2">
        <span>Nombres</span>
        <input
          type="text"
          className="p-2 border rounded-md bg-gray-200"
          {...register("nombre", { required: true })}
        />
      </div>

      <div className="flex flex-col mb-2">
        <span>Apellidos</span>
        <input
          type="text"
          className="p-2 border rounded-md bg-gray-200"
          {...register("apellido", { required: true })}
        />
      </div>

      <div className="flex flex-col mb-2">
        <span>Dirección</span>
        <input
          type="text"
          className="p-2 border rounded-md bg-gray-200"
          {...register("direccion", { required: true })}
        />
      </div>

      <div className="flex flex-col mb-2">
        <span>Distrito</span>
        <select
          className="p-2 border rounded-md bg-gray-200"
          {...register("distritoId", { required: true })}
        >
          <option value="">[ Seleccione ]</option>
          {distritos.map((distrito) => (
            <option key={distrito.id} value={distrito.id}>
              {distrito.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col mb-2">
        <span>Celular</span>
        <input
          type="text"
          className="p-2 border rounded-md bg-gray-200"
          {...register("celular", { required: true })}
        />
      </div>

      <div className="flex flex-col mb-2 sm:mt-1">
        <div className="inline-flex items-center mb-10 ">
          <label
            className="relative flex cursor-pointer items-center rounded-full p-3"
            htmlFor="checkbox"
          >
            <input
              type="checkbox"
              className="border-gray-500 before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
              id="checkbox"
              {...register("rememberAddress")}
            />
            <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </label>

          <span>¿Recordar dirección?</span>
        </div>

        <button
          disabled={
            isPendingCreateOrUpdateDireccion || isPendingDeleteDireccion
          }
          type="submit"
          className={`disabled:opacity-50 disabled:pointer-events-none ${clsx({
            "btn-primary": isValid,
            "btn-disabled": !isValid,
          })}`}
        >
          Siguiente
        </button>
      </div>
    </form>
  );
}