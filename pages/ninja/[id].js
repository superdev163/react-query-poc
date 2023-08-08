import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
} from "react-query";
import { useRouter } from "next/router";
import Button from "@material-ui/core/Button";
import { Formik, Form, Field, ErrorMessage } from "formik";
import TextField from "@material-ui/core/TextField";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

export default function Ninja() {
  return (
    <QueryClientProvider client={queryClient}>
      <NinjaData />
    </QueryClientProvider>
  );
}

function NinjaData() {
  const [isEdit, setEdit] = useState(false);
  const [ninjaId, setNinjaId] = useState(null);
  const [name, setName] = useState("");
  const [skills, setSkills] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    const { id } = router.query;
    setNinjaId(id);
  }, [router.isReady]);

  const url =
    "https://6066d55e98f405001728df1e.mockapi.io/ninjas/ninjas/" + ninjaId;
  const { isLoading, error, data } = useQuery(["ninja", { id: ninjaId }], () =>
    fetch(url).then((res) => res.json())
  );

  const changeNinjaData = useMutation(editNinja, {
    onSuccess: (data) => {
      queryClient.setQueryData(["ninja", { id: ninjaId }], data);
    },
  });

  // setEdit(false)
  // setSubmitting(false);

  const ninja = data ?? {};

  return (
    <div className="w-1/2 mx-auto rounded-lg border-solid border-4 border-light-blue-500">
      <div
        className="flex mt-4 items-center justify-around"
        style={{ height: "400px" }}
      >
        <img
          src="https://gamek.mediacdn.vn/133514250583805952/2020/7/22/minatonamikaze-15954344445131022779104.png"
          alt={ninja.name}
          className="w-60 h-60 rounded-full"
        />
        <div>
          {isEdit ? (
            <Formik
              initialValues={{ name: "", skills: "" }}
              validate={(values) => {
                const errors = {};
                if (!values.name) {
                  errors.name = "Required";
                }
                return errors;
              }}
              onSubmit={(values, { setSubmitting }) => {
                changeNinjaData.mutate({
                  name: values.name,
                  skills: values.skills,
                  id: id,
                });
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="text-2xl">
                    Name :
                    <Field
                      className="border border-1 border-black ml-2"
                      type="text"
                      name="name"
                    />
                    <ErrorMessage
                      name="name"
                      render={(msg) => <p style={{ color: "red" }}>{msg}</p>}
                    />
                  </div>
                  <div className="mt-4 text-2xl mb-8">
                    Skills :
                    <Field
                      className="border border-1 border-black ml-2"
                      type="text"
                      name="skills"
                    />
                    <ErrorMessage
                      name="skills"
                      render={(msg) => <p style={{ color: "red" }}>{msg}</p>}
                    />
                  </div>

                  <button
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Submit
                  </button>
                </Form>
              )}
            </Formik>
          ) : (
            <NinjaInfo
              name={ninja.name}
              skills={ninja.skills}
              setEdit={setEdit}
            />
          )}
        </div>
      </div>
    </div>
  );
}

const NinjaInfo = ({ name, skills, setEdit }) => {
  return (
    <>
      <p className="font-bold text-2xl">Name: {name}</p>
      <p className="mt-4 font-bold text-2xl mb-8">Skills: {skills}</p>
      <Button variant="contained" onClick={() => setEdit(true)}>
        Edit
      </Button>
    </>
  );
};

const editNinja = async ({ name, skills, id }) => {
  const res = await fetch(
    "https://6066d55e98f405001728df1e.mockapi.io/ninjas/ninjas/" + id,
    {
      method: "PUT",
      body: JSON.stringify({
        name: name,
        skills: skills,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }
  );
  return res.json();
};
