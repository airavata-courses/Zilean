import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
    reducerPath: 'authApi',
//     baseQuery:fetchBaseQuery({ baseUrl: process.env.GATEWAY_SERVICE_URL || 'http://127.0.0.1:5006/v1/' }),
    baseQuery:fetchBaseQuery({ baseUrl: 'http://gateway-container:30010/v1/' }),
    tagTypes:['login','signup'],
    endpoints:  (builder) =>({

        createUser: builder.mutation({
            query:({email,password})=>{
                // console.log("Inside pageAPI createUser ",email,password);
                return {
                    url:'user/signup',
                    method:'POST',
                    body:{
                        email: email,
                        password: password,
                    },
                    headers:{
                        // Authorization: `JWT ${data.access_token}`,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                      },
                }
            },
            // invalidatesTags:['login'],
        }),

        logInUser: builder.mutation({
            query:(data)=>{
                // console.log("Inside authApi createUser ",data);
                // console.log("Inside authApi createUser JSON.stringify(data) ",JSON.stringify(data));
                return {
                    url:'user/login',
                    method:'POST',
                    body:data,
                    headers:{
                        // Authorization: `JWT ${data.access_token}`,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                      },
                }
            },
            // invalidatesTags:['login'],
        }),

        logOutUser: builder.mutation({
            query:(data)=>{
                // console.log("Inside authApi logout ",data);
                return {
                    url:'user/logout',
                    method:'POST',
                    body:data,
                    headers:{
                        "Access-Token": data.access_token,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                      },
                }
            },
            // invalidatesTags:['login'],
        }),

        



        /*

        # GET requests reference from last project

        getPageDetailsOfAllPages: builder.query({
            query:(data)=>{

                // console.log("User Id is: ",data.id);
                return{
                    url:'pages/',
                    method:'GET',
                    headers:{
                        Authorization: `JWT ${data.access_token}`,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                      },
                }
            },
            providesTags:['Pages'],

        }),

        getPageDetails: builder.query({
            query:(data)=>{

                // console.log("Page Name: ",data.pageName);
                return{
                    url:`pages/${data.pageName}`,
                    method:'GET',
                    headers:{
                        Authorization: `JWT ${data.access_token}`,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                      },
                }
            },
            providesTags:['Pages'],
        }),

        */

    })
});


export const { useCreateUserMutation, useLogInUserMutation,useLogOutUserMutation } = authApi;

