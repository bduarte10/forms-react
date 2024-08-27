import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";

// To-do
// [x] - validaçao / transformação (.refine, .superRefine)
// [ ] - Field Arrays
// [ ] - Upload de arquivos
// [ ] - Composition Pattern

const createUserFormSchema = z.object({
  // upload de arquivos:
  // avatar: z.instanceof(FileList).transform((files) => files[0]),
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .transform((name) => {
      return name
        .trim()
        .split(" ")
        .map((word) => {
          return word[0].toUpperCase().concat(word.substring(1));
        })
        .join(" ");
    }),
  email: z.string().min(1, "Email é obrigatório"),
  password: z.string().min(6, "Password deve ter no mínimo 6 caracteres"),
  techs: z
    .array(
      z.object({
        title: z.string().min(1, "Título é obrigatório"),
        yearsOfExperience:
          //input de tipo number recebe string do javascript, para transformar em number, usa o coerce
          z.coerce.number().min(0, "Anos de experiência é obrigatório"),
      })
    )
    .min(1, "Adicione pelo menos uma tecnologia"),
});

type CreateUserFormData = z.infer<typeof createUserFormSchema>;

export function App() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "techs",
  });

  const [output, setOutput] = useState("");

  function createUser(data: CreateUserFormData) {
    setOutput(JSON.stringify(data, null, 2));
  }

  const addTech = () => {
    append({ title: "", yearsOfExperience: 0 });
  };

  return (
    <main className="h-screen flex gap-20 items-center justify-center w-screen bg-zinc-950 text-zinc-50">
      <form
        action=""
        onSubmit={handleSubmit(createUser)}
        className="flex flex-col gap-4 w-full max-w-xs"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            id="name"
            className="border border-zinc-600 text-zinc-50 bg-zinc-800 shadow-sm rounded-md h-10px-3 py-2 px-3"
            {...register("name")}
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="border border-zinc-600 text-zinc-50 bg-zinc-800 shadow-sm rounded-md h-10px-3 py-2 px-3"
            {...register("email")}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="border border-zinc-600 text-zinc-50 bg-zinc-800 shadow-sm rounded-md h-10px-3 py-2 px-3"
            {...register("password")}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="techs" className="flex items-center justify-between">
            Tecnologias
            <button
              className="text-emerald-500 text-sm rounded font-semibold  h-10 "
              type="button"
              onClick={addTech}
            >
              Adicionar
            </button>
          </label>

          {fields.map((field, index) => {
            return (
              <div key={field.id} className="flex gap-2">
                <div className="flex flex-col gap-2 flex-1  ">
                  <input
                    type="text"
                    placeholder="Nome da tecnologia"
                    className=" border border-zinc-600 text-zinc-50 bg-zinc-800 shadow-sm rounded-md h-10  py-2 px-3"
                    {...register(`techs.${index}.title`)}
                  />
                  {errors.techs?.[index]?.title && (
                    <span className="text-red-500 text-sm">
                      {errors?.techs?.[index]?.title?.message}
                    </span>
                  )}
                </div>
                <div className=" w-16 flex flex-col gap-2">
                  <input
                    type="number"
                    min={0}
                    className="  border border-zinc-600 text-zinc-50 bg-zinc-800 shadow-sm rounded-md h-10  py-2 px-3"
                    {...register(`techs.${index}.yearsOfExperience`)}
                  />
                  {errors.techs?.[index]?.yearsOfExperience && (
                    <span className="text-red-500 text-sm">
                      {errors?.techs?.[index]?.yearsOfExperience?.message}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 text-sm rounded font-semibold  h-10 "
                >
                  x
                </button>
              </div>
            );
          })}
          {errors.techs && (
            <span className="text-red-500 text-sm">
              {errors?.techs?.message}
            </span>
          )}
        </div>
        <button
          type="submit"
          className="bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-emerald-600 transition-colors"
        >
          Salvar
        </button>
      </form>
      {output && (
        <div className="flex flex-col gap-4 bg-zinc-800 p-4 rounded-md">
          <h1 className="text-2xl font-bold">Output</h1>
          <pre>{output}</pre>
        </div>
      )}
    </main>
  );
}

export default App;
