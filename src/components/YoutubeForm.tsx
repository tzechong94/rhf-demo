import { useForm, useFieldArray, FieldErrors } from 'react-hook-form'
import { DevTool } from "@hookform/devtools"
import { useEffect } from 'react'


let renderCount = 0 

type FormValues = {
    username: string,
    email: string,
    channel: string,
    social: {
        twitter: string,
        facebook: string
    },
    phoneNumbers: string[],
    phNumbers: {
        number: string
    }[],
    age: number,
    dob: Date
}

export const YoutubeForm = () => {

    const form = useForm<FormValues>({
        // defaultValues: {
        //     username: "Batman",
        //     email: "",
        //     channel: ""
        // }
        defaultValues: async () => {
            const response = await fetch("https://jsonplaceholder.typicode.com/users/1")
            const data = await response.json()
            return {
                username: 'Batman',
                email: data.email,
                channel: "",
                social: {
                    twitter: "",
                    facebook: ""
                },
                phoneNumbers: ["", ""],
                phNumbers: [{ number: '' }],
                age: 0,
                dob: new Date()
            }
        },
        mode: "all",
    })

    const { register, control, handleSubmit, formState, watch, getValues, setValue, reset, trigger } = form
    const { errors, touchedFields, dirtyFields, isDirty, isValid, isSubmitting, isSubmitted,
    isSubmitSuccessful, submitCount } = formState

    // console.log({touchedFields, dirtyFields, isDirty, isValid})
    console.log({isSubmitting, isSubmitted})
    const { fields, append, remove } = useFieldArray({
        name: 'phNumbers',
        control
    })

    const onSubmit = (data: FormValues) => {
        console.log('Form submitted', data)
    }

    const onError = (errors: FieldErrors<FormValues>) => {
        console.log("Form errors", errors)
    }
    // const watchForm = watch()

    useEffect(() => {
        const subscription = watch((value) => {
            console.log(value)
        })
        return () => subscription.unsubscribe()
    }, [watch])

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset()
        }
    }, [isSubmitSuccessful])

    const handleGetValues = () => {
        console.log("Get values", getValues(["social.twitter", "username", "channel"]))
    }

    const handleSetValue = () => {
        setValue("username", "", {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true
        })
    }

    renderCount++

    return (
        <div>
            <h1>Youtube Form ({renderCount/2})</h1>
            {/* <h2>Watched value: {JSON.stringify(watchForm)}</h2> */}
            <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>

                <div className='form-control'>
                    <label htmlFor="username">Username</label>
                    <input 
                    type="text" 
                    id="username"
                    {...register("username", {
                        required: {
                            value: true,
                            message: 'Username is required'
                        }
                    })}
                    />
                    <p className='error'>{errors.username?.message}</p>
                </div>

                <div className='form-control'>
                    <label htmlFor="email">Email</label>
                    <input 
                    type="email"
                    id="email" 
                    {...register("email", {
                        required: {
                            value: true,
                            message: 'Email is required'
                        },
                        pattern: {
                            value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                            message: 'Invalid email format'
                        },
                        // validate: (fieldValue) => {
                        //     return fieldValue !== "admin@example.com" || 
                        //     "Enter a different email address"
                        // }
                        validate: {
                            notAdmin: (fieldValue) => {
                                return (fieldValue !== "admin@example.com" || 
                                "Enter a different email address"
                                )
                            },
                            notBlackListed: (fieldValue) => {
                                return !fieldValue.endsWith("baddomain.com") ||
                                "This domain is not supported"
                            },
                            emailAvailable: async (fieldValue) => {
                                const response = await fetch(`https://jsonplaceholder.typicode.com/users?email=${fieldValue}`)
                                const data = await response.json()
                                return data.length === 0 || "Email already exists"
                            }
                        },
                    })}/>
                    <p className='error'> {errors.email?.message}</p>
                </div>

                <div className='form-control'>
                    <label htmlFor="channel">Channel</label>
                    <input 
                    type="text" 
                    id="channel"
                    {...register("channel", {
                        required: 'Channel is required'
                    })}
                    />
                </div>
                <p className='error'>{errors.channel?.message}</p>

                <div className='form-control'>
                    <label htmlFor="twitter">Twitter</label>
                    <input 
                    type="text" 
                    id="twitter"
                    {...register("social.twitter", {
                        disabled: watch("channel") === "",
                        required: "Enter twitter profile"
                    })}
                    />
                </div>

                <div className='form-control'>
                    <label htmlFor="facebook">Facebook</label>
                    <input 
                    type="text" 
                    id="facebook"
                    {...register("social.facebook")}
                    />
                </div>

                <div className='form-control'>
                    <label htmlFor="primary-phone">Primary Phone number</label>
                    <input 
                    type="text" 
                    id="primary-phone"
                    {...register("phoneNumbers.0")}
                    />
                </div>

                <div className='form-control'>
                    <label htmlFor="secondary-phone">Secondary Phone number</label>
                    <input 
                    type="text" 
                    id="secondary-phone"
                    {...register("phoneNumbers.1")}
                    />
                </div>

                <div>
                    <label>List of phone numbers</label>
                    <div>
                        {
                        fields.map((field, index) => {
                            return (
                                <div className="form-control" key={field.id}>
                                    <input type="text" {...register(`phNumbers.${index}.number` as const)} />
                                    {
                                        index > 0 && (
                                            <button type="button" onClick={() => remove(index)}>
                                                Remove phone number
                                            </button>
                                        )
                                    }
                                </div>
                            )
                        
                        })
                        }
                        <button type="button" onClick={() => append({number: ''})}>
                            Add phone number
                        </button>
                    </div>
                </div>

                <div className='form-control'>
                    <label htmlFor="age">Age</label>
                    <input 
                    type="number" 
                    id="age"
                    {...register("age", {
                        valueAsNumber: true,
                        required: 'Age is required'
                    })}
                    />
                </div>
                <p className='error'>{errors.age?.message}</p>


                <div className='form-control'>
                    <label htmlFor="dob">Date of birth</label>
                    <input 
                    type="date" 
                    id="dob"
                    {...register("dob", {
                        valueAsDate: true,
                        required: {
                            value: true,
                            message: 'Date of birth is required'
                        }
                    })}
                    />
                </div>
                <p className='error'>{errors.dob?.message}</p>



                <button disabled={!isDirty || isSubmitting} type="submit">Submit</button>
                <button type="button" onClick={handleGetValues}>Get Values</button>
                <button type="button" onClick={() => reset()}>Reset Values</button>
                <button type="button" onClick={handleSetValue}>Set Value</button>
                <button type="button" onClick={()=> trigger()}>Validate</button>

            </form>
            <DevTool control={control}/>
        </div>

    )
}
