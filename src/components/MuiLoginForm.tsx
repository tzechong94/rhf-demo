import { DevTool } from "@hookform/devtools"
import { TextField, Button, Stack  } from "@mui/material"
import { useForm } from "react-hook-form"


type FormValues = {
    email: string,
    password: string
}

export const MuiLoginForm = () => {

    const form = useForm({
        defaultValues: {
            email: "",
            password: ""
        }
    }) 

    const { register, handleSubmit, formState, control } = form
    const { errors } = formState

    const onSubmit = (data: FormValues) => {
        console.log(data)
    }

    return (
        <>
            <h1>Login</h1>
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2} width={400}>
                    <TextField 
                    label="Email" 
                    type="email" 
                    {...register("email", {
                        required: "Email is required"
                    })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    />
                            
                    <TextField 
                    label="Password" 
                    type="password" 
                    {...register("password", {
                        required: "Password is required"
                    })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    />
                    

                    <Button type="submit" variant="contained" color="primary">
                        Login
                    </Button>
                </Stack>
            </form>
            <DevTool control={control} /> 
        </>
    )
}